---
name: generate-test-cases
description: >
  Generate professional, structured QA test cases from feature requirements, TRDs, Figma
  designs, or plain descriptions. Covers UI, API, and hybrid features. Use this skill
  whenever the user says "generate test cases", "write test cases", "create test cases for",
  "QA test cases", "test scenarios for", "create a test suite", or describes a feature and
  wants it tested — even without a formal TRD. Interviews the user to gather context,
  auto-detects applicable suites (Smoke, Functional, Security, Performance, Regression,
  Accessibility, Cross-browser), then generates test cases using standard techniques
  (ECP, BVA, DTT, Behavioral, Error Handling) in both markdown and CSV format. Invoke
  proactively whenever a user describes a feature and wants QA coverage — do not wait for
  the user to say "skill" or use any special phrase.
---

# Generate Test Cases

A structured, interview-first skill for generating professional QA test cases. Works from
any input: a pasted TRD, a plain description, a Figma URL, or a conversation about a
feature. Output follows the standard QA team template and exports to both markdown and CSV.

## How This Skill Works

Three phases: **Interview → Analysis → Generation**

Do not skip the interview phase. Even if the user pastes a complete TRD, still confirm the
optional fields (Figma URL, specific concerns, ID prefix) — a single message asking for them
costs almost nothing and the quality improvement is significant.

---

## Phase 1: Interview

Ask all 8 questions in **one message**. Tell the user upfront that questions 5, 7, and 8 are
optional so they don't feel obligated to answer everything before you can start.

```
Before I generate test cases, I need a few details to make them precise and complete.
Most questions are quick — optional ones are marked *(optional)*.

1. **Application type** — Web, Mobile (iOS/Android/both), REST API, Desktop, or Hybrid?

2. **Feature / Requirement** — Paste your TRD, describe the feature in plain language,
   or share a Figma URL. For TRDs over 500 lines, note which section(s) to focus on first.

3. **New or existing?** — Is this a new feature, or a change/extension to something
   that already exists? (This determines how much regression coverage to add.)

4. **Technology stack** — e.g., React + Node.js REST API, Angular, iOS Swift,
   Django REST, etc.

5. **Figma URL or design screenshots?** *(optional)* — If yes, paste the Figma URL or
   attach screenshots. I'll extract component states, error states, and form fields.

6. **Priority focus** — Which test cases do you want?
   - P0 only (smoke tests, critical paths)
   - P0 + P1 (critical + important)
   - All priorities (P0 through P3, full coverage)

7. **Specific concerns?** *(optional)* — Any areas needing extra attention?
   Examples: security-sensitive data, high-traffic / performance-critical,
   accessibility required (WCAG 2.1), payment flows, file uploads, concurrent users.

8. **Test case ID prefix** *(optional)* — e.g., `TC_AUTH`, `TC_CHECKOUT`.
   If not specified, I'll auto-derive from the module name.
```

Wait for the user's response before proceeding to Phase 2.

---

## Phase 2: Analysis — Map Answers to Test Suites

After the user responds, analyze their answers and determine which suites apply.
**Show the user a brief analysis before generating** — this builds trust and gives them a
chance to correct your understanding before you spend time on output.

### Suite Auto-Detection Rules

| Signal in User's Description | Suite(s) to Apply |
|---|---|
| Always | **Functional** (positive, negative, boundary, edge cases) |
| Modifying or extending an existing feature | **Regression** |
| Login, checkout, payment, order flow, core user journey | **Smoke** (P0 critical paths) |
| Large datasets, dashboards/analytics, file uploads, concurrent users, heavy API | **Performance / Load** |
| Auth / authorization, payment, PII / sensitive data, file upload, RBAC, API endpoints | **Security** |
| UI/UX changes, new screens or components, user-facing forms | **Accessibility** (WCAG 2.1) |
| Web frontend, responsive design, new screens | **Cross-browser / Device** |
| REST API endpoints, schema changes, integrations, status codes | **API Contract / Schema** |

Present your analysis like this before generating:

```
Based on your answers, I'll generate test cases for these suites:
✅ Functional (always included)
✅ Regression (modifying existing feature)
✅ Security (authentication + file upload detected)
✅ Cross-browser (web UI with responsive design)

Not included (no signals detected): Performance, Accessibility
→ Let me know if you want to add any of these.
```

### Which Reference Files to Load

Load the appropriate references before generating:

- **UI feature** (web/mobile frontend, Figma URL provided, responsive/layout work):
  Read `references/ui-context.md` and `references/testing-techniques.md`
- **API feature** (REST endpoints, schema changes, backend integrations):
  Read `references/api-context.md` and `references/testing-techniques.md`
- **Hybrid / full-stack feature**: Read both `references/ui-context.md` and
  `references/api-context.md` plus `references/testing-techniques.md`
- **All cases**: Always read `references/test-case-template.md` — it defines the
  mandatory output structure and CSV format requirements

---

## Phase 3: Generation

### Core Rules

1. **Zero hallucination policy**: Generate test cases ONLY for requirements the user
   described. Never invent features, fields, or behaviors not mentioned.

2. **Coverage for every detected suite**:
   - Positive test cases (happy path, valid inputs)
   - Negative test cases (invalid inputs, error conditions, rejected states)
   - Boundary test cases (edge values, limits — apply BVA)
   - Regression test cases (verify existing behavior still works after changes)

