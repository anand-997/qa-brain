# QA Brain — Portable Claude Code Skill Library

**Version:** 3.0 | **Updated:** May 2026

QA Brain is a collection of 10 portable Claude Code skills that turn Claude into a specialist QA engineer for your projects. Each skill is invoked with a slash command and generates production-ready code, test cases, or frameworks — no manual copy-pasting required.

---

## Repository Structure

```
qa-brain/
├── selenium-skills/         # 4 skills — Selenium WebDriver + TestNG + Maven
├── restassured-skills/      # 4 skills — REST Assured + TestNG + Maven
├── qa-skills/               # 2 skills — test case generation and research
├── .vscode/settings.json    # Playwright MCP server config
├── README.md                # This file
├── HOW_TO_USE_QA_BRAIN.md  # Workflow guide
└── CLAUDE.md                # Claude Code project instructions
```

---

## All 10 Skills

### UI Automation — Selenium (`selenium-skills/`)

| Command | Skill Directory | What it does |
|---|---|---|
| `/create-selenium-framework` | `create-selenium-framework/` | Runs a 7-question interview, then generates a complete 21-file Selenium WebDriver 4.x + TestNG + Maven project: DriverFactory, BasePage, BaseTest, ConfigManager, WaitHelper, ScreenshotUtil, listeners, sample pages, suites, smoke test, config files, .gitignore |
| `/create-page-objects` | `create-page-objects/` | Takes a URL, HTML snippet, or page description and generates a full Java Page Object class with `@FindBy` locators, action methods, and wait handling. Supports standard pages, iFrames, Shadow DOM, and dynamic elements |
| `/add-ui-tests` | `add-ui-tests/` | Takes a feature or Page Object and generates a complete TestNG test class with positive tests, negative `@DataProvider`, test data, and a suite XML block to add to your existing suite |
| `/selenium-lookup` | `selenium-lookup/` | Returns a focused Selenium (Java) or Playwright (TypeScript) code snippet for any syntax question — locators, waits, actions, alerts, frames, screenshots, file upload, drag-and-drop, and more |

### API Automation — REST Assured (`restassured-skills/`)

| Command | Skill File | What it does |
|---|---|---|
| `/create-restassured-framework` | `create-restassured-framework.md` | Runs a 7-question interview, then generates a complete 29-file REST Assured 5.4.0 + TestNG + Maven project: BaseAPI, BaseTest, ConfigManager, TokenManager, listeners, schema validator, smoke tests, config files, suites, .gitignore |
| `/create-test-module` | `create-test-module.md` | Takes a cURL or Postman command and generates a full new resource module: endpoint class, request/response POJOs, test class, JSON schema, suite XML block, and api.properties entry |
| `/add-api-tests` | `add-api-tests.md` | Takes a cURL + test cases and adds a new test class and endpoint method to an existing resource — never touches framework classes |
| `/ra-lookup` | `ra-lookup.md` | Returns a focused REST Assured code snippet for any syntax question — HTTP methods, auth, params, Hamcrest matchers, Jackson annotations, TestNG lifecycle, content types |

### QA Workflows (`qa-skills/`)

| Command | Skill Directory | What it does |
|---|---|---|
| `/generate-test-cases` | `generate-test-cases/` | Takes a TRD, user story, Figma URL, Swagger spec, or feature description and generates full test case coverage: positive, negative, boundary, edge, security, and UI/API-specific scenarios |
| `/research` | `research/` | Analyzes a requirement document, design, or live page and produces a structured breakdown: scope, risks, missing requirements, test strategy recommendations |

---

## How to Deploy Skills in Your Project

Skills are portable — copy them to any project and Claude Code makes them available immediately via slash commands. There are three ways to deploy.

### Option A — Global (available in every project)

Copy skills to your global Claude Code skills directory. They will be active in all projects you open.

**Windows:**
```cmd
xcopy /E /I "C:\Users\anand\qa-brain\selenium-skills" "%USERPROFILE%\.claude\skills\selenium-skills"
xcopy /E /I "C:\Users\anand\qa-brain\restassured-skills" "%USERPROFILE%\.claude\skills\restassured-skills"
xcopy /E /I "C:\Users\anand\qa-brain\qa-skills" "%USERPROFILE%\.claude\skills\qa-skills"
```

**Mac/Linux:**
```bash
cp -r ~/qa-brain/selenium-skills ~/.claude/skills/
cp -r ~/qa-brain/restassured-skills ~/.claude/skills/
cp -r ~/qa-brain/qa-skills ~/.claude/skills/
```

### Option B — Per-project (recommended)

Copy only the skills your project needs into the project's `.claude/skills/` directory. Skills are scoped to that project only.

```
your-project/
└── .claude/
    └── skills/
        ├── create-selenium-framework/   ← from selenium-skills/
        ├── create-page-objects/
        ├── add-ui-tests/
        ├── selenium-lookup/
        └── generate-test-cases/         ← from qa-skills/
```

