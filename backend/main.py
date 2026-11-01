"""aliyaabdullah.com form backend.

One endpoint — POST /api/submit — receives every form on the website
(quote requests, contact messages, …) and emails the submission to the
owner's Gmail inbox through the Gmail API (OAuth refresh-token flow).

Environment variables (set them in Render → Environment):
    GMAIL_CLIENT_ID        OAuth client ID from Google Cloud
    GMAIL_CLIENT_SECRET    OAuth client secret from Google Cloud
    GMAIL_REFRESH_TOKEN    Refresh token with the gmail.send scope
    GMAIL_SENDER_EMAIL     The Gmail account that sends (and owns the token)
    NOTIFY_TO_EMAIL        Optional. Where submissions are delivered
                           (comma-separated). Defaults to GMAIL_SENDER_EMAIL.
    SUPPORT_EMAIL          Optional. Shown in the email footer.
                           Defaults to info@aliyaabdullah.com.
    ALLOWED_ORIGINS        Optional. Comma-separated list of sites allowed to
                           call the API. Defaults to aliyaabdullah.com + www.
    ALLOWED_ORIGIN_REGEX   Optional. Extra origins as a regex
                           (defaults to Render and Lovable preview domains).
"""

from __future__ import annotations

import base64
import html
import logging
import os
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
TOKEN_URL = "https://oauth2.googleapis.com/token"
GMAIL_SEND_URL = "https://gmail.googleapis.com/gmail/v1/users/me/messages/send"

# Simple per-visitor limit so a bot can't flood the inbox.
RATE_LIMIT_MAX = 5
RATE_LIMIT_WINDOW_SECONDS = 10 * 60


def env(name: str, default: str = "") -> str:
    return (os.environ.get(name) or default).strip()


def split_csv(value: str) -> list[str]:
    return [item.strip() for item in value.split(",") if item.strip()]


# --------------------------------------------------------------------------- #
# App + CORS
# --------------------------------------------------------------------------- #

app = FastAPI(title=f"{SITE_NAME} forms API", version="1.0.0", docs_url=None, redoc_url=None)

