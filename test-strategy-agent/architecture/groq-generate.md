# SOP — GROQ Generate (Layer 1)

> Parent tools: `tools/groqClient.js` + `tools/testStrategy.js`. The Golden Rule: if the logic
> changes, update this SOP **before** the code.

## Goal
Turn a normalized issue into a complete 21-section Test Strategy. GROQ produces **content JSON
only**; Markdown layout is deterministic code (BLAST boundary rule).

## Model & call
- Endpoint: `POST https://api.groq.com/openai/v1/chat/completions`
- Model: `openai/gpt-oss-120b` (FREE), `temperature: 0.3`
- `response_format: { type: 'json_object' }` to force valid JSON
- Auth: `Bearer GROQ_KEY`

## Prompt structure (`buildMessages`)
- **System:** "senior QA Lead writing a FORMAL, 21-section Test Strategy; base content on the
  requirement; use `TBD` for unknown project facts; use standard QA defaults for governance
  sections; output strictly valid JSON."
- **User:** issue metadata (key, summary, type/status/priority, components, labels, versions,
  reporter/assignee) + description/acceptance criteria + the `SCHEMA_HINT` (exact keys/types).

## Normalization (`generateStrategy`)
- Defensive: every key coerced to a safe default so the renderer never crashes.
- Governance sections fall back to `DEFAULT_*` constants (test levels, severity/priority, metrics,
  entry/exit/suspension/resumption, tools, roles, deliverables, approvals, environments, comms).
- Project-specific blanks stay `TBD`; never fabricate.

## Rendering (`renderMarkdown`)
- Pure string concatenation — no LLM. Emits 21 numbered `##` sections with the template's tables
  (Document Control, Revision History, Test Environments, Tools, Roles, Defect Severity/Priority,
  Risks, Approval) and bullet lists for the rest.

## Edge cases / learnings
- If GROQ returns non-JSON, surface "GROQ did not return valid JSON" (caught in `groqClient`).
- Keep the deterministic boundary intact: never let the LLM control Markdown formatting/tables.
