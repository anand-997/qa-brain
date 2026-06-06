# Test Cases Buddy — B.L.A.S.T. Agent

A lightweight **React + Express (Vite)** app that turns a **Jira / Zoho Sprints ID** or a
**plain-text / `.txt` / `.md` requirement** into **comprehensive QA test cases** — auto-detecting
suites (Functional, Negative, Boundary, Security, Regression, Smoke, Performance, Accessibility,
API) and applying techniques (ECP, BVA, DTT, Behavioral, Error Handling, STT) per the
`qa-skills/generate-test-cases` methodology.

Output renders as a **coverage summary + sortable table** and downloads as **`.md` / `.csv` /
`.txt`**. Built on the **B.L.A.S.T.** protocol + **A.N.T.** 3-layer architecture, sibling to
`test-plan-generator-agent` and `test-strategy-agent`.

## Highlights
- **Multi-provider AI:** Groq `openai/gpt-oss-120b` (FREE, default), Claude (Anthropic), GitHub
  Copilot (best-effort). Editable model per provider.
- **Automatic token handling:** rate-limit/token-limit errors are retried and the requirement is
  auto-chunked — generation **never interrupts** until all cases are produced.
- **Dark / light** themed UI; credentials stay local (browser `localStorage` + server `.env`).

## Quick start
```bash
cp .env.sample .env       # add at least a GROQ key; tracker creds for ID mode
npm install
npm run handshake TICKET-ID-101  # Link check: tracker + AI provider reachable
npm run dev               # http://localhost:5173 (Vite) -> proxy :8787 (Express)
```
Production:
```bash
npm run build && npm start
```

## Deploy to Vercel

This is a **monorepo** (several agents in one repo), so the one critical setting is the
**Root Directory** — point it at `test-cases-generator-agent`. Vercel serves the Vite `dist/`
statically and runs `api/*.js` as serverless functions; the Express `server.js` is for local dev.

### Option A — Vercel Dashboard (no CLI)
1. **vercel.com → Add New → Project**, import this GitHub repo.
2. **Root Directory** → *Edit* → select **`test-cases-generator-agent`**. (Without this, Vercel
   builds the repo root and the deploy fails.)
3. Framework auto-detects **Vite** from `vercel.json` — leave build settings as-is.
4. **Environment Variables** — add at least `GROQ_KEY`. Optional:
   `ANTHROPIC_KEY`, `GITHUB_TOKEN`, `JIRA_URL`, `JIRA_EMAIL`, `JIRA_API_TOKEN`,
   `ZOHO_URL`, `ZOHO_TOKEN`, `TRACKER`, `AI_PROVIDER`, `AI_MODEL`.
   (Users may instead paste keys in the in-app **Settings** — sent per request, kept local.)
5. **Deploy.**

### Option B — Vercel CLI
```bash
npm i -g vercel
vercel login
vercel --cwd test-cases-generator-agent          # preview (links the project)
vercel env add GROQ_KEY production
vercel --cwd test-cases-generator-agent --prod   # production
```

### Serverless notes
- `api/config.js` + `api/generate.js` mirror the Express routes. `api/save.js` returns `501`
  (serverless FS is read-only) — use the client-side **Download .md/.csv/.txt** buttons instead.
- `vercel.json` sets `maxDuration: 60` for `/api/generate`. On the **Hobby** plan functions cap at
  **60s**; a very large requirement that auto-chunks into many batches may exceed that on one
  request — for huge TRDs prefer local `npm start` (no timeout) or a Pro plan.

## How it works (A.N.T.)
- **Layer 1 `architecture/`** — SOPs: `tracker-fetch.md`, `ai-generate.md`, `test-case-template.md`.
- **Layer 2 `server.js`** — routes request → tracker/context → `generateTestCases` → md/csv/txt.
- **Layer 3 `tools/`** — `jiraClient`, `zohoClient`, `contextSource`, `aiClient`, `testCases`,
  `handshake`.

## Modes
- **ID mode** — fetch a Jira issue (email + token) or Zoho Sprints item (token), then generate.
- **Requirement / Context mode** — paste text or attach `.txt`/`.md`; only an AI key is required.

## Notes
- The Zoho path targets the common Sprints item endpoint and parses defensively; verify with
  `npm run handshake <ID>` (set `TRACKER=zoho`) and patch `tools/zohoClient.js` if your account's
  shape differs.
- Tokens are never logged or committed. `.env`, `dist/`, `output/` are git-ignored.