### Option C — Selective copy by project type (recommended approach)

Pick only what the project needs:

**Selenium UI automation project:**
```cmd
set PROJECT=C:\path\to\your-project
xcopy /E /I "%USERPROFILE%\qa-brain\selenium-skills\create-selenium-framework" "%PROJECT%\.claude\skills\create-selenium-framework"
xcopy /E /I "%USERPROFILE%\qa-brain\selenium-skills\create-page-objects" "%PROJECT%\.claude\skills\create-page-objects"
xcopy /E /I "%USERPROFILE%\qa-brain\selenium-skills\add-ui-tests" "%PROJECT%\.claude\skills\add-ui-tests"
xcopy /E /I "%USERPROFILE%\qa-brain\selenium-skills\selenium-lookup" "%PROJECT%\.claude\skills\selenium-lookup"
xcopy /E /I "%USERPROFILE%\qa-brain\qa-skills\generate-test-cases" "%PROJECT%\.claude\skills\generate-test-cases"
```

**REST Assured API automation project:**
```cmd
set PROJECT=C:\path\to\your-project
copy "%USERPROFILE%\qa-brain\restassured-skills\create-restassured-framework.md" "%PROJECT%\.claude\skills\"
copy "%USERPROFILE%\qa-brain\restassured-skills\create-test-module.md" "%PROJECT%\.claude\skills\"
copy "%USERPROFILE%\qa-brain\restassured-skills\add-api-tests.md" "%PROJECT%\.claude\skills\"
copy "%USERPROFILE%\qa-brain\restassured-skills\ra-lookup.md" "%PROJECT%\.claude\skills\"
xcopy /E /I "%USERPROFILE%\qa-brain\qa-skills\generate-test-cases" "%PROJECT%\.claude\skills\generate-test-cases"
```

### After deployment

Open Claude Code (`claude`) inside your project directory. Type the skill command:

```
/create-selenium-framework
```

Claude will read the skill and start the interview. No configuration needed.

---

## Typical Workflows

### Starting a new Selenium project from scratch

```
1. Deploy selenium-skills + generate-test-cases to your project (Option C above)
2. Open Claude Code in your project root
3. /generate-test-cases   ← paste your requirements; get full test case coverage
4. /create-selenium-framework  ← answer 7 questions; 21 files generated
5. /create-page-objects   ← paste page URL or HTML; Page Object generated
6. /add-ui-tests          ← describe the feature; test class generated
```

### Starting a new REST Assured project from scratch

```
1. Deploy restassured-skills + generate-test-cases to your project
2. Open Claude Code in your project root
3. /generate-test-cases   ← paste your API spec; get test case coverage
4. /create-restassured-framework  ← answer 7 questions; 29 files generated
5. /create-test-module    ← paste cURL command; full resource module generated
6. /add-api-tests         ← paste cURL + test cases; test class added
```

### Adding to an existing project

```
Deploy only the add/lookup skills:
  /add-ui-tests     ← add Selenium test class for a new feature
  /add-api-tests    ← add REST Assured tests for a new endpoint
  /selenium-lookup  ← quick syntax question
  /ra-lookup        ← quick syntax question
```

---

## Technology Stack Generated by Skills

| Layer | Technology |
|---|---|
| Language | Java 11 |
| UI automation | Selenium WebDriver 4.x |
| API automation | REST Assured 5.4.0 |
| Test framework | TestNG 7.10.2 |
| Build tool | Maven |
| Reporting | ExtentReports 5.1.2 |
| Logging | Log4j2 2.23.1 |
| Test data | JavaFaker 1.0.2, Apache POI |
| Serialization | Jackson 2.17.x, Lombok |
| Playwright (reference) | TypeScript (via selenium-lookup) |

---

## Skill Reference Files

Each skill bundles its reference documentation internally:

| Skill | Bundled references |
|---|---|
| `create-selenium-framework` | `complete-ui-project-structure.md`, `ui-framework-architecture-guide.md` |
| `create-page-objects` | `page-object-prompts-reference.md` |
| `add-ui-tests` | `ui-test-patterns-reference.md`, `ui-test-data-strategy-guide.md` |
| `selenium-lookup` | `selenium-playwright-quick-reference.md` |
| `create-restassured-framework` | All blueprints embedded in skill file |
| `create-test-module` | All blueprints embedded in skill file |
| `add-api-tests` | All blueprints embedded in skill file |
| `ra-lookup` | All snippets embedded in skill file |
| `generate-test-cases` | `ui-context.md`, `api-context.md`, `test-case-template.md`, `testing-techniques.md` |
| `research` | `methodology.md`, `analysis-frameworks.md`, `prompt-templates.md` |

Claude loads reference files on demand — only when the active task needs them — preserving context window space.
