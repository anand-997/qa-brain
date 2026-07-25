---
name: generate-test-strategy
description: >
  Generate a complete, enterprise-grade Test Strategy document from a feature requirement
  (Jira ID, plain text, .txt, or .md). Use this skill whenever the user says "generate test
  strategy", "create a test strategy", "write a test strategy doc", "test strategy for this
  feature", or shares a requirement and wants a formal QA strategy artifact — not individual
  test cases. Produces all 21 sections of the fixed Test Strategy template (Document Control
  through Approval & Sign-off) with every {{placeholder}} filled from the requirement, no
  sections added or removed, and no invented requirements/APIs/behavior. Invoke proactively
  when a user shares a requirement and wants a strategy/planning document rather than test
  cases.
---

# Generate Test Strategy (RICE-POT)

Converts a feature requirement into a complete Test Strategy document, following the
**RICE-POT** prompt framework (see
[../RICE_POT_FRAMEWORK.md](../RICE_POT_FRAMEWORK.md)). The full, self-contained,
copy-pasteable prompt lives in
[references/rice-pot-test-strategy-prompt.md](references/rice-pot-test-strategy-prompt.md),
and the fixed 21-section output structure it must follow lives in
[references/test-strategy-template.md](references/test-strategy-template.md).

## How This Skill Works

Two phases: **Clarify → Generate.** Never generate the strategy before Phase 1 is resolved.

### Phase 1: Clarify

Ask in one message:

```
Before I generate the test strategy, a few details:

1. **Requirement** — Paste the Jira ID summary, plain text, or the .txt/.md content
   of the requirement. Treat this as the single source of truth.

2. **Team / timeline** *(optional)* — Team size and testing duration, if known
   (used for Roles & Responsibilities and Schedule & Milestones). If not given,
   infer conservatively from the requirement's scope and mark as "Inference (low confidence)".

3. **Domain-specific concerns** *(optional)* — Anything that needs extra depth:
   accessibility, security/compliance (PCI-DSS, GDPR), performance targets, i18n.
```

Wait for the response before generating.

### Phase 2: Generate

Read `references/rice-pot-test-strategy-prompt.md` in full and execute it exactly as
written, treating the requirement from Phase 1 as the input attachment and
`references/test-strategy-template.md` as the attached template. In particular:

1. Parse the requirement: what is being built, user/business goals, workflows,
   interfaces (UI/API/data), integrations, and constraints stated.
2. Produce **all 21 sections**, in the same order and with the same headings/numbering as
   `test-strategy-template.md` — never add, remove, or reorder sections.
3. Replace every `{{placeholder}}` with a concrete value derived from the requirement. If a
   section has no applicable content, keep the heading and write
   "Not applicable — <one-line reason>".
4. Remove the template's illustrative `> _Example (...)_` blockquotes unless the feature
   genuinely belongs to that domain — replace them with content specific to this feature.
5. Fill every table (Document Control, Revision History, Tools, Roles, Environments,
   Schedule, Defect Management, Risks, Approval) with real, feature-appropriate values.
6. In "Domain-Specific Considerations", include only the categories relevant to this
   feature and detail them concretely.
7. Use today's date for Created Date/Last Updated and "1.0" for the initial version unless
   the requirement specifies otherwise.

## Hard Rules

- **Never invent** requirements, features, IDs, APIs, error codes, UI elements, or
  integrations not stated or directly implied by the input.
- **Never assume** "typical" or default system behavior to fill gaps.
- If information is missing for a required field: respond exactly
  `"Insufficient information to determine."`
- If a detail is inferred: label it exactly `"Inference (low confidence)"`.
- Output the strategy document only — no preamble, no explanation, valid Markdown
  (headings, tables, lists intact).

## Follow-up Options

After delivering the strategy, always offer:

```
What would you like next?
1. Generate test cases from this strategy's scope → use /generate-test-cases
2. Expand a specific section in more depth (e.g., Risks, Test Data Management)
3. Regenerate with updated team size / timeline / domain concerns
```

## Reference Files

| File | Purpose | When to Load |
|---|---|---|
| `references/rice-pot-test-strategy-prompt.md` | Full RICE-POT prompt to execute — Role, Instructions, Context, Example, Parameters, Output, Tone | Always — read before generating |
| `references/test-strategy-template.md` | The fixed 21-section output structure with `{{placeholders}}` | Always — the authoritative structure to conform to |
