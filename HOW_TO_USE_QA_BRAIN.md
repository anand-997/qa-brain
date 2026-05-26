# How to Use QA Brain

QA Brain is a library of Claude Code skills. Once deployed to your project, each skill is invoked with a slash command — Claude reads the skill, asks what it needs, and generates the output.

See `README.md` for deployment instructions (copy skills to `.claude/skills/`).

---

## Step 1 — Deploy Skills to Your Project

Copy the relevant skill folders from `qa-brain/` into your project's `.claude/skills/` directory.

See **README.md → "How to Deploy Skills in Your Project"** for copy commands by project type.

After copying, open Claude Code inside your project:
```
cd your-project
claude
```

---

## Step 2 — Receive the Requirement

Your QA cycle begins when you receive any form of requirement:
- BRD, PRD, or User Story
- Figma UI design
- API Swagger / OpenAPI spec
- Developer notes or client requirements

---

## Step 3 — Analyze the Requirement

Use the `/research` skill to break down what you received:

```
/research
```

Paste in the requirement document, Figma URL, or Swagger link. Claude will produce:
- Scope summary
- Identified risks and missing information
- Suggested testing types
- Acceptance criteria checklist

---

## Step 4 — Generate Test Cases

Use the `/generate-test-cases` skill:

```
/generate-test-cases
```

Paste your requirement, user story, or API spec. Claude generates full coverage:
- Positive tests
- Negative tests
- Boundary and edge cases
- Security checks (XSS, SQLi, auth)
- UI-specific or API-specific scenarios

---

## Step 5 — UI Automation (Selenium)

### New project — bootstrap the framework

```
/create-selenium-framework
```

Claude asks 7 questions (project name, URLs, browser, Java version, etc.) then generates 21 files: pom.xml, DriverFactory, BasePage, BaseTest, ConfigManager, WaitHelper, ScreenshotUtil, listeners, sample pages, TestNG suites, smoke test, config files, and .gitignore.

### Generate a Page Object

```
/create-page-objects
```

Paste a page URL, HTML snippet, or describe the page. Claude generates a Java Page Object with `@FindBy` locators, action methods, and wait handling. Supports iFrames, Shadow DOM, and dynamic elements.

### Add test cases to existing framework

```
/add-ui-tests
```

Describe the feature or paste the Page Object class. Claude generates a TestNG test class with positive tests, negative `@DataProvider`, test data, and a suite XML block to add to your existing suite.

### Syntax lookup

```
/selenium-lookup
```

Ask any Selenium or Playwright syntax question. Returns a ready-to-use code snippet.

---

## Step 6 — API Automation (REST Assured)

### New project — bootstrap the framework

```
/create-restassured-framework
```

Claude asks 7 questions (project name, URLs, auth type, Java version, etc.) then generates 29 files: pom.xml, BaseAPI, BaseTest, ConfigManager, TokenManager, listeners, schema validator, smoke tests, suites, config files, and .gitignore.

### Add a new API resource

```
/create-test-module
```

Paste your cURL or Postman request. Claude generates the complete resource module: endpoint class, request/response POJOs, test class, JSON schema, suite XML block, and api.properties entry.

### Add tests to an existing resource

```
/add-api-tests
```

Paste your cURL + test cases. Claude adds a new test class and endpoint method to the existing resource — framework classes are never touched.

### Syntax lookup

```
/ra-lookup
```

Ask any REST Assured syntax question. Returns a ready-to-use code snippet.

---

## Your QA Workflow in One View

```
Receive requirement
       │
       ▼
/research              ← understand scope, risks, missing info
       │
       ▼
/generate-test-cases   ← full test case coverage from requirement
       │
       ├── UI project?
       │       ├── /create-selenium-framework   (new project)
       │       ├── /create-page-objects          (new page)
       │       └── /add-ui-tests                 (add tests)
       │
       └── API project?
               ├── /create-restassured-framework  (new project)
               ├── /create-test-module            (new resource)
               └── /add-api-tests                 (new operation)
```

---

## Skill Quick Reference

| What you need | Command |
|---|---|
| Analyze a requirement or design | `/research` |
| Generate test cases from requirements | `/generate-test-cases` |
| Bootstrap Selenium project | `/create-selenium-framework` |
| Generate Page Object from URL/HTML | `/create-page-objects` |
| Add UI tests to existing framework | `/add-ui-tests` |
| Selenium/Playwright syntax snippet | `/selenium-lookup` |
| Bootstrap REST Assured project | `/create-restassured-framework` |
| Add new API resource from cURL | `/create-test-module` |
| Add tests to existing API resource | `/add-api-tests` |
| REST Assured syntax snippet | `/ra-lookup` |
