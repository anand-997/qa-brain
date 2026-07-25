---
name: generate-test-plan
description: >
  Generate a complete, enterprise-grade Test Plan document (Test Plan ID through Signature &
  Approval) for an API or application. Use this skill whenever the user says "generate test
  plan", "create a test plan", "write a test plan doc", "test plan for this API/application",
  or describes a system and wants a formal QA test-planning artifact — not a test strategy
  (higher-level approach doc) or individual test cases. Produces all 18 required sections in
  the fixed order (Test Plan ID, Testing Item, Objective, Scope, Inclusions/Exclusions, Test
  Environments, Defect Reporting Procedure with Defect Life Cycle, Test Strategy, Test
  Schedule, Resources Allocation, Roles & Responsibility, Deliverables, Entry/Exit Criteria,
  Pass/Fail Criteria, Tools, Risks & Mitigations, Signature & Approval), with `[INSERT ...]`
  placeholders for anything not provided. Invoke proactively when a user describes a system
  under test and wants a signed-off-ready planning document.
---

# Generate Test Plan (RICE-POT)

Converts a description of an API or application under test into a complete, client-ready
Test Plan document, following the **RICE-POT** prompt framework (see
[../RICE_POT_FRAMEWORK.md](../RICE_POT_FRAMEWORK.md)). The full, self-contained,
copy-pasteable prompt lives in
[references/rice-pot-test-plan-prompt.md](references/rice-pot-test-plan-prompt.md).

## How This Skill Works

Two phases: **Clarify → Generate.** Never generate the plan before Phase 1 is resolved.

### Phase 1: Clarify

Ask in one message:

```
Before I generate the test plan, a few details:

1. **System under test** — Name and brief description of the API/application
   (what it does, core operations, e.g., "Booking Management API — create, read,
   update, delete bookings + auth token generation").

2. **API documentation URL** *(optional)* — If available.

3. **Test execution tools** *(optional)* — e.g., Postman for manual/exploratory,
   REST Assured (Java) for automation. Defaults to Postman + REST Assured if not stated.

4. **Environments** *(optional)* — Environment names and URLs (e.g., QA, Pre-Prod).
   Uses `[INSERT VALUE]` placeholders if not provided.

5. **Team / dates** *(optional)* — Team member names/roles and project start/end dates.
   Uses `[INSERT VALUE]` placeholders if not provided — never invent real names or dates.

6. **Defect POC contacts** *(optional)* — Frontend/Backend/DevOps contact names.
```

Wait for the response before generating.

### Phase 2: Generate

Read `references/rice-pot-test-plan-prompt.md` in full and execute it exactly as written,
treating the answers from Phase 1 as the **C — Context** inputs. In particular:

1. Generate **all 18 sections**, in this exact order — never add, remove, or reorder:
   Test Plan ID → Testing Item → Objective → Scope → Inclusions / Feature to be Tested →
   Feature NOT to be Tested → Test Environments → Defect Reporting Procedure (with Defect
   Life Cycle sub-section) → Test Strategy → Test Schedule → Resources Allocation → Roles &
   Responsibility → Test Deliverables → Entry and Exit Criteria → Pass/Fail Criteria →
   Tools → Risks and Mitigations → Signature & Approval.
2. Scope must cover at least 20 testing types; Inclusions at least 19 CRUD-related testing
   areas; Feature NOT to be Tested at least 3 items with reasons; Roles & Responsibility at
   least 4 rows (Test Lead, Test Engineer(s), Developer POC, Project Manager).
3. Test Plan ID follows `TP-[PROJECT]-001` with version and creation date.
4. Entry and Exit Criteria cover three phases: Requirement Analysis, Test Execution, Test
   Closure — each with explicit Entry and Exit conditions.
5. Pass/Fail Criteria must state explicit, quantitative thresholds (e.g., "≥95% planned
   test cases executed and passed; zero P1 defects open at closure").
6. Defect Life Cycle (sub-section of Defect Reporting Procedure) is a numbered flow: New →
   Assigned → Open → Fixed → Retest → Closed (or Reopened if retest fails), each state
   briefly described.
7. Use `[INSERT VALUE]` placeholders for anything not provided — never invent real names,
   dates, endpoints, error codes, or behavior not derivable from the provided context.

## Hard Rules

- **Never invent** API endpoints, error codes, or behavior not derivable from the provided
  context.
- **Never skip** any of the 18 required sections, and **never add** sections not listed.
- Every statement must be traceable to the provided context or standard QA industry practice
  (e.g., HTTP status code conventions).
- Write prose paragraphs for explanatory sections (Objective, Defect Reporting Procedure,
  Test Strategy, Pass/Fail Criteria rationale) — not bullet-only.
- Output raw Markdown only — no table of contents, no wrapping code block.

## Follow-up Options

After delivering the plan, always offer:

```
What would you like next?
1. Generate a higher-level Test Strategy for this system → use /generate-test-strategy
2. Generate test cases from the Scope/Inclusions → use /generate-test-cases
3. Expand a specific section in more depth (e.g., Risks, Test Schedule)
4. Regenerate with real team names / dates / environment URLs filled in
```

## Reference Files

| File | Purpose | When to Load |
|---|---|---|
| `references/rice-pot-test-plan-prompt.md` | Full RICE-POT prompt to execute — Role, Instructions (18-section spec), Context, Example, Parameters, Output, Tone | Always — read before generating |
