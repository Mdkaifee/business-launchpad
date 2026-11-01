<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->
- The build prerenders "/" and collects static files into dist/ (scripts/static-dist.mjs) so static hosts like Render can serve the site without a server.
- Every site form posts to one FastAPI endpoint (`backend/main.py`, `POST /api/submit`, hosted separately on Render) via `src/lib/submit-form.ts`; the frontend finds it through `VITE_API_URL` at build time because the static site has no server of its own.
- The backend sends mail through the Gmail API with an OAuth refresh token read from env vars; secrets never live in the repo (`backend/.env.example` lists names only). Backend tests: `pytest` in `backend/`.
