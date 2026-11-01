"""aliyaabdullah.com form notification backend.

POST /api/submit accepts quote and contact forms and sends notification emails
through the Gmail API with OAuth 2.0 refresh-token authentication.

Render environment variables:
    GMAIL_CLIENT_ID       Google OAuth client ID
    GMAIL_CLIENT_SECRET   Google OAuth client secret
    GMAIL_REFRESH_TOKEN   Refresh token with the gmail.send scope
    GMAIL_SENDER_EMAIL    Email address of the authorized sending account
    NOTIFY_TO_EMAIL       Not used: owner inbox is fixed below
    SUPPORT_EMAIL         Email shown in notification footer
    ALLOWED_ORIGINS       Comma-separated allowed website origins
    ALLOWED_ORIGIN_REGEX  Regex for any additional preview origins

Important: The Gmail From display name is the customer's name, but the actual
From address must be an authenticated Gmail account or verified send-as alias.
To avoid Gmail showing "me" in the owner inbox, use a DIFFERENT authenticated
Gmail sender account and issue its own OAuth refresh token.
"""

from __future__ import annotations

import base64
import html
import logging
import os
import re
import time
from collections import defaultdict, deque
from datetime import datetime, timezone
from email.message import EmailMessage
from email.utils import formataddr
from typing import Literal, Optional

import httpx
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field, field_validator

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger("aliyaabdullah-forms")

SITE_NAME = "aliyaabdullah.com"
# All submissions are delivered to this one inbox, regardless of which form.
OWNER_EMAIL = "aliaabdullah1211@gmail.com"
TOKEN_URL = "https://oauth2.googleapis.com/token"
GMAIL_SEND_URL = "https://gmail.googleapis.com/gmail/v1/users/me/messages/send"

RATE_LIMIT_MAX = 5
RATE_LIMIT_WINDOW_SECONDS = 10 * 60

FORM_TITLES = {
    "quote": "Quote request",
    "contact": "Contact message",
}


def env(name: str, default: str = "") -> str:
    return (os.environ.get(name) or default).strip()


def split_csv(value: str) -> list[str]:
    return [item.strip() for item in value.split(",") if item.strip()]


# --------------------------------------------------------------------------- #
# App + CORS
# --------------------------------------------------------------------------- #

app = FastAPI(
    title=f"{SITE_NAME} forms API",
    version="1.3.0",
    docs_url=None,
    redoc_url=None,
)

ALLOWED_ORIGINS = split_csv(
    env(
        "ALLOWED_ORIGINS",
        "https://aliyaabdullah.com,https://www.aliyaabdullah.com,http://localhost:8080",
    )
)
ALLOWED_ORIGIN_REGEX = env(
    "ALLOWED_ORIGIN_REGEX",
    r"https://(?:[a-z0-9-]+\.)*(?:onrender\.com|lovable\.app)",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=ALLOWED_ORIGIN_REGEX or None,
    allow_methods=["POST", "GET", "OPTIONS"],
    allow_headers=["Content-Type"],
    max_age=86400,
)


# --------------------------------------------------------------------------- #
# Shared request model for all forms
# --------------------------------------------------------------------------- #

class Submission(BaseModel):
    form_type: Literal["quote", "contact"]
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    phone: Optional[str] = Field(default=None, max_length=40)
    company: Optional[str] = Field(default=None, max_length=160)
    subject: Optional[str] = Field(default=None, max_length=200)
    message: str = Field(min_length=1, max_length=5000)
    details: dict[str, str] = Field(default_factory=dict)
    page: Optional[str] = Field(default=None, max_length=500)
    website: Optional[str] = Field(default=None, max_length=500)  # Honeypot

    @field_validator("name", "message", "phone", "company", "subject", mode="before")
    @classmethod
    def strip_text(cls, value):
        return value.strip() if isinstance(value, str) else value

    @field_validator("name", "subject", "phone", "company")
    @classmethod
    def single_line(cls, value):
        if value and ("\n" in value or "\r" in value):
            raise ValueError("must be a single line")
        return value

    @field_validator("details")
    @classmethod
    def limit_details(cls, value: dict[str, str]):
        if len(value) > 20:
            raise ValueError("too many details")
        for key, item in value.items():
            if len(key) > 60 or len(item) > 500:
                raise ValueError("detail too long")
        return value


# --------------------------------------------------------------------------- #
# Rate limiting (in memory; works per running application instance)
# --------------------------------------------------------------------------- #

_hits: dict[str, deque[float]] = defaultdict(deque)


