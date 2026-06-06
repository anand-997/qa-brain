# CLAUDE.md — Project Constitution

> Single source of architectural truth. `CLAUDE.md` is **law**; the planning files
> (`task_plan.md`, `findings.md`, `progress.md`) are memory.

## 1. Mission
**Test Cases Buddy** — a lightweight **React app + Express proxy** that takes tracker config
(Jira **or** Zoho Sprints) + an AI provider key in **Settings**, accepts a **tracker ID** or a
**plain-text / `.txt` / `.md`** requirement, fetches the requirement, and auto-generates
**comprehensive QA test cases** (suite auto-detection + ECP/BVA/DTT/etc., 13-field template) using
the methodology of `qa-skills/generate-test-cases`. Output renders as a coverage summary +
sortable table and downloads as **`.md` / `.csv` / `.txt`**. UI supports **dark and light mode**.
**Token utilization is handled automatically** — generation never interrupts until all cases exist.

## 2. Integrations
| Service | Use | Endpoint | Auth |
|---|---|---|---|
| Jira Cloud | Fetch issue | `GET {JIRA_URL}/rest/api/3/issue/{id}` | Basic `base64(email:token)` |
| Zoho Sprints | Fetch item | `GET {ZOHO_URL}/item/{id}/` | `Zoho-oauthtoken {token}` |
| Groq (default) | Generate | `POST api.groq.com/openai/v1/chat/completions` | `Bearer GROQ_KEY` |
| Anthropic | Generate | `POST api.anthropic.com/v1/messages` | `x-api-key` + `anthropic-version` |
| GitHub Copilot | Generate | `POST models.github.ai/inference/chat/completions` | `Bearer GITHUB_TOKEN` |

- **Default model:** `openai/gpt-oss-120b` (FREE, Groq). Model is editable per provider.
- **Why a proxy:** Jira/Zoho REST block browser CORS; the proxy also keeps tokens server-side.

## 3. Data Schema (Input / Output) — ✅ CONFIRMED

### 3a. Config (from `.env` defaults, overridable in Settings UI)
```json
{ "tracker": "jira|zoho",
  "jiraUrl": "", "jiraEmail": "", "jiraToken": "",
  "zohoUrl": "", "zohoToken": "",
  "provider": "groq|anthropic|copilot", "model": "openai/gpt-oss-120b",
  "groqKey": "", "anthropicKey": "", "githubToken": "",
  "idPrefix": "", "priorityFocus": "all|p0p1|p0" }
```
`.env` keys: `TRACKER`, `JIRA_URL`, `JIRA_EMAIL`, `JIRA_API_TOKEN`(/`JIRA_TOKEN`), `ZOHO_URL`,
`ZOHO_TOKEN`, `AI_PROVIDER`, `AI_MODEL`, `GROQ_KEY`, `ANTHROPIC_KEY`, `GITHUB_TOKEN`.

### 3b. Generate request (frontend → proxy)
```json
{ "id": "TICKET-ID-101", "context": "", "idPrefix": "", "priorityFocus": "all",
  "config": { "... see 3a (optional; falls back to .env)" } }
```
`id` (tracker mode) **or** `context` (pasted/uploaded requirement) — never both required.

### 3c. Normalized issue (proxy internal — same shape for Jira / Zoho / Context)
```json
{ "key": "string", "summary": "string", "description": "string",
  "issueType": "string", "status": "string", "priority": "string",
  "components": ["string"], "labels": ["string"], "fixVersions": ["string"],
  "reporter": "string", "assignee": "string | null" }
```

### 3d. Test-case payload (AI JSON → deterministic render)
```json
{ "idPrefix": "string", "suites": ["string"],
  "coverage": { "total": 0, "byType": {}, "byTechnique": {}, "byPriority": {} },
  "testCases": [ { "id","createdBy","title","module","priority","testType","technique",
                   "changeReference","objective","testData","expectedResult","testEnvironment","notes" } ],
  "warnings": ["string"] }
```
Full field/suite/technique detail lives in `architecture/test-case-template.md` and the
`METHODOLOGY`/`SCHEMA_HINT` constants in `tools/testCases.js`. Output rendered in UI + downloadable
to `output/test-cases-<id>.{md,csv}`.

## 4. Behavioral Rules
- **Tone:** professional QA.
- **Native methodology:** test-case rules are encoded in `tools/testCases.js` — no runtime skill
  dependency, but `architecture/test-case-template.md` mirrors the skill as the SOP source.
- **Do Not fabricate:** where the requirement is silent, emit `TBD`; never invent tracker data.
- **Deterministic boundary:** the AI produces *content* (JSON); coverage tally + Markdown/CSV/TXT
  rendering + file I/O are deterministic code in `tools/` / `server.js`.
- **Token-safe & uninterrupted:** rate-limit/token-limit errors are retried + auto-chunked until
  all cases are generated (see `architecture/ai-generate.md`). Never abort the run on token pressure.
- **Secrets:** tokens live in `.env` / Settings only; never logged, never committed.

## 5. Architectural Invariants (A.N.T. 3-layer)
- **Layer 1 — Architecture (`architecture/`):** SOPs `tracker-fetch.md`, `ai-generate.md`,
  `test-case-template.md`.
- **Layer 2 — Navigation:** `server.js` routes request → jira/zoho/contextSource →
  generateTestCases(aiClient) → md/csv/txt → response.
- **Layer 3 — Tools (`tools/`):** atomic engines — `jiraClient.js`, `zohoClient.js`,
  `contextSource.js`, `aiClient.js`, `testCases.js`, `handshake.js`.
- **Source of truth:** single tracker item (live fetch) or pasted requirement. No linked issues.
- **Delivery:** on-screen render + local `.md`/`.csv`/`.txt` download; optional `output/` save in dev.
- `.tmp/` for intermediates; `output/` for deliverables.

## 6. Maintenance Log
- 2026-06-06: Initial build. Adapted the proven `test-strategy-agent` (React + Express + Vite,
  B.L.A.S.T./A.N.T.) into a **Test Cases** generator. Reused `jiraClient.js`, `contextSource.js`
  patterns; new `aiClient.js` (multi-provider + retries + `TokenLimitError`), `zohoClient.js`,
  `testCases.js` (methodology + adaptive chunking + md/csv/txt renderers). New UI built with the
  frontend-design plugin (engineering-blueprint aesthetic, dark/light toggle).
- **Express pinned to v4**; catch-all route uses regex `/^(?!\/api).*/` (express 5 breaks `app.get('*')`).
- **Zoho path unverified** until live creds → run `npm run handshake <ID>` with `TRACKER=zoho`;
  patch `zohoClient.normalizeItem` + record in `architecture/tracker-fetch.md` if the shape differs.
- Self-anneal protocol: on a tool failure, read the error, patch the `tools/` file, re-test, then
  record the learning in the matching `architecture/*.md`.
