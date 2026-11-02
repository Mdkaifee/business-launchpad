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


# --- Sender identity: each visitor's name shows as the sender, Reply-To is them ---

from email.utils import parseaddr


def _post(payload):
    return TestClient(main.app).post("/api/submit", json=payload)


@pytest.mark.parametrize("form_type", ["contact", "inquiry", "quote"])
def test_every_form_uses_visitor_name_and_reply_to(setup, form_type):
    res = _post({
        "form_type": form_type,
        "name": "Md Kaifee",
        "email": "mdkaifeeeminence@gmail.com",
        "subject": "Website Development",
        "message": "I need a business website.",
    })
    assert res.status_code == 200
    msg = setup[0]
    assert parseaddr(msg["From"]) == ("Md Kaifee", "aliaabdullah1211@gmail.com")
    assert parseaddr(msg["Reply-To"]) == ("Md Kaifee", "mdkaifeeeminence@gmail.com")
    assert msg["To"] == "aliaabdullah1211@gmail.com"


def test_name_changes_per_visitor(setup):
    _post({"form_type": "contact", "name": "Md Kaifee", "email": "mdkaifeeeminence@gmail.com", "message": "Hi"})
    _post({"form_type": "contact", "name": "Ahmed Khan", "email": "ahmed@gmail.com", "message": "Hi"})
    assert parseaddr(setup[1]["From"])[0] == "Ahmed Khan"
    assert parseaddr(setup[1]["Reply-To"])[1] == "ahmed@gmail.com"


def test_visitor_address_is_never_the_from_address(setup, monkeypatch):
    monkeypatch.setenv("GMAIL_SENDER_EMAIL", "aliyaabdullah.forms@gmail.com")
    _post({"form_type": "contact", "name": "Ahmed Khan", "email": "ahmed@gmail.com", "message": "Hi"})
    assert parseaddr(setup[0]["From"])[1] == "aliyaabdullah.forms@gmail.com"


def test_contact_subject(setup):
    _post({"form_type": "contact", "name": "Md Kaifee", "email": "a@b.com", "subject": "Website Development", "message": "Hi"})
    _post({"form_type": "contact", "name": "Md Kaifee", "email": "a@b.com", "message": "Hi"})
    assert setup[0]["Subject"] == "Contact message — Website Development"
    assert setup[1]["Subject"] == "Contact message"


def test_quote_subject_uses_service(setup):
    _post({**VALID, "details": {"Service": "Trading Services", "Budget": "$1"}})
    assert setup[0]["Subject"] == "Quote request — Trading Services"


def test_stale_notify_to_email_is_ignored(setup, monkeypatch):
    monkeypatch.setenv("NOTIFY_TO_EMAIL", "someone-else@example.com")
    _post(VALID)
    assert setup[0]["To"] == "aliaabdullah1211@gmail.com"


def test_partial_smtp_settings_still_use_gmail_api(setup, monkeypatch):
    monkeypatch.setenv("SMTP_HOST", "smtp.hostinger.com")
    monkeypatch.delenv("SMTP_USER", raising=False)
    assert _post(VALID).status_code == 200
    assert len(setup) == 1


def test_health_flags_self_send(setup, monkeypatch):
    body = TestClient(main.app).get("/health").json()
    assert body["sender_differs_from_inbox"] is False
    monkeypatch.setenv("GMAIL_SENDER_EMAIL", "aliyaabdullah.forms@gmail.com")
    assert TestClient(main.app).get("/health").json()["sender_differs_from_inbox"] is True
