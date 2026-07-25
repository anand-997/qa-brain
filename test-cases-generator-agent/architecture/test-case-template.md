# SOP — Test-Case Template & Suite Rules (Layer 1)

Parent: `test-cases-generator-agent`. Source-of-truth copy of the methodology from
`qa-skills/generate-test-cases/references/`. Encoded into the prompt in `tools/testCases.js`.

## The 13-field test case (one object per case)
| Field | Notes |
|---|---|
| id | `TC_[MODULE]_[NNN]` — assigned deterministically by the renderer (model leaves it `""`) |
| createdBy | "AI Generated" |
| title | action-oriented, e.g. "Verify login fails with invalid password" |
| module | feature/module name |
| priority | `P0` (critical: login/checkout/payment) · `P1` important · `P2` standard · `P3` nice-to-have |
| testType | Functional / UI / API / Integration / Regression / Smoke / Negative / Boundary / Performance / Security / Accessibility |
| technique | ECP / BVA / DTT / Behavioral / Error Handling / STT / Functional |
| changeReference | `TRD-...:` or `Requirement: ...` |
| objective | 1–2 sentences: what it validates + why |
| testData | values separated by `; ` (no line breaks) |
| expectedResult | outcomes each prefixed with `✓ ` |
| testEnvironment | `Browser: ...; OS: ...; Environment: QA; Build: TBD` (or `N/A (API)`) |
| notes | references / related ids / platform notes (`""` if none) |

## Suite auto-detection
- **Functional** — always.
- **Regression** — modifying an existing feature.
- **Smoke** — critical paths (login, checkout, payment, core journeys); mark P0.
- **Security** — auth, payment, PII, file upload, RBAC, API endpoints.
- **Performance/Load** — large datasets, dashboards, file uploads, concurrent users.
- **Accessibility (WCAG 2.1)** — UI/UX changes, new screens, user-facing forms.
- **Cross-browser/Device** — web frontend, responsive design.
- **API Contract/Schema** — REST endpoints, schema changes, integrations.

## Technique selection
- **ECP** — inputs with validation rules (one valid + each invalid class).
- **BVA** — numeric ranges, string lengths, date/time/size limits (min-1, min, min+1, max-1, max, max+1).
- **DTT** — multiple conditions → different outcomes.
- **Behavioral** — multi-step workflows, navigation, state transitions.
- **Error Handling** — error messages, timeouts, failures, empty/loading states.
- **STT** — status-field lifecycles incl. invalid transitions that must be rejected.

## Output formats (deterministic renderers)
- **Markdown** — coverage summary + one block per case (template field order).
- **CSV** — header row + **one row per case**, 13 columns, semicolons within cells, `✓`-prefixed results.
- **TXT** — plain-text blocks.
