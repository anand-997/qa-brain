# task_plan.md — B.L.A.S.T. Phases (memory)

## B — Blueprint ✅
- North Star: auto-generate comprehensive QA test cases from a tracker ID / requirement.
- Data schema confirmed in `CLAUDE.md` §3 (config / request / normalized issue / test-case payload).
- Source of truth: single Jira/Zoho item or pasted requirement.
- Delivery: on-screen coverage + table; downloadable `.md` / `.csv` / `.txt`.
- Behavioral rules: zero-hallucination, deterministic boundary, **uninterrupted token-safe generation**.

## L — Link ☐ (needs live creds)
- [ ] `cp .env.sample .env`, add a GROQ key (+ Jira or Zoho creds for ID mode).
- [ ] `npm run handshake <ID>` → expect tracker PASS + AI PASS.

## A — Architect ✅
- [x] Layer 1 SOPs: `architecture/{tracker-fetch,ai-generate,test-case-template}.md`.
- [x] Layer 2: `server.js` proxy routing.
- [x] Layer 3 tools: `jiraClient`, `zohoClient`, `contextSource`, `aiClient`, `testCases`, `handshake`.

## S — Stylize ✅
- [x] React UI via frontend-design plugin (blueprint aesthetic, dark/light).
- [x] Settings (tracker + provider + defaults), Generator (ID/context + downloads), TestCasesView
      (coverage chips + sortable table + expandable rows + markdown toggle).

## T — Trigger ☐
- [ ] `npm run dev` (local) → verify context + ID flows.
- [ ] `npm run build` + `npm start` (prod) → static serve from `dist/`.
- [ ] Optional Vercel `api/` mirror.

## Checklist
- [x] B.L.A.S.T. memory files initialized.
- [x] Auto token-handling implemented (retries + adaptive chunking).
- [ ] End-to-end verified with a real key.