def client_ip(request: Request) -> str:
    # Use proxy-forwarded headers only if your reverse proxy sanitizes them.
    forwarded = request.headers.get("x-forwarded-for", "")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def check_rate_limit(ip: str, now: Optional[float] = None) -> bool:
    now = time.monotonic() if now is None else now
    hits = _hits[ip]
    while hits and now - hits[0] > RATE_LIMIT_WINDOW_SECONDS:
        hits.popleft()
    if len(hits) >= RATE_LIMIT_MAX:
        return False
    hits.append(now)
    return True


# --------------------------------------------------------------------------- #
# Email building
# --------------------------------------------------------------------------- #

def quote_service(sub: Submission) -> str:
    """Extract only the selected service for the quote email's subject."""
    service = ""
    for key, value in sub.details.items():
        if key.strip().lower() in {"service", "service type", "selected service"}:
            service = value.strip()
            if service:
                break

    if not service and sub.subject:
        service = re.sub(
            r"^\s*quote\s*request\s*[-\u2013\u2014:]\s*",
            "",
            sub.subject,
            flags=re.IGNORECASE,
        ).strip()
        if service.lower() == "quote request":
            service = ""

    # Keep the email header on one line, even for untrusted detail values.
    service = " ".join(service.split())
    return service[:120]


def email_subject(sub: Submission) -> str:
    if sub.form_type == "contact":
        return "Contact message"
    service = quote_service(sub)
    return f"Quote request — {service}" if service else "Quote request"


def summary_rows(sub: Submission) -> list[tuple[str, str]]:
    """One clear row per value; avoid repeating a quote's service/subject."""
    rows: list[tuple[str, str]] = [
        ("Name", sub.name),
        ("Email", str(sub.email)),
    ]
    if sub.phone:
        rows.append(("Phone", sub.phone))
    if sub.company:
        rows.append(("Company", sub.company))

    if sub.form_type == "quote":
        service = quote_service(sub)
        if service:
            rows.append(("Service", service))

        if sub.subject:
            subject = sub.subject.strip()
            # The form often sends "Quote request — Trading Services" as its
            # subject. Don't display that again when Service already says it.
            duplicates = {
                "quote request",
                email_subject(sub).casefold(),
                service.casefold(),
            }
            if subject.casefold() not in duplicates:
                rows.append(("Additional subject", subject))
    elif sub.subject:
        rows.append(("Subject", sub.subject))

    for key, value in sub.details.items():
        if not value.strip():
            continue
        if sub.form_type == "quote" and key.strip().lower() in {
            "service", "service type", "selected service"
        }:
            continue
        rows.append((key.strip(), value))
    return rows


