"""aliyaabdullah.com form notification backend.

POST /api/submit accepts quote, contact and inquiry forms and sends notification emails
through the Gmail API with OAuth 2.0 refresh-token authentication.

Render environment variables:
    GMAIL_CLIENT_ID       Google OAuth client ID
    GMAIL_CLIENT_SECRET   Google OAuth client secret
    GMAIL_REFRESH_TOKEN   Refresh token with the gmail.send scope
    GMAIL_SENDER_EMAIL    Email address of the authorized sending account
    NOTIFY_TO_EMAIL       Optional, ignored: owner inbox is fixed below
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
    "inquiry": "Contact message",
    "inquire": "Contact message",
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
    version="1.4.0",
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
    form_type: Literal["quote", "contact", "inquiry", "inquire"]
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
    """Stay consistent with the user's short, recognizable subjects."""
    if sub.form_type != "quote":
        return "Contact message"
    service = quote_service(sub)
    return f"Quote request — {service}" if service else "Quote request"


def message_details(sub: Submission) -> list[tuple[str, str]]:
    """Compact contextual info placed AFTER the visitor's message.

    The customer message is the email body, not a form data table.
    """
    details: list[tuple[str, str]] = []

    if sub.form_type == "quote":
        service = quote_service(sub)
        if service:
            details.append(("Service", service))

    if sub.subject:
        subject = sub.subject.strip()
        skip = {email_subject(sub).casefold(), "quote request"}
        if sub.form_type == "quote":
            skip.add(quote_service(sub).casefold())
        if subject.casefold() not in skip:
            details.append(("Regarding", subject))

    if sub.company:
        details.append(("Company", sub.company))
    if sub.phone:
        details.append(("Phone", sub.phone))

    service_keys = {"service", "service type", "selected service"}
    for key, value in sub.details.items():
        clean_key = " ".join(key.split())
        clean_value = str(value).strip()
        if not clean_value:
            continue
        if sub.form_type == "quote" and clean_key.lower() in service_keys:
            continue
        # Do not repeat keys already explicitly displayed.
        if clean_key.lower() in {"company", "phone", "name", "email"}:
            continue
        details.append((clean_key, clean_value))
    return details


def build_message(
    sub: Submission,
    sender: str,
    recipient: str,
    support_email: str,
) -> EmailMessage:
    """Make both quote and inquiry notifications read like personal emails.

    The actual From email must be an authorized Gmail address (NOT the
    unverified visitor). Their name is the display name and Reply-To routes
    the owner's Reply to their submitted email address.
    """
    now = datetime.now(timezone.utc).strftime("%d %b %Y at %H:%M UTC")
    name = sub.name
    visitor_email = str(sub.email)
    details = message_details(sub)

    # Start the plain-text part with the actual visitor's words. Gmail's inbox
    # preview should show their message rather than "New form submission".
    text_lines = [
        sub.message,
        "",
        f"— {name}",
        visitor_email,
    ]
    if details:
        text_lines += ["", "-----", *[f"{label}: {value}" for label, value in details]]
    text_lines += [
        "",
        "-----",
        f"Sent through {SITE_NAME} on {now}.",
        f"Reply to this email to contact {name} directly.",
    ]

    esc = html.escape
    # Never interpolate customer text directly into HTML; escape first.
    message_html = esc(sub.message).replace("\r\n", "\n").replace("\n", "<br>")
    contact_email = esc(visitor_email, quote=True)
    name_html = esc(name)
    detail_rows = "".join(
        '<tr><td style="padding:7px 0 1px;color:#737973;'
        'font-size:12px;font-family:Arial,sans-serif;">'
        f'{esc(label)}</td></tr>'
        '<tr><td style="padding:0 0 10px;color:#27352d;font-size:14px;'
        'line-height:21px;word-break:break-word;overflow-wrap:anywhere;'
        'font-family:Arial,sans-serif;">'
        f'{esc(value)}</td></tr>'
        for label, value in details
    )

    details_html = (
        '<tr><td style="padding:18px 0 0">'
        '<div style="border-top:1px solid #e6eae5;padding-top:15px;'
        'font:600 12px Arial,sans-serif;letter-spacing:.3px;'
        'color:#5c685f">'
        + ("QUOTE DETAILS" if sub.form_type == "quote" else "MESSAGE DETAILS")
        + '</div>'
        '<table role="presentation" cellspacing="0" cellpadding="0" border="0" '
        'width="100%" style="border-collapse:collapse;width:100%;margin-top:7px">'
        + detail_rows + '</table></td></tr>'
        if details else ""
    )

    # Neutral, single-column message styling. It intentionally resembles a
    # normal correspondence more than a website form or an admin dashboard.
    html_body = f"""\
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
</head>
<body style="margin:0;padding:0;background-color:#ffffff;color:#202a22;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0"
         width="100%" style="border-collapse:collapse;width:100%;background:#ffffff">
    <tr><td align="center" style="padding:20px 16px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0"
             width="100%" style="border-collapse:collapse;width:100%;max-width:600px;">
        <tr><td style="padding:10px 0 14px;word-break:break-word;overflow-wrap:anywhere;">
          <div style="font:400 16px/1.75 Arial,Helvetica,sans-serif;
                      color:#202a22;word-break:break-word;overflow-wrap:anywhere;">
            {message_html}
          </div>
        </td></tr>
        <tr><td style="padding:7px 0 5px;">
          <div style="font:600 15px/1.5 Arial,Helvetica,sans-serif;color:#263a2c;">
            &mdash; {name_html}
          </div>
          <div style="font:400 13px/1.5 Arial,Helvetica,sans-serif;
                      color:#526458;word-break:break-word;overflow-wrap:anywhere;">
            <a href="mailto:{contact_email}" style="color:#326c4e;text-decoration:none;">
              {contact_email}
            </a>
          </div>
        </td></tr>
        {details_html}
        <tr><td style="border-top:1px solid #e6eae5;padding:17px 0 0;">
          <div style="font:400 11px/1.65 Arial,Helvetica,sans-serif;color:#7a817b;">
            Sent via {esc(SITE_NAME)} &middot; {esc(now)}<br>
            Reply to this email to respond to {name_html}.
          </div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>"""

    msg = EmailMessage()
    # The display name is dynamic; the actual address is the Gmail-authorized
    # sender/alias. An arbitrary website visitor's email cannot go in From.
    msg["From"] = formataddr((name, sender))
    msg["To"] = recipient
    msg["Reply-To"] = formataddr((name, visitor_email))
    msg["Subject"] = email_subject(sub)
    msg["X-Website-Form"] = "quote" if sub.form_type == "quote" else "contact"
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
