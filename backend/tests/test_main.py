import base64
import email

import pytest
from fastapi.testclient import TestClient

import main

VALID = {
    "form_type": "quote",
    "name": "Sara Khan",
    "email": "sara@example.com",
    "phone": "+971 50 000 0000",
    "company": "Khan Trading",
    "subject": "Quote request — Trading Services",
    "message": "Need 20 containers.\nDelivery to Jebel Ali.",
    "details": {"Budget": "$100,000 – $500,000"},
    "website": "",
}


@pytest.fixture(autouse=True)
def setup(monkeypatch):
    main._hits.clear()
    for key, value in {
        "GMAIL_CLIENT_ID": "id",
        "GMAIL_CLIENT_SECRET": "secret",
        "GMAIL_REFRESH_TOKEN": "refresh",
        "GMAIL_SENDER_EMAIL": "aliaabdullah1211@gmail.com",
    }.items():
        monkeypatch.setenv(key, value)
    monkeypatch.delenv("NOTIFY_TO_EMAIL", raising=False)
    sent = []

    async def fake_send(msg, settings):
        sent.append(msg)

    monkeypatch.setattr(main, "send_via_gmail", fake_send)
    return sent


def test_submission_emails_the_gmail_account(setup):
    res = TestClient(main.app).post("/api/submit", json=VALID)
    assert res.status_code == 200
    msg = setup[0]
    assert msg["To"] == "aliaabdullah1211@gmail.com"
    assert "sara@example.com" in msg["Reply-To"]


def test_footer_shows_support_email(setup):
    TestClient(main.app).post("/api/submit", json=VALID)
    text = setup[0].get_body(("plain",)).get_content()
    assert "info@aliyaabdullah.com" in text


def test_raw_encoding_round_trips(setup):
    TestClient(main.app).post("/api/submit", json=VALID)
    raw = main.encode_raw(setup[0])
    decoded = email.message_from_bytes(base64.urlsafe_b64decode(raw + "=" * (-len(raw) % 4)))
    assert decoded["To"] == "aliaabdullah1211@gmail.com"


def test_honeypot_sends_nothing(setup):
    res = TestClient(main.app).post("/api/submit", json={**VALID, "website": "spam.biz"})
    assert res.status_code == 200
    assert setup == []


def test_invalid_email_rejected(setup):
    res = TestClient(main.app).post("/api/submit", json={**VALID, "email": "nope"})
    assert res.status_code == 422


def test_header_injection_rejected(setup):
    res = TestClient(main.app).post("/api/submit", json={**VALID, "name": "Bob\nBcc: x@y.com"})
    assert res.status_code == 422


def test_sixth_message_in_ten_minutes_is_blocked(setup):
    client = TestClient(main.app)
    codes = [client.post("/api/submit", json=VALID).status_code for _ in range(6)]
    assert codes == [200] * 5 + [429]


def test_missing_config_returns_503(setup, monkeypatch):
    monkeypatch.delenv("GMAIL_REFRESH_TOKEN")
    res = TestClient(main.app).post("/api/submit", json=VALID)
    assert res.status_code == 503
