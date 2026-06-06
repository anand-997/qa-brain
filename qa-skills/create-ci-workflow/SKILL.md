---
name: create-ci-workflow
description: >
  Generate a GitHub Actions CI workflow for an automation test repo. Use this skill whenever
  the user wants a ".github/workflows" pipeline, a "GitHub Actions workflow/yml", a
  "scheduled test run", an "IST/nightly cron", a manual "Run workflow" form with dropdowns
  (branch, environment, test type like unit/sanity/e2e), a downloadable Extent/HTML report
  artifact, or an emailed test report. The skill first ANALYZES the repo to detect whether it
  is UI / API / hybrid (Selenium, REST Assured, Playwright, Maven/Gradle/Node), asks
  clarifying questions, then generates a workflow that runs on an India IST schedule + manual
  trigger, publishes the report as a downloadable artifact, and emails it via SMTP. Invoke
  proactively when a user describes CI scheduling, manual test triggering, or emailing a
  report — do not wait for a special phrase.
---

# Create CI Workflow

Generates a production-grade GitHub Actions workflow for a test-automation repository. The
workflow supports **two triggers** — an India IST schedule (cron) and a **manual "Run
workflow"** form with three dropdowns (branch, environment, test type) — runs the selected
suite, publishes a **downloadable Extent report artifact**, and **emails the report** to a
configured recipient list over SMTP.

This skill is built on the **RICE-POT** prompt framework
([RICE_POT_FRAMEWORK.md](../RICE_POT_FRAMEWORK.md)). The full, self-contained,
copy-pasteable prompt lives in [references/RICE-POT-PROMPT.md](references/RICE-POT-PROMPT.md).

## How This Skill Works

Three phases: **Analyze → Clarify → Generate.** Never generate YAML before the first two.

### 1. Analyze the repository (do this yourself before asking anything)
Detect, and report in one summary line, the following:
- **Build tool / language** — `pom.xml` (Maven), `build.gradle` (Gradle), `package.json`
  (Node/Playwright), `requirements.txt`/`pytest.ini` (Python).
- **Automation type — UI / API / HYBRID:** UI = selenium-java, webdrivermanager, playwright,
  page-object packages; API = rest-assured/restassured, request/response specs.
- **Test runner** — TestNG (`testng.xml` suites), JUnit, pytest, Playwright runner.
- **Report library + exact output path** — ExtentReports HTML under `target/`, `test-output/`,
  or a configured `reports/` dir. If no Extent reporter is wired, say so and offer to add one.
- **Test groups/tags/suites** that map to **unit / sanity / e2e**.

Emit: `Detected: <type> | build=<tool> | runner=<runner> | report=<path> | suites=<list>`.

### 2. Clarify (only what the repo could not answer)
Typical gaps: the **IST schedule time** (convert IST→UTC for cron — see table below), the
**recipient email list**, the exact **command per test type**, the **SMTP secret names**, and
the **environment list / config file name** (default `environments.json`). Ask concisely,
then confirm a 3–6 bullet plan and proceed on approval.

### 3. Generate the artifacts
1. `.github/workflows/automation-tests.yml` — the full workflow:
   - `workflow_dispatch` with three **`type: choice`** dropdowns: **branch**, **environment**
     (sourced from `environments.json`), **test_type** (`unit` / `sanity` / `e2e` / `all`).
   - `schedule: cron` in **UTC** with an inline comment showing the IST equivalent.
   - A **resolve-env** job that reads `environments.json` at runtime into job outputs (because
     `workflow_dispatch` choice lists are static at parse time).
   - A **test job**: checkout selected branch → set up detected toolchain (with cache) → run
     the selected suite against the resolved environment.
   - **`actions/upload-artifact`** with `if: always()` so the Extent report is downloadable.
   - **`dawidd6/action-send-mail`** with `if: always()` that emails the report (zip if
     multi-file), subject carrying status/branch/env/test_type/run number, SMTP creds from
     secrets.
2. `environments.json` — only if one does not already exist.
3. A **Setup checklist** of the exact secrets/variables to add (`SMTP_SERVER`, `SMTP_PORT`,
   `SMTP_USERNAME`, `SMTP_PASSWORD`, `MAIL_RECIPIENTS`) and how to trigger a run.

## Hard Rules
- Never hardcode credentials, SMTP passwords, tokens, or emails-as-secrets in YAML — use
  `${{ secrets.* }}` / `${{ vars.* }}` only.
- Never invent action names, input names, report paths, Maven profiles, or test groups not
  verified in the repo or confirmed by the user. If unknown, say
  **"Insufficient information to determine."** and ask. Label guesses
  **"Inference (low confidence)"**.
- Never put IST directly in cron — GitHub cron is UTC only and has no timezone field.
- Never skip the report upload or email steps on failure — use `if: always()`.
- Pin every third-party action to a major tag (`@v4`) and add a one-line purpose comment.
- Detect the stack; do not assume it.

## IST → UTC cron conversion (cron has no timezone — always convert)

IST = UTC + 5:30, so subtract 5h30m from the desired IST time:

| Desired IST run | UTC | cron |
|---|---|---|
| 09:00 daily | 03:30 | `30 3 * * *` |
| 18:30 daily | 13:00 | `0 13 * * *` |
| 00:00 (midnight IST) | 18:30 prev day | `30 18 * * *` |
| 06:00 Mon–Fri | 00:30 | `30 0 * * 1-5` |

If subtracting 5:30 crosses midnight, the run date shifts back one day — adjust the
day-of-week field.

## Reference
- [references/RICE-POT-PROMPT.md](references/RICE-POT-PROMPT.md) — the complete RICE-POT
  prompt to paste into any AI tool (the standalone deliverable).
- GitHub Actions: "Understand GitHub Actions" and "Workflow syntax for GitHub Actions" docs.
