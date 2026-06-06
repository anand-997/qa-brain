# RICE-POT Prompt: Test Plan Generator

Copy everything inside the code block below and paste it into your AI tool to generate a complete test plan.

```
### R — Role
You are a Senior QA Lead (Test Lead) with 15+ years of experience in API testing, test planning, and software quality assurance. You have deep expertise in REST API testing, Postman, REST Assured automation, and enterprise-level test documentation. This test plan is authored by you as the Test Lead responsible for the project, including defining job allocation, resource planning, and all testing activities from start to end.

### I — Instructions
1. Generate a complete, professional Test Plan document for the provided API or application.
2. The test plan MUST include all of the following sections in this exact order:
   - Test Plan ID (document identifier, version, and date)
   - Testing Item (name and brief description of the system/application under test)
   - Objective
   - Scope (list all testing types as numbered items)
   - Inclusions / Feature to be Tested (all CRUD operations and testing types relevant to the system)
   - Feature NOT to be Tested (items explicitly out of scope with reason)
   - Test Environments (OS, browsers, devices, network, environment table with Name, Env URL, Purpose, and Access/Credentials note)
   - Test Data Management (how test data is sourced, created, refreshed, and torn down; PII handling; data reset between runs)
   - Defect Reporting Procedure (criteria, steps, triage process, tools, roles, POC table; includes Defect Life Cycle sub-section)
   - Severity & Priority Classification (Severity S1–S4 and Priority P1–P4 definition tables)
   - Test Strategy (Step 1: test case design techniques, Step 2: testing procedure, Step 3: best practices)
   - Test Schedule (task table with task name and dates, sprint duration, explicit project Start Date and End Date)
   - Resources Allocation (people, tools, and environments allocated to the project)
   - Roles & Responsibility (table of team members, roles, job allocation, and availability)
   - Test Deliverables
   - Entry and Exit Criteria (for Requirement Analysis, Test Execution, and Test Closure phases)
   - Suspension and Resumption Criteria (conditions to halt testing and conditions to resume)
   - Pass/Fail Criteria (explicit quantitative thresholds for release readiness)
   - Test Metrics & Reporting (KPIs with definitions and targets, plus reporting cadence)
   - Tools (list of tools used)
   - Risks and Mitigations (at least 3 risk/mitigation pairs)
   - Signature & Approval (sign-off table with Name, Role, Signature, Date)
3. For the Scope section, include at minimum: Functional, Data Validation, Error Handling, Performance, Security, Integration, Compatibility, Documentation Review, Load, Regression, Edge Case, Concurrency, Ad Hoc, Usability, CI/CD, Performance Monitoring, Backup & Recovery, Internationalization, Rate Limiting, Third-Party Integration, Accessibility (a11y), and API Contract / Schema Validation (OpenAPI / JSON-schema) testing.
4. For the Inclusions section, cover: Create (POST), Read (GET), Update (PUT), Delete (DELETE), Boundary, Concurrency, Data Validation, Authentication & Authorization, Error Handling, Security, Performance, Integration, Regression, Documentation Review, Load, Compatibility, Usability, CI/CD, Rate Limiting, Backup & Recovery. List the CRUD endpoints exactly as given in the provided API documentation; if a specific endpoint path is not provided, use the placeholder `[INSERT ENDPOINT]` — never invent paths.
5. Write the Defect Reporting Procedure with a POC table listing Frontend, Backend, and DevOps contacts.
6. Write the Test Strategy across 3 steps: (1) test design techniques including ECP, BVA, Decision Table, State Transition, Use Case, Error Guessing, Exploratory; (2) testing procedure from smoke testing through regression; (3) best practices including Context Driven, Shift Left, Exploratory, and End-to-End Flow Testing.
7. Write the Test Schedule as a task list (Creating Test Plan, Test Case Creation, Test Case Execution, Summary Reports Submission) with a sprint duration note.
8. Entry and Exit Criteria must cover three phases: Requirement Analysis, Test Execution, and Test Closure — each with explicit Entry and Exit conditions.
9. Test Plan ID must follow the format `TP-[PROJECT]-001` and include the document version number and the date of creation.
10. Feature NOT to be Tested must list at least 3 items that are explicitly out of scope, each with a brief reason (e.g., third-party payment gateway internal logic — not accessible; hardware-level testing — outside project boundary).
11. Pass/Fail Criteria must define explicit, quantitative thresholds for release readiness. Examples: ≥95% of planned test cases executed and passed; zero Priority 1 (P1/Critical) defects open at test closure; no more than 2 Priority 2 defects deferred with documented approval. Include quantitative non-functional (NFR) thresholds as well — for example, p95 API response time ≤ 2s under nominal load, error rate < 1% under target load, and sustained throughput meeting the stated requests-per-second target.
12. Resources Allocation must list all people, tools, and environments assigned to the project. Roles & Responsibility must include a table with columns: Team Member Name, Role, Job Allocation (tasks assigned), and Availability (%). Include at minimum: Test Lead, Test Engineer(s), Developer POC, and Project Manager.
13. Defect Life Cycle must appear as a sub-section within Defect Reporting Procedure. It must include a numbered lifecycle flow: 1. New → 2. Assigned → 3. Open → 4. Fixed → 5. Retest → 6. Closed (or Reopened if retest fails). Include a brief description of each state, and map each state to its corresponding JIRA workflow status (e.g., New → "To Do", Assigned/Open → "In Progress", Fixed → "In Review", Retest → "In Testing", Closed → "Done", Reopened → "Reopened").
14. The Test Schedule must state an explicit project-level Start Date and End Date for the overall testing activity (not just per-task dates). Use `[INSERT START DATE]` and `[INSERT END DATE]` placeholders if not provided.
15. Signature & Approval must include a table with columns: Name, Role, Signature, Date. Rows must include at minimum: Test Lead, Project Manager, and Client Representative.
16. Test Data Management must describe how test data is sourced, created, refreshed, and torn down, how sensitive/PII data is handled, and how data is reset between runs. Include a table with columns: Data Set, Purpose, Source, Refresh Policy. Cover valid, invalid, and boundary booking payloads plus authentication token generation.
17. Severity & Priority Classification must define two tables. Severity table: S1 (Critical), S2 (Major), S3 (Minor), S4 (Cosmetic), each with a definition. Priority table: P1 (Critical), P2 (High), P3 (Medium), P4 (Low), each with a definition. These definitions are the authoritative reference for the P1/P2 thresholds used in Pass/Fail Criteria.
18. Suspension and Resumption Criteria must list explicit conditions that halt testing (e.g., a blocker/P1 defect with no workaround, test environment unavailable, more than 20% of smoke tests failing, missing test data or credentials) and the conditions that must be met to resume.
19. Test Metrics & Reporting must define the KPIs tracked and the reporting cadence. Include a table with columns: Metric, Definition, Target — covering at minimum Test Execution %, Pass Rate, Defect Density, Defect Leakage (escape rate), and Defect Removal Efficiency. Describe the reporting cadence: daily stand-up updates, a weekly status report, and an end-of-cycle test summary report.

Do NOT:
- Invent API endpoints, error codes, or behavior not derivable from the provided context.
- Skip any of the 22 required sections.
- Add sections beyond the 22 listed above.
- Use placeholder text like "TBD" without noting it is intentionally left for the team to fill in.
- Write the test plan in a bullet-only format — use descriptive prose paragraphs for explanatory sections (Objective, Defect Reporting Procedure, Test Strategy) and structured lists/tables where appropriate.

### C — Context
- System under test: [INSERT API or APPLICATION NAME AND DESCRIPTION HERE]
- API documentation URL: [INSERT URL]
- The system supports booking management operations including creating, reading, updating, and deleting bookings, plus authentication token generation.
- The application is known to contain bugs — part of the objective is to discover them.
- Test execution will use Postman for manual/exploratory runs and REST Assured (Java) for automation.
- Team uses JIRA for bug tracking and follows a sprint-based delivery model.
- Environment table should include at least QA and Pre-Prod rows.
- Supported platforms: Windows 10 (Chrome, Firefox, Edge), macOS (Safari), Android (Chrome), iOS Safari.
- Defect POC contacts — fill in real names or use these placeholders: Frontend: [Frontend Dev Name], Backend: [Backend Dev Name], DevOps: [DevOps Name].

### E — Example
The Objective section should read like this:

"The objective of this test plan is to verify the [System Name] API, covering booking creation, update, deletion, and authentication. The system is known to contain defects which must be identified and logged. All test cases will be executed in Postman, and automation will be implemented using the REST Assured framework."

The Scope section should list testing types as numbered items with 2–4 bullet sub-points each, for example:
"1. Functional Testing:
   - Verify the correctness and functionality of all API endpoints as per the API documentation.
   - Test various scenarios for booking creation, modification, and cancellation.
   - Validate user authentication and authorization mechanisms for protected endpoints."

The Test Environments table should look like:
| Name      | Env URL                                         | Purpose                          | Access / Credentials      |
|-----------|-------------------------------------------------|----------------------------------|---------------------------|
| QA        | https://[app-url]/apidoc/index.html             | Functional & exploratory testing | [INSERT ACCESS NOTE]      |
| Pre Prod  | https://[app-url]/apidoc/index.html             | Regression & release validation  | [INSERT ACCESS NOTE]      |

The Defect POC table should look like:
| Defect Process | POC       |
|----------------|-----------|
| Frontend       | [Name]    |
| Backend        | [Name]    |
| Dev Ops        | [Name]    |

The Severity & Priority tables should look like:
| Severity | Definition                                                        |
|----------|-------------------------------------------------------------------|
| S1 — Critical | System unusable; core booking/auth flow blocked, no workaround. |
| S2 — Major    | Major function fails; workaround exists but is costly.          |

| Priority | Definition                                                  |
|----------|-------------------------------------------------------------|
| P1 — Critical | Must be fixed before release; blocks sign-off.          |
| P2 — High     | Fix required in current cycle; impacts key scenarios.   |

The Roles & Responsibility table should look like:
| Team Member Name | Role          | Job Allocation                          | Availability (%) |
|------------------|---------------|-----------------------------------------|------------------|
| [INSERT NAME]    | Test Lead     | Test planning, review, sign-off         | 100%             |
| [INSERT NAME]    | Test Engineer | Test case design, execution, reporting  | 100%             |

The Risks and Mitigations table should look like:
| Risk                                          | Mitigation                                              |
|-----------------------------------------------|---------------------------------------------------------|
| Unstable QA environment delays execution      | Schedule env health checks; maintain Pre-Prod fallback. |
| Late requirement changes invalidate test cases| Apply Shift-Left review; version-control test artifacts. |

A Pass/Fail criteria statement should read like:
"The release is approved when ≥95% of planned test cases have executed and passed, zero P1 (Critical) defects remain open at test closure, no more than 2 P2 defects are deferred with documented approval, and p95 API response time stays within 2s under nominal load."

The Defect Life Cycle flow should read like:
"1. New → 2. Assigned → 3. Open → 4. Fixed → 5. Retest → 6. Closed (or Reopened if retest fails)", with each state mapped to its JIRA status (e.g., New → To Do, Open → In Progress, Fixed → In Review, Closed → Done).

### P — Parameters
- Output must be deterministic: same input context must produce the same section structure every time.
- Every statement must be traceable to the provided context or standard QA industry practice.
- If a detail (e.g., sprint dates, team names) is not provided, leave a clearly marked placeholder: [INSERT VALUE].
- Do not invent features, integrations, or behaviors not stated in the context.
- Do not infer default "typical" system behavior unless it is a universal REST API convention (e.g., HTTP status codes).
- Each section must be complete — do not abbreviate or truncate with "...and more."
- The document must be production-quality, ready to present to a client for sign-off.
- Minimum length: the Scope section must cover at least 22 testing types; Inclusions must cover at least 20 CRUD-related testing areas; Feature NOT to be Tested must list at least 3 items; Roles & Responsibility table must have at least 4 rows.

### O — Output
- Format: Markdown (.md)
- Structure: Sections in this exact order — Test Plan ID, Testing Item, Objective, Scope, Inclusions / Feature to be Tested, Feature NOT to be Tested, Test Environments, Test Data Management, Defect Reporting Procedure (with Defect Life Cycle sub-section), Severity & Priority Classification, Test Strategy, Test Schedule, Resources Allocation, Roles & Responsibility, Test Deliverables, Entry and Exit Criteria, Suspension and Resumption Criteria, Pass/Fail Criteria, Test Metrics & Reporting, Tools, Risks and Mitigations, Signature & Approval.
- Use `##` for top-level section headings and `###` for sub-headings (e.g., Entry Criteria / Exit Criteria within each phase; Defect Life Cycle within Defect Reporting Procedure).
- Use numbered lists for Scope and Inclusions items with bullet sub-points.
- Use Markdown tables for: Test Plan ID metadata, Test Environments, Test Data Management, Defect POC, Severity & Priority Classification, Test Schedule, Resources Allocation, Roles & Responsibility, Test Metrics & Reporting, and Signature & Approval.
- Prose paragraphs for: Objective, Test Data Management narrative, Defect Reporting Procedure narrative, Test Strategy steps, Suspension and Resumption Criteria rationale, Pass/Fail Criteria rationale, and Test Metrics & Reporting cadence.
- Do not add a table of contents — output the sections directly.
- Do not wrap the output in a code block — output raw Markdown.

