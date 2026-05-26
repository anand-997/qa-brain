---
name: create-page-objects
description: Generate complete Selenium Page Object classes from a URL, HTML snippet, or page description. Use when the user wants to create a Page Object, generate POM classes, build locators for a page, handle Shadow DOM or iFrames in a Page Object, generate page components, or create custom page assertions. Trigger whenever someone says "create a page object", "generate POM for", "page object for this page", "generate locators for", "create page class", pastes a URL and asks for automation code, or pastes HTML and asks for a Page Object or locators.
---

Read `references/page-object-prompts-reference.md` to understand all supported Page Object patterns, prompt templates, and locator strategies before responding.

---

## What this skill does

Given input from the user — a URL, HTML snippet, or page description — generate a complete Java Selenium Page Object class that:

- Extends `BasePage`
- Uses `@FindBy` annotations with `PageFactory.initElements()`
- Applies locator priority: `id > name > css > xpath`
- Includes action methods (click, type, select, etc.) and assertion helpers (`isDisplayed`, `getText`, etc.)
- Handles explicit waits via `WaitHelper` where appropriate
- Follows the project's package and naming conventions

---

## Input formats — what to accept

| Input type | How to handle |
|---|---|
| URL | Use page context / describe what's visible; generate locators for all interactive elements |
| HTML snippet | Parse attributes to derive the best locator for each element |
| Page description (text) | Generate best-effort Page Object with `// TODO: verify locator` on each `@FindBy` |

Ask for clarification if the input is ambiguous or incomplete.

---

## Patterns — select before generating

Check which pattern the user needs (all patterns are in the reference file):

| Scenario | Pattern |
|---|---|
| Standard page | Basic Page Object from URL or HTML |
| Dynamic elements that load after interaction | Wait strategy — use `WaitHelper.waitForVisibility()` |
| Page with iFrames | iFrame Page Object pattern |
| Page with Shadow DOM | Shadow DOM pattern using `JavascriptExecutor` |
| Complex tables or dynamic dropdowns | Dynamic element handler methods |
| Reusable UI component (header, nav bar, sidebar) | Page Component pattern |
| Page Object + test data combined | Data-Driven Page Object |

The reference file has a ready-to-use prompt template for each pattern. Apply the matching template, substituting the user's actual page details.

---

## Questions to ask before generating

1. Is this for an existing framework? If yes, what is the base package? (e.g. `com.acme.ui.automation`)
2. Which input are you providing — URL, HTML, or a page description?
3. Any special elements to handle: iFrame, Shadow DOM, dynamically loaded content?
4. Should action methods return `void` or chain to a next page (e.g. `login()` returns `DashboardPage`)?

---

## Output format

Generate **one complete Java class**:

```java
package com.company.ui.automation.pages;

import ...;

public class {PageName}Page extends BasePage {

    // @FindBy declarations

    public {PageName}Page(WebDriver driver) {
        super(driver);
        PageFactory.initElements(driver, this);
    }

    // Action methods

    // Assertion / getter methods
}
```

Follow with a brief **"Locator Notes"** section explaining any `By.xpath()` choices (only when `id`/`name`/`css` were not viable).
