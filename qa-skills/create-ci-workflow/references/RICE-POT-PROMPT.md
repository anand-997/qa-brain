# RICE-POT Prompt — Scheduled + Manual CI Workflow with Emailed Extent Report

> Context: This is the copy-paste prompt bundled with the `/create-ci-workflow` skill
> (qa-skills/create-ci-workflow/). Paste everything inside the fenced block below into your
> AI tool, or run the skill. The prompt makes the AI **analyze the repo first**, detect
> whether it is UI / API / hybrid, **ask clarifying questions**, then generate a GitHub
> Actions workflow that runs on an India IST schedule + a manual "Run workflow" form
> (branch, environment, test type), publishes a downloadable Extent report artifact, and
> emails that report to a configured recipient list.

---

```text
### R — Role
Act as a Senior CI/CD & Test Automation Architect with 15+ years building GitHub Actions
pipelines for Java/Maven/TestNG, Selenium, REST Assured, and Playwright suites. You are
fluent in GitHub Actions workflow syntax, runners, jobs, steps, reusable actions,
workflow_dispatch inputs, matrix strategy, artifacts, secrets, and cron scheduling. You
write production-grade YAML that parses on the first run.

### I — Instructions
Work in this exact order. Do not generate any YAML until Step 1–3 are complete.

1. ANALYZE THE REPOSITORY before asking anything you can answer yourself:
   - Detect the build tool and language: look for pom.xml (Maven), build.gradle (Gradle),
     package.json (Node/Playwright), requirements.txt/pytest.ini (Python).
   - Detect the automation type — classify as UI, API, or HYBRID:
       * UI signals: selenium-java, webdrivermanager, playwright, page object packages,
         "driver", browser config.
       * API signals: rest-assured, restassured, http clients, request/response specs.
   - Detect the test runner (TestNG suite XMLs like testng.xml, JUnit, pytest, Playwright).
   - Detect the reporting library and the exact output path of the report
     (ExtentReports → usually target/, test-output/, or a configured reports/ dir; find the
      .html it produces). If no Extent reporter is wired, say so and offer to add one.
   - Detect existing test groups/tags/suites that map to unit / sanity / e2e.
   - Report a short findings summary: "Detected: <type> | build=<tool> | runner=<runner> |
     report=<path> | suites=<list>".

2. ASK CLARIFYING QUESTIONS — only for what you could NOT determine from the repo. Likely:
   - IST schedule time(s) for the nightly/periodic run (you will convert IST→UTC for cron;
     IST = UTC+5:30, so subtract 5h30m. e.g. 09:00 IST → "30 3 * * *").
   - The recipient email list (or confirm it should be read from a repo variable/secret).
   - Which command runs each test type (unit/sanity/e2e) — Maven profile, -Dgroups,
     testng suite file, or npm script — if not obvious from config.
   - Confirm SMTP secret names to use (default below) and the "from" address.
   - The set of environments and the config file name (default: environments.json).

3. CONFIRM the plan in 3–6 bullet points and proceed once the user agrees.

4. GENERATE the deliverables (see ### O). Hard rules while generating:
   - Manual trigger via workflow_dispatch with THREE inputs rendered as dropdowns using
     `type: choice`:
       (a) branch        — choices populated from the repo's branches if statically known,
                            else a free `type: string` defaulting to the default branch,
       (b) environment   — choices sourced from the repo config file (environments.json);
                            because workflow_dispatch choice lists are static at parse time,
                            generate a small script/step OR a committed enum, and ALSO add a
                            "resolve-env" job that reads environments.json at runtime to load
                            the real per-env config (base URL, etc.) into job outputs,
       (c) test_type     — choices: unit, sanity, e2e (and "all" if the suites support it).
   - Scheduled trigger via `schedule: cron` in UTC, with an inline comment showing the IST
     equivalent. Remember GitHub cron has no timezone field — always convert and comment.
   - A test job that: checks out the SELECTED branch, sets up the detected toolchain
     (e.g. actions/setup-java + cache), runs the command for the SELECTED test_type against
     the resolved environment, and ALWAYS uploads the Extent report
     (`if: always()`) via actions/upload-artifact so it is downloadable from the run.
   - An email step using `dawidd6/action-send-mail` that runs `if: always()`, sends to the
     recipient list, sets a subject with status/branch/env/test_type/run number, and
     ATTACHES the Extent report (zip the report dir if it is multi-file). Pull SMTP host,
     port, username, password from secrets — never inline them.
   - Pin every third-party action to a major version tag (e.g. @v4) and add a one-line
     comment on each action saying what it does.
   - Produce environments.json with a clear schema if it does not already exist.

Do NOT:
- Do NOT hardcode credentials, SMTP passwords, API keys, emails-as-secrets, or tokens in the
  YAML. Use ${{ secrets.* }} / ${{ vars.* }} only.
- Do NOT invent action names, input names, report paths, Maven profiles, or test groups that
  you have not verified in the repo or confirmed with the user.
- Do NOT put IST directly in cron or claim a timezone field exists — GitHub cron is UTC only.
- Do NOT skip the report upload or email steps when tests fail (use if: always()).
- Do NOT assume the stack — detect it. If detection is ambiguous, ask.

### C — Context
- Target platform: GitHub Actions. A workflow is an automated process defined in YAML under
  .github/workflows/, triggered by events; it contains jobs, jobs contain steps, steps run
  shell commands or call reusable actions. Reference: GitHub Actions "Understand GitHub
  Actions" and "Workflow syntax" docs.
- The user's repos in this org follow: Java 11, Maven, TestNG 7.10.2, REST Assured 5.4.0,
  Selenium WebDriver 4.x, and may use Playwright (TS) for some UI work. ExtentReports is the
  expected HTML report. BUT you must still detect, not assume, per project.
- Email transport: SMTP via the marketplace action dawidd6/action-send-mail (free, attaches
  files). Required secrets (default names): SMTP_SERVER, SMTP_PORT, SMTP_USERNAME,
  SMTP_PASSWORD. Recipients may come from a repo variable MAIL_RECIPIENTS or be passed as a
  workflow input — confirm with the user.
- Environment dropdown is "dynamic" via a committed environments.json file that lists envs
  and their config; a resolve-env job reads it so adding an env = editing JSON, not YAML.

### E — Example
Illustrative shapes only — adapt names to the detected project:

    on:
      schedule:
        - cron: "30 3 * * *"   # 09:00 IST nightly (UTC+5:30)
      workflow_dispatch:
        inputs:
          branch:
            description: "Branch to test"
            type: choice
            options: [main, develop]
            default: main
          environment:
            description: "Target environment (from environments.json)"
            type: choice
            options: [dev, qa, staging]
            default: qa
          test_type:
            description: "Test suite to run"
            type: choice
            options: [unit, sanity, e2e, all]
            default: sanity

    # environments.json
    {
      "dev":     { "baseUrl": "https://dev.example.com",     "browser": "chrome" },
      "qa":      { "baseUrl": "https://qa.example.com",      "browser": "chrome" },
      "staging": { "baseUrl": "https://staging.example.com", "browser": "chrome" }
    }

    # email step
    - name: Email Extent report
      if: always()
      uses: dawidd6/action-send-mail@v3   # SMTP email with attachments
      with:
        server_address: ${{ secrets.SMTP_SERVER }}
        server_port: ${{ secrets.SMTP_PORT }}
        username: ${{ secrets.SMTP_USERNAME }}
        password: ${{ secrets.SMTP_PASSWORD }}
        subject: "[${{ job.status }}] ${{ inputs.test_type }} on ${{ inputs.environment }} - run #${{ github.run_number }}"
        to: ${{ vars.MAIL_RECIPIENTS }}
        from: QA Automation <${{ secrets.SMTP_USERNAME }}>
        attachments: extent-report.zip

### P — Parameters
- Output must be deterministic: same repo + same answers → same YAML.
- Every action, input, path, and command must be traceable to a repo finding or a user
  answer. If information is missing or unclear, respond exactly: "Insufficient information to
  determine." and ask, rather than guessing.
- If a detail is inferred, label it exactly: "Inference (low confidence)".
- Do not invent features, action names, secret names, report paths, or test groups.
- All generated YAML must be valid GitHub Actions workflow syntax and parse without error;
  correct indentation (2 spaces), quoted cron strings, and valid `${{ }}` expressions.
- Pin third-party actions to a major tag; comment each action's purpose in one line.

### O — Output
Produce, in this order:
1. A findings summary line (detected type/build/runner/report/suites).
2. Any clarifying questions (only if needed).
3. .github/workflows/automation-tests.yml  — the full workflow (schedule + workflow_dispatch
   with the three dropdowns, resolve-env job, test job, artifact upload, email step).
4. environments.json — only if one does not already exist.
5. A short "Setup checklist" listing the exact secrets/variables the user must add
   (SMTP_SERVER, SMTP_PORT, SMTP_USERNAME, SMTP_PASSWORD, MAIL_RECIPIENTS) and where, plus
   how to trigger the run.
Format: real file contents in fenced code blocks, each preceded by its file path.

### T — Tone
Technical, precise, and architect-level. Explain a decision in one line only when it is
non-obvious (e.g. the IST→UTC conversion or why env is JSON-driven). Otherwise output the
artifacts. No filler.
```

---

## How to convert IST → UTC for the `schedule: cron`

GitHub cron runs in **UTC** and has no timezone field. IST is **UTC + 5:30**, so subtract
5 hours 30 minutes from the desired IST time:

| Desired IST run | UTC time | cron expression |
|---|---|---|
| 09:00 daily | 03:30 | `30 3 * * *` |
| 18:30 daily | 13:00 | `0 13 * * *` |
| 00:00 (midnight IST) | 18:30 prev day | `30 18 * * *` |
| 06:00 Mon–Fri | 00:30 | `30 0 * * 1-5` |

If a time would cross midnight after subtracting 5:30, the date shifts back a day — adjust
the day-of-week field accordingly.
