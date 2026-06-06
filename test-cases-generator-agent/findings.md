# findings.md — Research & Discoveries (memory)

## Methodology source
- `qa-skills/generate-test-cases/` defines the approach replicated here: 3-phase
  Interview → Analysis → Generation, suite auto-detection, technique selection (ECP/BVA/DTT/
  Behavioral/Error Handling/STT/Pairwise/Use Case), and the **13-field test-case template** with
  **both Markdown and CSV (one row per case)** output. Encoded into `tools/testCases.js` +
  `architecture/test-case-template.md`.

## Reused patterns (from sibling agents)
- `test-strategy-agent` / `test-plan-generator-agent` are working React+Express+Vite B.L.A.S.T.
  apps. Reused: Vite proxy (5173→8787), `server.js` envConfig/mergeConfig + `/api/config`
  presence flags, `jiraClient` ADF flattening, `contextSource` issue shape, `handshake` Link check,
  localStorage config + dark/light `data-theme`, deterministic content/render boundary.

## New for this agent
- **Multi-provider AI router** (`aiClient.js`): groq (OpenAI-compatible, json_object), anthropic
  (separate `system`, parse text block), copilot (GitHub Models, best-effort).
- **Automatic token handling:** `TokenLimitError` + transport retries (429/5xx, honor
  `retry-after`) + adaptive section chunking in `testCases.js` (split → halve-on-limit → merge).
- **Zoho Sprints client:** defensive `normalizeItem` (key drift, HTML strip) → same issue shape.

## Constraints / open items
- Zoho Sprints REST shapes vary by account/version → endpoint + field mapping flagged for
  handshake verification; patch `zohoClient` + record here when confirmed.
- GitHub Copilot has no simple public chat-completions API; GitHub Models endpoint used as
  best-effort and may need a token with `models` scope.
