# SOP — Formal Test Plan Template (Layer 1)

Native QA template (NOT the external `test-plan-create-skill`). The generator must fill these **22 sections**, aligned with `RICE_POT_CREATE_TESTPLAN_PROMPT.md`.

| # | Section | Content |
|---|---------|---------|
| 1 | Test Plan ID | Document identifier, version, date, source issue (metadata table). |
| 2 | Testing Item | Name + brief description of the system/feature under test. |
| 3 | Objective | What this testing effort proves, tied to the issue. |
| 4 | Scope | In-scope testing types (numbered list). |
| 5 | Inclusions / Feature to be Tested | Specific features/flows/CRUD areas covered. |
| 6 | Feature NOT to be Tested | Out-of-scope items, each with a reason. |
| 7 | Test Environments | OS / browser / device / env (e.g. QA, Pre-Prod) targets. |
| 8 | Test Data Management | How test data is sourced, refreshed, reset; PII/sensitive handling. |
| 9 | Defect Reporting | Where + how defects are logged (Jira), **+ Defect Life Cycle sub-section** mapped to JIRA states. |
| 10 | Severity & Priority | Severity (S1–S4) and Priority (P1–P4) definition tables. |
| 11 | Test Strategy | Test types: functional, regression, API, UI, edge, negative. |
| 12 | Schedule | Phase / Owner / Dates table (`TBD` where unknown). |
| 13 | Resources Allocation | People, tools, and environments allocated. |
| 14 | Roles & Responsibility | Name / Role / Job Allocation / Availability table. |
| 15 | Deliverables | Artifacts produced (test cases, report, defect log). |
| 16 | Entry & Exit Criteria | Preconditions to start / conditions to sign off. |
| 17 | Suspension & Resumption | Conditions to halt testing and conditions to resume. |
| 18 | Pass/Fail Criteria | Explicit quantitative release-readiness thresholds. |
| 19 | Test Metrics & Reporting | KPI table (Metric / Definition / Target) + reporting cadence. |
| 20 | Tools | Test + automation + reporting tooling. |
| 21 | Risks & Mitigations | Risk / Mitigation table. |
| 22 | Signature & Approval | Name / Role / Signature / Date sign-off table. |

## Rules
- Derive project-specific content (names, dates, versions, endpoints) from the Jira issue. Unknown specifics → `TBD`, never invented.
- For standard governance sections the ticket is silent on (Severity/Priority scale, Defect Life Cycle, Test Metrics, Suspension/Resumption, Pass/Fail thresholds), use standard QA-industry defaults — these live as constants in `tools/testPlan.js`.
- Professional, concise, formal QA tone.
- Output is JSON (see `CLAUDE.md §3d`) → rendered deterministically to Markdown by `tools/testPlan.js`. The formatted UI (`src/components/TestPlanView.jsx`) must mirror the same 22 sections.
