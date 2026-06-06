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
