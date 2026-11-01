"""aliyaabdullah.com form notification backend.

POST /api/submit accepts quote and contact forms and sends notification emails
through the Gmail API with OAuth 2.0 refresh-token authentication.

Render environment variables:
    GMAIL_CLIENT_ID       Google OAuth client ID
    GMAIL_CLIENT_SECRET   Google OAuth client secret
    GMAIL_REFRESH_TOKEN   Refresh token with the gmail.send scope
    GMAIL_SENDER_EMAIL    Email address of the authorized sending account
    NOTIFY_TO_EMAIL       One owner inbox address (defaults to sender)
    SUPPORT_EMAIL         Email shown in notification footer
    ALLOWED_ORIGINS       Comma-separated allowed website origins
    ALLOWED_ORIGIN_REGEX  Regex for any additional preview origins

Important: The Gmail From display name is the customer's name, but the actual
From address must be an authenticated Gmail account or verified send-as alias.
Gmail may show "me" if the sender and recipient are the same account.
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
    version="1.1.0",
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
