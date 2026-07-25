---
name: generate-trd
description: >
  Convert a Business Requirements Specification (BRS/BRD) into a structured, implementation-ready
  Technical Requirements Document (TRD) with explicit Frontend/Backend separation. Use this skill
  whenever the user says "generate TRD", "create a TRD", "convert BRS to TRD", "BRS to TRD",
  "write a technical requirements doc", or pastes a BRS/BRD and asks for it to be turned into
  engineering-ready requirements. Enforces a zero-hallucination policy — every screen, field,
  API, or rule not explicitly in the BRS/design references is captured as a TBD-XX item rather
  than invented. Produces a metadata header, FE/BE-split feature sections, API/data contracts,
  acceptance criteria, and an open-questions/TBD list. Invoke proactively when a user shares a
  BRS/BRD and wants engineering documentation from it, even without saying "TRD".
---

# Generate TRD (BRS → Master TRD)

Converts a Business Requirements Specification/Document (BRS/BRD) into a single master
Technical Requirements Document (TRD), structured for both Frontend and Backend teams. This
skill is built on the **BRS → TRD prompt framework**. The full, self-contained,
copy-pasteable prompt — including the exact output template — lives in
[references/brs-to-trd-prompt.md](references/brs-to-trd-prompt.md).

## How This Skill Works

Two phases: **Clarify → Generate.** Never generate the TRD before Phase 1 is resolved.

### Phase 1: Clarify

Ask in one message:

```
Before I generate the TRD, a few details:

1. **BRS/BRD** — Paste the requirements text, or share the file/section to convert.

2. **Design references** *(optional)* — Any Figma/Zeplin links or screenshots not
   already included in the BRS.

3. **Fixed constraints** *(optional)* — Is any tech stack, database, or API shape
   already decided? If not stated, I will leave these open rather than assume.

4. **Scope** *(optional)* — Convert the whole document, or a specific feature/module
   first? Large BRS documents are easier to review section-by-section.
```

Wait for the response before generating.

### Phase 2: Generate

Read `references/brs-to-trd-prompt.md` and follow its output format exactly:

1. Machine-readable `TRD_METADATA` header (feature/module, screens/flows, APIs, design refs).
2. Scope & Context (In Scope / Out of Scope).
3. High-Level Goals (BRS Goal → TRD Interpretation table).
4. Global Technical Requirements (cross-cutting concerns, FE vs BE where relevant).
5. One section per feature/screen/module, each with:
   - Frontend behaviour
   - Backend / data / business rules
   - Design → Component Mapping (only if design refs exist)
   - Expected Data & API Contracts
6. Workflows (for complex flows).
7. Acceptance Criteria (table, with Related TRD IDs).
8. Open Questions / TBDs.

## Hard Rules (Zero Hallucination Policy)

- **Never invent** screens, flows, logic, data fields, APIs, or error codes not explicitly
  present in the BRS/BRD or referenced design materials.
- **Every gap is a `TBD-XX`** — missing or unclear screens, states, fields, rules, or error
  handling must be captured with a short impact note (e.g., "Blocks FE error messaging").
- **Never prescribe tech stack, DB vendor, or low-level API contracts** unless the BRS
  already defines them or the user explicitly asks for it.
- **Preserve business language** — restructure and add IDs/FE-BE split without changing
  the original intent or wording.
- Reference concrete TRD IDs (e.g., `TRD-H2 – Header CTA button logic (BE)`) so FE and BE
  can coordinate off the same document.

## Follow-up Options

After delivering the TRD, always offer:

```
What would you like next?
1. Generate test cases from this TRD → use /generate-test-cases
2. Expand a specific feature section in more depth
3. Convert the next section (if working through a large BRS section-by-section)
4. Revisit Open Questions/TBDs once Product/BA has answered them
```

## Reference Files

| File | Purpose | When to Load |
|---|---|---|
| `references/brs-to-trd-prompt.md` | Full BRS→TRD prompt: metadata block spec, output template (all sections), TBD conventions, quality rules | Always — read before generating |