ALLOWED_ORIGINS = split_csv(
    env(
        "ALLOWED_ORIGINS",
        "https://aliyaabdullah.com,https://www.aliyaabdullah.com,http://localhost:8080",
    )
)
ALLOWED_ORIGIN_REGEX = env(
    "ALLOWED_ORIGIN_REGEX",
    r"https://([a-z0-9-]+\.)*(onrender\.com|lovable\.app)",
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
# Request model — shared by every form on the site
# --------------------------------------------------------------------------- #

FORM_TITLES = {
    "quote": "Quote request",
    "contact": "Contact message",
}


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
    # Honeypot — hidden from people, bots fill it in.
    website: Optional[str] = Field(default=None, max_length=500)

    @field_validator("name", "message", "phone", "company", "subject", mode="before")
    @classmethod
    def strip_text(cls, value):
        return value.strip() if isinstance(value, str) else value

    @field_validator("name", "subject", "phone", "company")
    @classmethod
    def single_line(cls, value):
        # Prevent header injection through line breaks.
        if value and ("\n" in value or "\r" in value):
            raise ValueError("must be a single line")
        return value

    @field_validator("details")
    @classmethod
    def limit_details(cls, value: dict[str, str]):
        if len(value) > 20:
            raise ValueError("too many details")
        for key, item in value.items():
            if len(key) > 60 or len(str(item)) > 500:
                raise ValueError("detail too long")
        return value


# --------------------------------------------------------------------------- #
# Rate limiting (in memory, per instance)
# --------------------------------------------------------------------------- #

_hits: dict[str, deque[float]] = defaultdict(deque)


def client_ip(request: Request) -> str:
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


def email_subject(sub: Submission) -> str:
    title = FORM_TITLES[sub.form_type]
    topic = f" — {sub.subject}" if sub.subject else ""
    return f"[{SITE_NAME}] {title}{topic} ({sub.name})"


def summary_rows(sub: Submission) -> list[tuple[str, str]]:
    rows: list[tuple[str, str]] = [("Name", sub.name), ("Email", str(sub.email))]
    if sub.phone:
        rows.append(("Phone", sub.phone))
    if sub.company:
        rows.append(("Company", sub.company))
    if sub.subject:
        rows.append(("Subject", sub.subject))
    rows.extend((key, str(value)) for key, value in sub.details.items() if str(value).strip())
    return rows


def build_message(sub: Submission, sender: str, recipients: list[str], support_email: str) -> EmailMessage:
    received = datetime.now(timezone.utc).strftime("%d %b %Y, %H:%M UTC")
    rows = summary_rows(sub)
    title = FORM_TITLES[sub.form_type]

    text_lines = [f"New {title.lower()} from {SITE_NAME}", ""]
    text_lines += [f"{label}: {value}" for label, value in rows]
    text_lines += ["", "Message:", sub.message, "", f"Received: {received}"]
    if sub.page:
        text_lines.append(f"Page: {sub.page}")
    text_lines += ["", f"Reply to this email to answer {sub.name} directly.", f"Support: {support_email}"]

    esc = html.escape
    row_html = "".join(
        f'<tr><td style="padding:8px 12px;color:#6b7280;font-size:13px;white-space:nowrap;vertical-align:top">{esc(label)}</td>'
        f'<td style="padding:8px 12px;color:#111827;font-size:14px">{esc(value)}</td></tr>'
        for label, value in rows
    )
    message_html = esc(sub.message).replace("\n", "<br>")
    page_html = f"<br>Page: {esc(sub.page)}" if sub.page else ""
    html_body = f"""\
<!doctype html>
<html><body style="margin:0;background:#ffffff;font-family:Arial,Helvetica,sans-serif">
  <div style="max-width:600px;margin:0 auto;padding:24px">
    <div style="background:#0b1512;border-radius:14px 14px 0 0;padding:20px 24px">
      <div style="color:#d7dde0;font-size:12px;letter-spacing:2px;text-transform:uppercase">{esc(SITE_NAME)}</div>
      <div style="color:#ffffff;font-size:22px;font-weight:bold;margin-top:6px">New {esc(title.lower())}</div>
    </div>
    <div style="border:1px solid #e5e7eb;border-top:4px solid #0f8a5f;border-radius:0 0 14px 14px;padding:20px 12px">
      <table style="width:100%;border-collapse:collapse">{row_html}</table>
      <div style="margin:18px 12px 0;padding:16px;background:#f3f6f5;border-radius:10px;color:#111827;font-size:14px;line-height:1.6">
        {message_html}
      </div>
      <p style="margin:18px 12px 0;color:#6b7280;font-size:12px;line-height:1.6">
        Received {esc(received)}{page_html}<br>
        Hit <strong>Reply</strong> to answer {esc(sub.name)} directly.
      </p>
    </div>
    <p style="color:#9ca3af;font-size:11px;text-align:center;margin-top:16px">{esc(SITE_NAME)} · {esc(support_email)}</p>
  </div>
</body></html>"""

    msg = EmailMessage()
    msg["From"] = formataddr((f"{SITE_NAME} Website", sender))
    msg["To"] = ", ".join(recipients)
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
        raise HTTPException(status_code=502, detail="Email service is temporarily unavailable. Please try again later.")

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
            # Token may have been revoked early — refresh once and retry.
            _token_cache["value"] = ""
            token = await get_access_token(client, settings)
            response = await client.post(
                GMAIL_SEND_URL,
                headers={"Authorization": f"Bearer {token}"},
                json={"raw": encode_raw(msg)},
            )
    if response.status_code >= 300:
        log.error("Gmail send failed [%s]: %s", response.status_code, response.text)
        raise HTTPException(status_code=502, detail="We couldn't send your message. Please try again later.")


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
    return {"status": "ok", "email_configured": configured}


@app.post("/api/submit")
async def submit(submission: Submission, request: Request):
    # Bots fill the hidden field: pretend success, send nothing.
    if submission.website:
        log.info("Honeypot triggered from %s", client_ip(request))
        return {"ok": True}

    if not check_rate_limit(client_ip(request)):
        raise HTTPException(status_code=429, detail="Too many messages. Please try again in a few minutes.")

    try:
        settings = gmail_settings()
    except GmailConfigError as exc:
        log.error(str(exc))
        raise HTTPException(status_code=503, detail="The form service isn't configured yet. Please email us directly.")

    recipients = split_csv(env("NOTIFY_TO_EMAIL", settings["sender"]))
    support_email = env("SUPPORT_EMAIL", "info@aliyaabdullah.com")
    msg = build_message(submission, settings["sender"], recipients, support_email)
    await send_via_gmail(msg, settings)
    log.info("Sent %s submission to %s", submission.form_type, ", ".join(recipients))
    return {"ok": True}