### T — Tone
Technical and professional. Formal QA enterprise documentation style. Write as if this document will be reviewed and signed off by a client stakeholder. No casual language, no first-person ("I"), no hedging phrases ("might," "could possibly"). Use declarative statements throughout.
```

---

## How to Use This Prompt

1. Copy the entire block above (everything between the triple backticks).
2. Replace the `[INSERT ...]` placeholders in the **C — Context** section with your actual application details.
3. Paste into Claude (or any capable AI tool).
4. The output will be a complete Markdown test plan matching the structure of `STRUCTURE.md`.

---

## RICE-POT Framework Reference

| Letter | Component    | Purpose in this prompt                                              |
|--------|--------------|---------------------------------------------------------------------|
| **R**  | Role         | Senior QA Lead — sets the expertise level and authority of voice   |
| **I**  | Instructions | 19 ordered steps + explicit "Do NOT" rules to prevent hallucination |
| **C**  | Context      | System under test, tools, team, environments, platforms            |
| **E**  | Example      | Sample Objective paragraph and table formats to anchor the style   |
| **P**  | Parameters   | Determinism, no hallucination, placeholder policy, length minimums |
| **O**  | Output       | Exact Markdown format, 22-section order, heading levels, table usage |
| **T**  | Tone         | Formal, declarative, enterprise-grade documentation style          |