def build_message(
    sub: Submission,
    sender: str,
    recipient: str,
    support_email: str,
) -> EmailMessage:
    """Mobile-first Gmail-friendly, single-column owner notification."""
    received = datetime.now(timezone.utc).strftime("%d %b %Y, %H:%M UTC")
    rows = summary_rows(sub)
    title = FORM_TITLES[sub.form_type]

    text_lines = [f"New {title.lower()}", f"Submitted by: {sub.name}", ""]
    text_lines += [f"{label}: {value}" for label, value in rows]
    text_lines += ["", "Message:", sub.message, "", f"Received: {received}"]
    if sub.page:
        text_lines.append(f"Page: {sub.page}")
    text_lines += [
        "",
        f"Reply to this message to respond to {sub.name} ({sub.email}).",
        f"Website: {SITE_NAME}",
        f"Support: {support_email}",
    ]

    esc = html.escape
    # A label is ABOVE its value on every screen: no side-by-side columns.
    # word-break also handles long email addresses on narrow mobile screens.
    field_rows = "".join(
        '<tr><td style="padding:13px 0;border-bottom:1px solid #e9e9e3;'
        'vertical-align:top;word-break:break-word;overflow-wrap:anywhere">'
        '<div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;'
        'font-weight:700;letter-spacing:.3px;line-height:18px;color:#58655d">'
        f'{esc(label)}</div>'
        '<div style="font-family:Arial,Helvetica,sans-serif;font-size:16px;'
        'line-height:24px;font-weight:400;color:#19271e;'
        'white-space:normal;word-break:break-word;overflow-wrap:anywhere">'
        f'{esc(value)}</div>'
        '</td></tr>'
        for label, value in rows
    )

    message_html = esc(sub.message).replace("\n", "<br>")
    page_html = (
        '<tr><td style="padding-top:8px;font-family:Arial,Helvetica,sans-serif;'
        'font-size:12px;line-height:19px;color:#536159;'
        'word-break:break-all;overflow-wrap:anywhere">'
        f'Form page: {esc(sub.page)}</td></tr>'
        if sub.page else ""
    )
    type_label = "QUOTE REQUEST" if sub.form_type == "quote" else "CONTACT MESSAGE"

    # Table-based layout + inline styles are widely supported by Gmail.
    # A light neutral palette avoids the low-contrast dark header shown in the
    # earlier screenshots. Gmail can still apply its own dark-mode processing.
    html_body = f"""\
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <style>
    @media only screen and (max-width: 480px) {{
      .outer-padding {{ padding: 10px !important; }}
      .inner-padding {{ padding: 20px !important; }}
      .email-heading {{ font-size: 23px !important; line-height: 30px !important; }}
    }}
  </style>
</head>
<body style="margin:0;padding:0;background-color:#f5f5ef;width:100%;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0"
         width="100%" bgcolor="#f5f5ef"
         style="width:100%;border-collapse:collapse;background-color:#f5f5ef">
    <tr><td align="center" class="outer-padding" style="padding:20px 12px">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0"
             width="100%" bgcolor="#ffffff"
             style="width:100%;max-width:600px;border-collapse:collapse;background-color:#ffffff;">
        <tr><td bgcolor="#eef3ec" class="inner-padding"
                style="padding:26px 28px 23px;border-top:5px solid #176342;
                       background-color:#eef3ec;">
          <div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;
                      line-height:19px;font-weight:700;letter-spacing:1.5px;
                      color:#176342;">ALIYAABDULLAH.COM</div>
          <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;
                      line-height:18px;font-weight:700;letter-spacing:1px;
                      margin-top:12px;color:#4b6655;">{type_label}</div>
          <div class="email-heading" style="font-family:Arial,Helvetica,sans-serif;
                      font-size:27px;line-height:34px;font-weight:700;
                      margin-top:5px;color:#172b20;">
            New {esc(title.lower())}
          </div>
          <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;
                      line-height:21px;margin-top:9px;color:#435748;
                      word-break:break-word;overflow-wrap:anywhere;">
            Submitted by <strong>{esc(sub.name)}</strong>
          </div>
        </td></tr>

        <tr><td bgcolor="#ffffff" class="inner-padding"
                style="padding:22px 28px 28px;background-color:#ffffff;">
          <div style="font-family:Arial,Helvetica,sans-serif;
                      font-size:15px;line-height:23px;font-weight:700;
                      color:#172b20;">Submission details</div>
          <table role="presentation" cellpadding="0" cellspacing="0"
                 border="0" width="100%" style="width:100%;border-collapse:collapse;">
            {field_rows}
          </table>

          <div style="font-family:Arial,Helvetica,sans-serif;
                      font-size:15px;line-height:23px;font-weight:700;
                      margin-top:25px;margin-bottom:10px;color:#172b20;">
            Message
          </div>
          <table role="presentation" cellpadding="0" cellspacing="0"
                 border="0" width="100%" bgcolor="#f0f3ed"
                 style="width:100%;border-collapse:collapse;background-color:#f0f3ed;">
            <tr><td style="padding:16px;font-family:Arial,Helvetica,sans-serif;
                           font-size:15px;line-height:24px;color:#21352a;
                           word-break:break-word;overflow-wrap:anywhere;">
              {message_html}
            </td></tr>
          </table>

          <table role="presentation" cellpadding="0" cellspacing="0" border="0"
                 width="100%" style="width:100%;margin-top:19px;border-collapse:collapse;">
            <tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:12px;
                           line-height:19px;color:#536159;">
              Received {esc(received)}
            </td></tr>
            {page_html}
          </table>
          <div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;
                      line-height:21px;margin-top:20px;color:#31513d;">
            Tap <strong>Reply</strong> to respond to {esc(sub.name)}.
          </div>
        </td></tr>

        <tr><td align="center" bgcolor="#f5f5ef"
                style="padding:18px 12px;font-family:Arial,Helvetica,sans-serif;
                       font-size:12px;line-height:19px;color:#536159;
                       word-break:break-word;overflow-wrap:anywhere;">
          {esc(SITE_NAME)} &middot; {esc(support_email)}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>"""

    msg = EmailMessage()
    # Display ONLY the visitor's name. The email address itself must still
    # be the authenticated Gmail sender (or a verified send-as alias).
    msg["From"] = formataddr((sub.name, sender))
    msg["To"] = recipient
    msg["Reply-To"] = formataddr((sub.name, str(sub.email)))
    msg["Subject"] = email_subject(sub)
    msg.set_content("\n".join(text_lines))
    msg.add_alternative(html_body, subtype="html")
    return msg