3. **Technique selection** (full details in `references/testing-techniques.md`):

   | Feature Characteristic | Technique to Apply |
   |---|---|
   | Input fields with validation rules | ECP — Equivalent Class Partitioning |
   | Numeric ranges, string lengths, date/time limits | BVA — Boundary Value Analysis |
   | Multiple conditions affecting a business outcome | DTT — Decision Table Testing |
   | User workflows, multi-step flows, state transitions | Behavioral Coverage Testing |
   | Error messages, system failures, timeouts | Error Handling Coverage |
   | Formulas, calculations, totals, discounts | Calculation-Based Testing |

4. **Test case IDs**: Use the prefix from Q8, or auto-derive from the module name.
   Format: `TC_[MODULE]_[NUMBER]` (e.g., `TC_AUTH_001`, `TC_PERF_008`).
   Increment numbers continuously across the full output.

5. **TRD traceability**: Map every test case to the specific TRD section, requirement ID,
   or change reference it validates. If no TRD IDs exist, use descriptive change refs
   (e.g., `Requirement: Profile picture upload — max 5MB`).

6. **Large TRDs (500+ lines)**: Use the modular approach from `references/ui-context.md`.
   Announce the section breakdown upfront, generate one section at a time, and offer to
   continue after each batch.

### Figma Integration

If the user provided a Figma URL, use the Figma MCP tool to read the design context.
Extract: component names, interaction/hover states, form fields and their labels,
validation hints shown in the design, error states, loading indicators, empty states.
Incorporate these directly into test objectives and expected results.

---

## Output Format

Always produce BOTH formats. Start with the summary block, then markdown test cases,
then the CSV block at the end.

### 1. Summary Block (always first)

```
## Test Case Generation Summary

**Feature**: [Feature name / module]
**Application**: [Web / API / Mobile / Hybrid]
**Suites Generated**: [Functional, Security, Regression, ...]
**Total Test Cases**: [N]
**Techniques Used**: [ECP, BVA, DTT, Behavioral, Error Handling]

**Coverage Map**:
| Requirement / Change | Test Case IDs |
|---|---|
| [Change 1 description] | TC_XXX_001, TC_XXX_002, TC_XXX_003 |
| [Change 2 description] | TC_XXX_004, TC_XXX_005 |
| Regression | TC_XXX_006, TC_XXX_007 |
```

### 2. Full Markdown Format (one block per test case)

See `references/test-case-template.md` for exact field definitions. Use this structure:

```
TEST CASE ID: TC_[MODULE]_[NUMBER]
CREATED BY: AI Generated
TEST CASE TITLE: [Clear, action-oriented title]
MODULE/FEATURE: [Feature / module name]
PRIORITY: [P0 / P1 / P2 / P3]
TEST TYPE: [Functional / UI / API / Regression / Smoke / Security / Performance]
TESTING TECHNIQUE: [ECP / BVA / DTT / Behavioral / Error Handling / Functional]
CHANGE REFERENCE: [TRD-ID or "Requirement: brief description"]

OBJECTIVE:
[1-2 sentences: what this validates and why it matters]

TEST DATA:
- [Field / parameter]: [Value]

EXPECTED RESULT:
✓ [Outcome 1]
✓ [Outcome 2]

TEST ENVIRONMENT:
- Browser: [Chrome Latest / Firefox / Safari — or "N/A" for API/mobile tests]
- OS: [Windows 11 / macOS / iOS / Android]
- Environment: QA
- Build Version: [x.x.x or TBD]

NOTES:
[TRD references, technique rationale, related test case IDs]
```

### 3. CSV Block (always last — ONE ROW PER TEST CASE)

This is mandatory. It must come after all markdown test cases. Never split a single test
case across multiple rows. Use semicolons to separate multiple values within a cell.

```csv
TEST CASE ID,CREATED BY,TEST CASE TITLE,MODULE/FEATURE,PRIORITY,TEST TYPE,TESTING TECHNIQUE,CHANGE REFERENCE,OBJECTIVE,TEST DATA,EXPECTED RESULT,TEST ENVIRONMENT,NOTES
TC_XXX_001,AI Generated,[title],[module],P0,Functional,BVA,[TRD-ID],[objective],[data1: val; data2: val],[✓ outcome1 ✓ outcome2],[Chrome; Win 11; QA; TBD],[notes]
```

---

## Follow-up Options

After delivering the test cases, always offer:

```
What would you like next?
1. More negative / edge case tests for a specific requirement
2. Security-focused test cases (OWASP injection, auth bypass, etc.)
3. Performance / load test scenarios
4. Accessibility test cases (WCAG 2.1)
5. Next TRD section (if using the modular approach)
6. CSV-only export of all test cases
```

---

## Reference Files

| File | Purpose | When to Load |
|---|---|---|
| `references/test-case-template.md` | Mandatory output format and CSV rules | **Always** |
| `references/testing-techniques.md` | ECP, BVA, DTT, Behavioral technique guide with examples | For all generation tasks |
| `references/ui-context.md` | UI/web generation patterns: Figma, cross-browser, responsive, modular TRDs | UI or hybrid features |
| `references/api-context.md` | API generation patterns: endpoints, status codes, auth, schema validation | API or hybrid features |
