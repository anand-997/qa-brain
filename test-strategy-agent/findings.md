# findings.md — Research, discoveries, constraints

## Reference implementation
- Built by adapting the working `test-plan-generator-agent`
  (`AITesterBlueprint3xLearnings/Chapter_03_Create_AI_Agent_For_test_plan_Using_BLAST_framework/`).
- Same proven architecture: React (Vite) + Express proxy, GROQ JSON → deterministic Markdown.

## Jira (ADF)
- `description` comes back as Atlassian Document Format (a JSON tree), not plain text.
- `tools/jiraClient.js#flattenAdf` recursively walks it, adding newlines around block nodes.
- Auth is HTTP Basic with `base64(email:apiToken)`; endpoint `GET /rest/api/3/issue/{id}`.
- Browser cannot call Jira directly (CORS) → must go through the Express proxy / serverless fn.

## GROQ
- OpenAI-compatible Chat Completions API. Model `openai/gpt-oss-120b` (free).
- `response_format: { type: 'json_object' }` forces valid JSON; temperature 0.3 for determinism.
- Parse defensively — wrap `JSON.parse` and surface "GROQ did not return valid JSON".

## Template mapping (TEST_STRATEGY_TEMPLATE.md → schema)
- 21 sections. Several are tables (Document Control, Revision History, Test Environments, Tools,
  Roles, Risks, Approval); the rest are bullet lists or prose.
- Governance-heavy sections (test levels, defect severity/priority, metrics, entry/exit criteria,
  tools, roles, deliverables) have standard QA defaults so the strategy is complete even when the
  requirement only describes a feature — defaults live in `tools/testStrategy.js` `DEFAULT_*`.

## Theme (new vs. reference)
- Reference was dark-only. The task requires dark **and** light mode.
- Implemented via CSS custom properties scoped to `:root[data-theme='dark'|'light']`; `App.jsx`
  sets `data-theme` on `<html>` and persists the choice (defaults to OS preference, then dark).

## Constraints / gotchas
- Express must stay v4 (v5 breaks the `app.get('*')` catch-all; we use regex `/^(?!\/api).*/`).
- Serverless `/api/save` is disabled (read-only FS) — use the client-side Download button.