def encode_raw(msg: EmailMessage) -> str:
    return base64.urlsafe_b64encode(msg.as_bytes()).decode("ascii").rstrip("=")


# --------------------------------------------------------------------------- #
# Gmail API
# --------------------------------------------------------------------------- #

_token_cache: dict[str, float | str] = {"value": "", "expires_at": 0.0}


class GmailConfigError(RuntimeError):
    pass


def gmail_settings() -> dict[str, str]:
    settings = {
        "client_id": env("GMAIL_CLIENT_ID"),
        "client_secret": env("GMAIL_CLIENT_SECRET"),
        "refresh_token": env("GMAIL_REFRESH_TOKEN"),
        "sender": env("GMAIL_SENDER_EMAIL"),
    }
    missing = [name for name, value in settings.items() if not value]
    if missing:
        raise GmailConfigError(f"Missing Gmail settings: {', '.join(missing)}")
    return settings


async def get_access_token(client: httpx.AsyncClient, settings: dict[str, str]) -> str:
    if _token_cache["value"] and time.time() < float(_token_cache["expires_at"]) - 60:
        return str(_token_cache["value"])

    response = await client.post(
        TOKEN_URL,
        data={
            "client_id": settings["client_id"],
            "client_secret": settings["client_secret"],
            "refresh_token": settings["refresh_token"],
            "grant_type": "refresh_token",
        },
    )
    if response.status_code != 200:
        log.error("Google token refresh failed [%s]: %s", response.status_code, response.text)
        raise HTTPException(
            status_code=502,
            detail="Email service is temporarily unavailable. Please try again later.",
        )

    data = response.json()
    _token_cache["value"] = data["access_token"]
    _token_cache["expires_at"] = time.time() + int(data.get("expires_in", 3600))
    return data["access_token"]


async def send_via_gmail(msg: EmailMessage, settings: dict[str, str]) -> None:
    async with httpx.AsyncClient(timeout=20) as client:
        token = await get_access_token(client, settings)
        response = await client.post(
            GMAIL_SEND_URL,
            headers={"Authorization": f"Bearer {token}"},
            json={"raw": encode_raw(msg)},
        )
        if response.status_code == 401:
            _token_cache["value"] = ""
            token = await get_access_token(client, settings)
            response = await client.post(
                GMAIL_SEND_URL,
                headers={"Authorization": f"Bearer {token}"},
                json={"raw": encode_raw(msg)},
            )

    if response.status_code >= 300:
        log.error("Gmail send failed [%s]: %s", response.status_code, response.text)
        raise HTTPException(
            status_code=502,
            detail="We couldn't send your message. Please try again later.",
        )


# --------------------------------------------------------------------------- #
# Routes
# --------------------------------------------------------------------------- #

@app.get("/")
async def root():
    return {"service": f"{SITE_NAME} forms API", "status": "ok"}


@app.get("/health")
async def health():
    try:
        gmail_settings()
        configured = True
    except GmailConfigError:
        configured = False
    sender = env("GMAIL_SENDER_EMAIL")
    return {
        "status": "ok",
        "email_configured": configured,
        "sender_separate_from_owner": bool(sender) and sender.casefold() != OWNER_EMAIL.casefold(),
    }


@app.post("/api/submit")
async def submit(submission: Submission, request: Request):
    if submission.website:
        log.info("Honeypot triggered from %s", client_ip(request))
        return {"ok": True}

    if not check_rate_limit(client_ip(request)):
        raise HTTPException(
            status_code=429,
            detail="Too many messages. Please try again in a few minutes.",
        )

    try:
        settings = gmail_settings()
    except GmailConfigError as exc:
        log.error(str(exc))
        raise HTTPException(
            status_code=503,
            detail="The form service isn't configured yet. Please email us directly.",
        )

    # Fixed destination: do not let a stale Render NOTIFY_TO_EMAIL send
    # customer information to a different recipient.
    if settings["sender"].casefold() == OWNER_EMAIL.casefold():
        log.warning(
            "Sender and recipient are the same Gmail account; inbox may show 'me'. "
            "Authorize a separate sending Gmail account with a new refresh token."
        )

    support_email = env("SUPPORT_EMAIL", "info@aliyaabdullah.com")
    msg = build_message(submission, settings["sender"], OWNER_EMAIL, support_email)
    await send_via_gmail(msg, settings)
    log.info("Sent %s submission to owner inbox", submission.form_type)
    return {"ok": True}
