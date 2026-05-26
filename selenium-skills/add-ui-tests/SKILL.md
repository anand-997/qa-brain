---
name: add-ui-tests
description: Add Selenium UI test cases to an existing framework for a specific feature, workflow, or page. Use when the user wants to write new test methods for a Page Object, implement login tests, form validation tests, table interaction tests, modal tests, drag-and-drop tests, file upload tests, or end-to-end test flows. Trigger whenever someone says "add UI tests", "write tests for this page", "create test class for", "implement test cases", "add Selenium tests for", or describes a UI scenario and asks for a test class.
---

Read `references/ui-test-patterns-reference.md` for complete, copy-paste test class patterns.
Read `references/ui-test-data-strategy-guide.md` for test data handling strategies.

---

## What this skill does

Given a feature, workflow, or Page Object, generate a complete TestNG test class that follows the project's conventions — including test data, a `@DataProvider` for negative/boundary cases, and a TestNG suite XML block to insert into the existing suite.

---

## Framework conventions (apply to all generated code)

**Stack:** Java 11 | Selenium WebDriver 4.x | TestNG | ExtentReports | Log4j2  
**Pattern:** Page Object Model — tests call Page Object methods only; WebDriver is never touched in test classes.

| Rule | Detail |
|---|---|
| Extend `BaseTest` | Always |
| Page Object init | `@BeforeClass` — once per class, not per method |
| Test method naming | `{action}_{scenario}_{expectedResult}` (e.g., `login_validCredentials_navigatesToDashboard`) |
| Assertions | `SoftAssert` in every `@Test`, always end with `soft.assertAll()` |
| Cleanup | `@Override tearDown()` calling `super.tearDown()` |
| Screenshots on failure | `ScreenshotUtil.captureScreenshot()` in `@AfterMethod` |
| Data sources | `ConfigManager.get("key")` for URLs/credentials — never hardcode |
| Dynamic test data | Faker-style generator (`RandomDataGenerator`) for names, emails |

---

## Steps

**Step 1 — Understand the input**

Ask (or infer from context):
1. What feature or page are you writing tests for?
2. Which Page Object class handles this page? (e.g. `LoginPage`, `CheckoutPage`)
3. What test scenarios are needed? (positive, negative, boundary)
4. Does any existing test data file (`testdata/*.json`) already cover this feature?

**Step 2 — Select a pattern from the reference**

Match the feature to the relevant pattern in `references/ui-test-patterns-reference.md`:

| Feature | Pattern section |
|---|---|
| Login / authentication | Login & Authentication Tests |
| Form fields, validation messages | Form Validation Tests |
| Page navigation, breadcrumbs | Navigation Tests |
| Tables, pagination, sorting | Table/Grid Interaction Tests |
| Modals, dialogs, popups | Modal/Dialog Handling |
| Drag-and-drop | Drag-and-Drop Tests |
| File upload or download | File Upload/Download Tests |
| Mobile/responsive checks | Responsive Testing Patterns |
| Cross-browser runs | Cross-Browser Testing Patterns |
| Multi-step user journey | E2E Testing Patterns |

Apply the matching pattern as the base; adapt it to the user's specific page and scenarios.

**Step 3 — Choose a test data strategy**

Check `references/ui-test-data-strategy-guide.md` for the appropriate approach:

| Situation | Strategy |
|---|---|
| Static credentials / URLs | `config.properties` + `ConfigManager.get()` |
| Simple negative/boundary inputs | `@DataProvider` with inline `Object[][]` |
| Complex test objects (multiple fields) | JSON file in `src/test/resources/testdata/` |
| Dynamic unique values (emails, names) | `RandomDataGenerator` methods |

**Step 4 — Generate output**

---

## Output format

### 1. Test class — `src/test/java/…/tests/{module}/{Feature}Test.java`

Full class including:
- `@BeforeClass` with Page Object instantiation
- Positive `@Test` methods (smoke + regression groups)
- Negative `@Test` with `@DataProvider` (regression group)
- `@DataProvider` rows: at minimum include empty, null, whitespace, oversized, and one XSS/SQLi input
- `@Override tearDown()` + `super.tearDown()`

### 2. Test data (if `@DataProvider` alone is insufficient)
- JSON file or Faker-based inline data
- Never use real credentials, real names, or production URLs

### 3. Suite XML block
```xml
<!-- Add inside: src/test/resources/testng.xml or {module}-suite.xml -->
<test name="{Feature} Tests">
  <classes>
    <class name="com.company.ui.automation.tests.{module}.{Feature}Test"/>
  </classes>
</test>
```

### 4. Test Coverage Summary
`Total: X | Positive: X | Negative: X | Data-Driven rows: X`

---

## Do NOT generate

- DriverFactory, BasePage, BaseTest, ConfigManager, WaitHelper, ScreenshotUtil — these already exist.
- `Thread.sleep()` — use `WaitHelper` explicit waits.
- Hardcoded environment URLs — use `ConfigManager.get()`.
- A new `@AfterMethod cleanup()` — use `@Override tearDown()`.
