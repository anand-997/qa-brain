# task_plan.md — Test Strategy Buddy (B.L.A.S.T.)

> Phases, goals, and checklists. Memory file — update as work progresses.

## Protocol 0 — Initialization
- [x] Create memory files: `task_plan.md`, `findings.md`, `progress.md`
- [x] Establish `CLAUDE.md` as the Project Constitution (schemas, rules, invariants)
- [x] Define the JSON Data Schema before coding (see `CLAUDE.md` §3 + `SCHEMA_HINT`)

## Phase 1 — B (Blueprint)
- [x] **North Star:** turn a Jira ID / requirement into a formal 21-section Test Strategy
- [x] **Integrations:** Jira Cloud (issue fetch) + GROQ (`openai/gpt-oss-120b`)
- [x] **Source of Truth:** single Jira issue (live) OR pasted requirement / `.txt` / `.md`
- [x] **Delivery Payload:** on-screen render + downloadable `.md` (+ optional `output/` save)
- [x] **Behavioral Rules:** formal tone, `TBD` for gaps, deterministic Markdown, secrets stay local
- [x] Data schema confirmed in `CLAUDE.md` §3d

## Phase 2 — L (Link)
- [x] `tools/groqClient.js` + `tools/jiraClient.js` built (atomic)
- [x] `tools/handshake.js` verifies `.env` creds reach Jira + GROQ
- [ ] **Run `npm run handshake <JIRA-ID>` once `.env` is filled** (user to verify live)

## Phase 3 — A (Architect, A.N.T. 3-layer)
- [x] Layer 1 SOPs in `architecture/` (jira-fetch, groq-generate, test-strategy-template)
- [x] Layer 2 Navigation: `server.js` (Express proxy) + `api/` (Vercel mirror)
- [x] Layer 3 Tools: `jiraClient`, `groqClient`, `contextSource`, `testStrategy`, `handshake`

## Phase 4 — S (Stylize)
- [x] React UI: Settings + Generator + 21-section TestStrategyView
- [x] Dark/light theme toggle (`data-theme`, persisted)
- [x] Deterministic Markdown payload (tables + bullets matching the template)
- [ ] User feedback on the rendered strategy

## Phase 5 — T (Trigger) — out of scope this turn (user: "App only")
- [ ] GitHub push (user-run)
- [ ] Vercel deploy (user-run; `api/` functions already Vercel-ready)
