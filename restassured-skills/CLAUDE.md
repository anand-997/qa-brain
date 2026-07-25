# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Directory Is

`restassured-skills/` is the REST Assured API test automation knowledge hub within QA Brain. It contains Claude Code skill folders for generating and maintaining Java-based API test automation projects.

**Portability:** Copy this folder's contents into `<project>/.claude/skills/` to activate all skills in any project.

There are no runnable files here — all content is Markdown skill definitions used by Claude Code.

## Skill Map

Each skill below follows the standard `SKILL.md` + `references/` folder format (references loaded on demand by that skill only — not shared across skills).

| Skill Folder | Invoke With | Use When |
|------------|------------|----------|
| `create-restassured-framework/` | `/create-restassured-framework` | Starting a brand-new REST Assured + TestNG + Maven project — runs a 7-question interview then generates all 29 files (pom.xml, core classes, ExtentReports listener, config, suites, smoke test, schema, .gitignore) |
| `create-test-module/` | `/create-test-module` | Adding a **new resource** to an existing project from a cURL command — generates endpoint class, request/response POJOs, test class, JSON schema, suite XML, and api.properties entry |
| `add-api-tests/` | `/add-api-tests` | Adding tests for a **new HTTP operation** to an existing resource — generates only the new method, POJOs, and test class; provides a suite XML block to append |
| `ra-lookup/` | `/ra-lookup` | Quick RestAssured syntax reference — HTTP methods, auth, query/path params, Hamcrest matchers, Jackson annotations, TestNG annotations, content types |
| `restassured-framework-bootstrap-rice-pot.md` | `/ra-bootstrap` | Fully self-contained bootstrap prompt (flat file, by design) — copy-paste into any AI tool (Claude, ChatGPT, Copilot) with no extra files needed |
| `git-ship/SKILL.md` | `/git-ship` | Stage → branch → commit → push with a generated Conventional Commits message and kebab-case branch name; works in any git repo |

## Technology Stack for Generated Code

- Java 11+, Maven, TestNG 7.10.2, REST Assured 5.4.0
- Lombok (`@Data @Builder @NoArgsConstructor @AllArgsConstructor`) + Jackson (`@JsonProperty`) for POJOs
- ExtentReports 5.1.2 for test reporting; Log4j2 2.23.1 for logging
- JavaFaker 1.0.2 for test data generation

## Mandatory Code Standards

All generated code must follow these non-negotiable rules:

1. **SoftAssert is mandatory** — every `@Test` uses `SoftAssert soft = new SoftAssert()`, always ending with `soft.assertAll()`
2. **Immutable static spec in BaseAPI** — `getAuthRequestSpec()` / `getRequestSpec()` return a new `RequestSender` per call; no `ThreadLocal` needed for specs
3. **RequestResponseCapture** — every endpoint method calls `captureRequest()` before and `captureResponse()` after the HTTP call
4. **`@BeforeClass` for endpoint init** — instantiate endpoint class once per test class, not per method
5. **Test method naming** — `{action}_{scenario}_{result}` (e.g., `createUser_missingEmail_returns400`), never `testXxx`
6. **`@Override methodTeardown()`** — cleanup in `methodTeardown()` calling `super.methodTeardown()`, never a separate `@AfterMethod cleanup()`
7. **`ExtentTestManager.logPass/logInfo`** in every test method

## Package Conventions for Generated Code

```
com.company.api.automation.endpoints.{Resource}Endpoints    ← extends BaseAPI
com.company.api.automation.models.request.Create{Resource}Request
com.company.api.automation.models.response.{Resource}Response
com.company.api.automation.tests.{module}.{Action}{Resource}Test ← extends BaseTest
com.company.api.automation.core.utils.RandomDataGenerator
com.company.api.automation.core.utils.TokenManager          ← never regenerate
```

Class naming: PascalCase. Methods: camelCase. Constants: `UPPER_SNAKE_CASE`. Max line length: 120 characters.

## Typical Workflow

```
New project?          → /create-restassured-framework
New resource/module?  → /create-test-module   (provide cURL + test cases)
New operation only?   → /add-api-tests         (provide cURL + test cases)
Syntax question?      → /ra-lookup
Ready to commit?      → /git-ship
```

## Content Update Rules

- Keep files under 1000 lines; split if longer
- Make all examples generic (no project-specific names or URLs)
- Cross-reference related files rather than duplicating content
- Update this file's table when adding or removing skill files
