# aliyaabdullah.com — forms backend (FastAPI)

One endpoint, `POST /api/submit`, receives every form on the website and emails it
to the Gmail account through the Gmail API.

## Deploy on Render (Web Service)

| Setting        | Value                                              |
| -------------- | -------------------------------------------------- |
| Root directory | `backend`                                          |
| Runtime        | Python 3                                           |
| Build command  | `pip install -r requirements.txt`                  |
| Start command  | `uvicorn main:app --host 0.0.0.0 --port $PORT`     |
| Health check   | `/health`                                          |

Environment variables (paste real values in Render, see `.env.example`):

- `GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET`, `GMAIL_REFRESH_TOKEN`, `GMAIL_SENDER_EMAIL` — required
- `NOTIFY_TO_EMAIL` — optional, defaults to `GMAIL_SENDER_EMAIL`
- `SUPPORT_EMAIL` — optional, defaults to `info@aliyaabdullah.com`
- `ALLOWED_ORIGINS` — optional, defaults to `https://aliyaabdullah.com,https://www.aliyaabdullah.com`

The refresh token must include the `https://www.googleapis.com/auth/gmail.send` scope.
If the Google Cloud OAuth consent screen is in **Testing** mode, Google expires refresh
tokens after 7 days — switch it to **In production** to keep the forms working.

## Connect the website

On the **frontend** Render static site, add the env var
`VITE_API_URL=https://<your-backend>.onrender.com` and redeploy.

## Run locally

```bash
cd backend
pip install -r requirements-dev.txt
uvicorn main:app --reload --port 8000
pytest
```
