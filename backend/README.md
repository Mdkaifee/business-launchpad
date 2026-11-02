# aliyaabdullah.com — forms backend (FastAPI)

One endpoint, `POST /api/submit`, receives every form (contact, inquiry, quote) and
emails it to **aliaabdullah1211@gmail.com** through the Gmail API.

Each email is built as:

| Header     | Value                                                            |
| ---------- | ---------------------------------------------------------------- |
| From       | `"<visitor's typed name>" <GMAIL_SENDER_EMAIL>`                  |
| To         | `aliaabdullah1211@gmail.com` (fixed in code)                     |
| Reply-To   | `"<visitor's name>" <visitor's email>`                           |
| Subject    | `Contact message — <topic>` / `Quote request — <service>`        |

The visitor's email address is never used as From (that would be spoofing, and
Gmail rewrites any From address the sender account doesn't own).

## Why Gmail shows "me"

Gmail shows **me** for any message whose From address is the mailbox's own
address. If `GMAIL_SENDER_EMAIL` (and the account that issued the refresh token)
is `aliaabdullah1211@gmail.com`, every notification is "sent by you to you" —
no header can change that. Fix: send from a **separate** Gmail account.

## One-time setup of a dedicated sender account

1. Create a new Gmail account, e.g. `aliyaabdullah.forms@gmail.com`.
   Don't save it as a contact in aliaabdullah1211's Gmail (a saved contact name
   overrides the display name).
2. Google Cloud → OAuth consent screen: add the new account as a test user, or
   better, **Publish app → In production** (Testing-mode refresh tokens expire
   after 7 days → `invalid_grant`).
3. Credentials → your OAuth client (Web) → add redirect URI
   `https://developers.google.com/oauthplayground`.
4. Open https://developers.google.com/oauthplayground → ⚙ → "Use your own OAuth
   credentials" → paste client ID + secret. Scopes:
   `https://www.googleapis.com/auth/gmail.send openid email`.
   Sign in **as the new sender account**, exchange the code, copy the refresh token.
5. Render → backend → Environment:
   - `GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET` — the same client used in step 4
   - `GMAIL_REFRESH_TOKEN` — the new token
   - `GMAIL_SENDER_EMAIL` — the new account's address
   - `SUPPORT_EMAIL=info@aliyaabdullah.com`
   - delete `NOTIFY_TO_EMAIL`, `SMTP_HOST`, `SMTP_USER`, `SMTP_PASSWORD`
6. Save → redeploy, then check:
   - `GET /health` → `"sender_differs_from_inbox": true`
   - `GET /health/sender` → `token_matches_sender: true`, `token_is_inbox_account: false`

## Deploy on Render (Web Service)

| Setting        | Value                                              |
| -------------- | -------------------------------------------------- |
| Root directory | `backend`                                          |
| Runtime        | Python 3                                           |
| Build command  | `pip install -r requirements.txt`                  |
| Start command  | `uvicorn main:app --host 0.0.0.0 --port $PORT`     |
| Health check   | `/health`                                          |

Frontend: `VITE_API_URL=https://backendaliyaaabd.onrender.com`, then redeploy.

## Test the live API

```bash
API=https://backendaliyaaabd.onrender.com
for T in contact inquiry quote; do
  curl -s -X POST $API/api/submit -H "Content-Type: application/json" \
    -d "{\"form_type\":\"$T\",\"name\":\"Md Kaifee\",\"email\":\"mdkaifeeeminence@gmail.com\",\"subject\":\"Website Development\",\"message\":\"I need a business website.\",\"details\":{\"Service\":\"Website Development\"}}"
  echo
done
```

Each should return `{"ok":true}` (max 5 per IP per 10 minutes). In Gmail, open the
message → ⋮ → **Show original**: `From:` shows the visitor's name with the sender
address, `Reply-To:` the visitor, and `SPF/DKIM: PASS`.

## Run locally

```bash
cd backend
pip install -r requirements-dev.txt
uvicorn main:app --reload --port 8000
pytest
```
