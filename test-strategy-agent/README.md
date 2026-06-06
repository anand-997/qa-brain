# Test Strategy Buddy

A lightweight **React + Express** app that turns a **Jira ID** or a **plain-text / `.txt` / `.md`
requirement** into a formal **21-section QA Test Strategy** using **GROQ** (`openai/gpt-oss-120b`),
following the **B.L.A.S.T.** framework. Output renders on screen (formatted + raw Markdown) and is
downloadable as `.md`. UI supports **dark and light mode**.

## How it works
```
Browser (React)  →  /api  →  Express proxy (server.js)
                                ├─ tools/jiraClient.js     (Jira ID mode: fetch + flatten ADF)
                                ├─ tools/contextSource.js  (Requirement mode: no Jira creds)
                                └─ tools/testStrategy.js   (GROQ → JSON → deterministic Markdown)
```
GROQ produces **content only**; the Markdown layout is deterministic code. Jira calls go through
the proxy to avoid browser CORS and to keep your API token off the client.

## Prerequisites
- Node.js 18+ (for the built-in `fetch`)
- A GROQ API key (free) — https://console.groq.com
- For Jira mode: a Jira Cloud base URL, your email, and an API token
  (https://id.atlassian.com/manage-profile/security/api-tokens)

## Setup
```bash
cd test-strategy-agent
npm install
cp .env.sample .env        # then edit .env with your keys (Windows: copy .env.sample .env)
```
`.env` keys: `GROQ_KEY` (required), `JIRA_URL`, `JIRA_EMAIL`, `JIRA_API_TOKEN` (Jira mode only).
You can also enter all of these in the in-app **Settings** tab instead of `.env`
(stored in your browser's localStorage; blank fields fall back to `.env`).

## Run (development)
```bash
npm run dev
```
- Express proxy → http://localhost:8787
- Vite client → http://localhost:5173 (opens automatically)

## Run (production-style, single server)
```bash
npm run build      # emits dist/
npm start          # server.js serves dist/ on http://localhost:8787
```

## Verify the credentials (optional)
```bash
npm run handshake <JIRA-ID>     # e.g. npm run handshake TICKET-ID-101
```
Prints PASS/FAIL for the Jira and GROQ connections.

## Using the app
1. Open the app, go to **Settings**, and save your keys (or rely on `.env`).
2. On **Generate**, pick a mode:
   - **Jira ID** — enter a key like `TICKET-ID-101`.
   - **Requirement / Context** — paste a requirement, or attach a `.txt` / `.md` file.
3. Click **Generate** → review the 21-section strategy → **Download .md** (or **Save to server**,
   which writes to `output/` in dev).
4. Use the **🌙 / ☀️ toggle** (top-right) to switch dark/light mode.

## Project layout (B.L.A.S.T. / A.N.T. 3-layer)
```
test-strategy-agent/
├── CLAUDE.md                 # Project Constitution (law)
├── task_plan.md / findings.md / progress.md   # planning memory
├── architecture/             # Layer 1 — SOPs
├── tools/                    # Layer 3 — atomic engines
├── api/                      # Vercel serverless mirror of the proxy
├── server.js                 # Layer 2 — Express proxy (Navigation)
├── src/                      # React frontend (Vite)
├── .env.sample
└── package.json
```

## Notes
- The `api/` functions make the app **Vercel-ready** (set the same env vars in the Vercel
  dashboard). Server-side `/api/save` is disabled on serverless — use the Download button there.
- Never commit `.env`; it is gitignored.
