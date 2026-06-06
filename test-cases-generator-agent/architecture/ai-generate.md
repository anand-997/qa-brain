# SOP — AI Generation & Token Handling (Layer 1)

Parent: `test-cases-generator-agent`. Governs `tools/aiClient.js` + `tools/testCases.js`.
**Golden rule:** update this SOP before changing the code.

## Goal
Turn a normalized issue into **complete QA test-case coverage** as structured JSON, then render
it deterministically — never interrupting the run, even when the model hits token limits.

## Provider routing (`aiClient.js`)
| Provider | Endpoint | Auth | Default model |
|---|---|---|---|
| groq (default) | `api.groq.com/openai/v1/chat/completions` | `Bearer GROQ_KEY` | `openai/gpt-oss-120b` (FREE) |
| anthropic | `api.anthropic.com/v1/messages` | `x-api-key` + `anthropic-version` | `claude-opus-4-8` |
| copilot | `models.github.ai/inference/chat/completions` | `Bearer GITHUB_TOKEN` | `openai/gpt-4o` |

- Groq/Copilot are OpenAI-compatible (`response_format: json_object`). Anthropic separates
  `system` from `messages` and has no JSON flag → we instruct JSON in the prompt and parse the
  text block. Model is user-editable per provider.

## Automatic token utilization handling (mandatory)
This is a hard product requirement: generation must **never interrupt** and must continue until
**all** test cases are produced.

1. **Transport retries (`aiChat`):** on `429` or `5xx`, retry with exponential backoff (honoring
   `retry-after`), up to `maxRetries`.
2. **Token-pressure detection:** `413`, context-length / "request too large" / `max_tokens` /
   TPM messages, `finish_reason: length` / `stop_reason: max_tokens`, or unparseable (truncated)
   JSON → thrown as a typed `TokenLimitError`.
3. **Adaptive chunking (`generateTestCases`):** the requirement is split into section batches
   (`splitSections`: headings → paragraphs → hard windows, ≤ `MAX_SECTION_CHARS`). On a
   `TokenLimitError` the offending batch is `halve`d and re-queued at the front; this repeats
   (bounded depth) until each batch succeeds. Results are merged, deduped by title, and given
   deterministic `TC_[MODULE]_[NNN]` ids.

## Methodology encoded in the prompt
`METHODOLOGY` + `SCHEMA_HINT` in `testCases.js` mirror `qa-skills/generate-test-cases`:
suite auto-detection (Functional always; Regression/Smoke/Security/Performance/Accessibility/
Cross-browser/API per signals) and technique selection (ECP/BVA/DTT/Behavioral/Error Handling/
STT/Functional). Zero hallucination; `TBD` for unknowns. A copy of the 13-field template lives in
`architecture/test-case-template.md` as the SOP source of truth.

## Deterministic boundary
The model returns **content** (JSON test cases). Coverage tally + Markdown/CSV/TXT rendering are
deterministic code (`computeCoverage`, `renderMarkdown`, `renderCsv`, `renderTxt`).

## Edge cases / learnings
- If a single atomic chunk still fails after max depth, it is recorded in `warnings[]` and skipped
  (surfaced in the UI) rather than aborting the whole run.
- Record any new token-limit error strings or provider quirks in `looksLikeTokenLimit` here.
