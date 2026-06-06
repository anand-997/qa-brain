# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Repository Is

**QA Brain** is a library of 10 portable Claude Code skills for QA engineers. There is no runnable application, no build system, and no test commands. All content is Markdown skill definitions and their bundled reference files.

## Active Skill Directories

```
qa-brain/
├── selenium-skills/      # 5 skills — Selenium WebDriver 4.x + TestNG + Maven + git-ship
├── restassured-skills/   # 5 skills — REST Assured 5.4.0 + TestNG + Maven + git-ship
├── qa-skills/            # 4 skills — test case generation, requirements research, CI workflow generation, and git shipping
└── .vscode/settings.json # Playwright MCP server (npx @executeautomation/playwright-mcp-server)
```

The `.history/` directory contains timestamped backups of old content — it is not active.

## Skill Inventory

| Command | File / Directory | Purpose |
|---|---|---|
| `/create-selenium-framework` | `selenium-skills/create-selenium-framework/` | Interview → 21-file Selenium project |
| `/create-page-objects` | `selenium-skills/create-page-objects/` | URL/HTML → Page Object class |
| `/add-ui-tests` | `selenium-skills/add-ui-tests/` | Feature → TestNG test class + suite XML |
| `/selenium-lookup` | `selenium-skills/selenium-lookup/` | Selenium/Playwright syntax snippet |
| `/create-restassured-framework` | `restassured-skills/create-restassured-framework.md` | Interview → 29-file REST Assured project |
| `/create-test-module` | `restassured-skills/create-test-module.md` | cURL → new resource module |
| `/add-api-tests` | `restassured-skills/add-api-tests.md` | cURL + cases → new test class |
| `/ra-lookup` | `restassured-skills/ra-lookup.md` | REST Assured syntax snippet |
| `/generate-test-cases` | `qa-skills/generate-test-cases/` | Requirements → full test case coverage |
| `/research` | `qa-skills/research/` | Analyze requirements or designs |
| `/create-ci-workflow` | `qa-skills/create-ci-workflow/` | Analyze repo (UI/API/hybrid) → GitHub Actions workflow with IST cron + manual dropdown trigger (branch/env/test-type), downloadable Extent report artifact, and SMTP email |
| `/git-ship` | `qa-skills/git-ship/` | Stage → branch → commit → push with generated Conventional Commits message |
| `/git-ship` | `selenium-skills/git-ship/` | (bundled) Same git-ship — included so the command travels with the Selenium skill pack |
| `/git-ship` | `restassured-skills/git-ship/` | (bundled) Same git-ship — included so the command travels with the REST Assured skill pack |

## Two Skill File Formats

**Format A — subdirectory with SKILL.md + references/** (selenium-skills, qa-skills):
```
skill-name/
├── SKILL.md           ← YAML frontmatter (name, description) + instructions
└── references/
    └── *.md           ← large reference files loaded on demand
```

**Format B — flat .md file with YAML frontmatter** (restassured-skills):
```
skill-name.md          ← YAML frontmatter + full instructions + blueprints inline
```

Use Format A when reference content exceeds ~300 lines or needs to be selectively loaded. Use Format B when all content fits comfortably in one file.

## SKILL.md Frontmatter

Every skill requires at minimum:
```yaml
---
name: skill-name          # slash command trigger (must match directory/file name)
description: ...          # 1–2 sentences; this is what Claude reads to decide whether to invoke the skill
---
```

The `description` field is the primary trigger mechanism. Make it specific about *when* to invoke — not just what the skill does.

## Conventions for Editing Skills

- Generated Java targets: Java 11, Maven, TestNG 7.10.2, REST Assured 5.4.0, Selenium WebDriver 4.x
- Generated TypeScript targets: Playwright with its native test runner
- Selenium skills follow: `DriverFactory → BasePage → Page Objects → BaseTest → Test Classes`
- REST Assured skills follow: `BaseAPI → Endpoints → Models → BaseTest → Test Classes`
- All generated test method names use `{action}_{scenario}_{expectedResult}` format (never `testXxx`)
- `SoftAssert` is mandatory in every `@Test`; always ends with `soft.assertAll()`
- Reference files should each cover one topic, stay under 300 lines, and start with a context header explaining their parent skill

## MCP Integration

The Playwright MCP server is configured in `.vscode/settings.json`. It enables live browser interaction for UI automation tasks via the `playwright` MCP server key.
