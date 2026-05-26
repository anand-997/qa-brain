<!--
📌 File: methodology.md
🎯 Purpose: 6-step research methodology, quality checklist, naming conventions
⚠️ Usage: Always load before starting a research task
-->

# Research Methodology

## Table of Contents
1. [6-Step Research Process](#1-6-step-research-process)
2. [Quality Checklist](#2-quality-checklist)
3. [File Naming Convention](#3-file-naming-convention)
4. [Documentation Formatting](#4-documentation-formatting)
5. [Common Pitfalls](#5-common-pitfalls)

---

## 1. 6-Step Research Process

### Step 1: Initial Reconnaissance
1. Visit the target URL
2. Identify main sections at first glance
3. Note immediate impressions and primary purpose
4. Test basic navigation (header, footer, main menu)
5. Capture the overall page structure
6. Note any login/access restrictions

### Step 2: Systematic Exploration (Top-to-Bottom, Left-to-Right)
1. Document every section in order of appearance
2. Click every clickable element (tabs, accordions, dropdowns)
3. Test every menu and sub-menu
4. Fill forms and observe validation messages
5. Test search functionality (what it searches, filters available, empty results)
6. Try different user paths and navigation flows
7. Note any A/B variants or personalization

### Step 3: Deep Inspection
1. Test all interactive states: hover, active, disabled, loading, error, empty
2. Check responsive behavior at mobile (375px), tablet (768px), desktop (1280px)
3. Verify accessibility features (keyboard nav, focus indicators, labels)
4. Note real-time data vs. static content
5. Document error handling and validation messages
6. Identify premium/locked content (mark clearly)
7. Note performance: loading indicators, skeleton screens, lazy loading

### Step 4: Cross-Reference Analysis
1. Follow integration links to related pages/modules
2. Map cross-page data flows (e.g., cart → checkout → confirmation)
3. Test cross-module workflows end-to-end
4. Identify shared components (headers, footers, sidebars)
5. Note where data originates (APIs, databases, third-party services)

### Step 5: Business & UX Layer
1. Identify the target user personas for this page
2. Map the primary user journey (goal → steps → outcome)
3. Note CTAs and conversion funnels
4. Document monetization model and access tiers
5. Identify friction points and confusion areas
6. Note value propositions and trust signals

### Step 6: Document & Save
1. Organize findings into the 10-section output structure
2. Use hierarchical numbering (1, 1.1, 1.1.1)
3. Add tables for comparative data
4. Include sample data values where visible
5. Note all assumptions and limitations
6. Save with standardized filename (see §3)

---

## 2. Quality Checklist

Use before finalizing the research document:

```
COMPLETENESS
□ All visible sections documented
□ All features inventoried (not just the obvious ones)
□ Key workflows mapped (primary + secondary + error paths)
□ Integration points identified
□ Access tiers documented (free vs. premium)
□ Technical details captured where observable
□ Sample data included (real values, not placeholders)
□ Visual elements described (color coding, icons, states)
□ User personas considered
□ Business model understood

QUALITY
□ Consistent terminology throughout
□ Proper markdown formatting
□ Tables used for comparative/structured data
□ No vague language ("some features", "various options")
□ Specific feature names used (not "a button")
□ Error states and edge cases documented
□ Observations clearly separated from assumptions
□ Proofreading completed
□ Stakeholder-ready formatting

COVERAGE (per analysis mode)
Standard:    All 10 sections, moderate detail
Deep Dive:   All 10 sections + every interactive element + all states
QA Focus:    Sections 2-5 with test-oriented lens + validation rules
UX Focus:    Sections 4-5 with journey maps + heuristic evaluation
Comparative: Sections 1-5 per site + side-by-side comparison tables
Tech Specs:  Sections 6-7 in detail + integration architecture
User Manual: Sections 3-4 in tutorial format + FAQs
```

---

## 3. File Naming Convention

### Standard Format
```
[PageName]_Research_Analysis_[YYYY-MM-DD].md
```

### Rules
- Use underscores, not spaces
- CamelCase for page names
- ISO date format (YYYY-MM-DD)
- Keep page name under 30 characters
- No special characters (!@#$%^&*)

### Examples
```
✅ MO_Advice_Research_Analysis_2025-12-05.md
✅ GitHub_Homepage_Research_Analysis_2025-12-10.md
✅ Figma_Login_Research_Analysis_2025-12-10.md
✅ Amazon_Checkout_Research_Analysis_2025-12-10.md

❌ analysis.md                    (too generic)
❌ research 2025.md               (spaces)
❌ MO Advice Analysis Final.md    (spaces + no date)
```

### Mode-Specific Variants
```
Deep Dive:      [PageName]_Deep_Analysis_[YYYY-MM-DD].md
Comparative:    [PageA]_vs_[PageB]_Comparison_[YYYY-MM-DD].md
QA Focus:       [PageName]_QA_Analysis_[YYYY-MM-DD].md
Tech Specs:     [PageName]_Technical_Specs_[YYYY-MM-DD].md
User Manual:    [PageName]_User_Manual_[YYYY-MM-DD].md
Quick:          [PageName]_Quick_Analysis_[YYYY-MM-DD].md
```

---

## 4. Documentation Formatting

### Markdown Conventions
- `# H1` — Document title only (once)
- `## H2` — Major sections (Executive Summary, Feature Inventory, etc.)
- `### H3` — Subsections within a section
- `#### H4` — Granular features or specific items
- **Bold** — Emphasis, labels, feature names
- *Italic* — UI element names, page names
- `` `Code` `` — Technical terms, field names, URLs, error messages
- `>` Blockquotes — Important notes, warnings, observations
- Tables — Comparative data, feature matrices, attribute lists
- Bullet points — Feature lists, observations
- Numbered lists — Sequential steps, workflows

### Table Pattern (Feature Inventory)
```markdown
| Feature | Category | Description | Access | Notes |
|---------|----------|-------------|--------|-------|
| Search bar | Navigation | Searches by keyword across all content | Free | Auto-suggests results |
```

### Workflow Pattern
```markdown
### Primary Workflow: [Name]
1. User arrives at [entry point]
2. [Action] → [Result]
3. [Action] → [Result]
4. Outcome: [Final state]

**Edge case**: If [condition] → [behavior]
```

---

## 5. Common Pitfalls

```
❌ Being too vague ("there are some filters")
   → Specify each filter: "5 filters: Category, Date, Status, Price Range, Tags"

❌ Not documenting error states
   → Always test: empty form submit, invalid input, network failure

❌ Missing premium/locked content
   → Note it clearly: "[PREMIUM] Feature X requires Pro subscription"

❌ Forgetting mobile behavior
   → Always check: responsive layout, touch targets, hamburger menu

❌ Not considering different user roles
   → Ask: does this page look different for admin vs. regular user?

❌ Assuming features from design
   → Only document what is observable; mark assumptions as "[Assumed]"

❌ Missing integration points
   → Always ask: where does clicking this go? What data feeds this?

❌ Generic feature names
   → "Add to Watchlist button (star icon, top-right of each card)" not "a button"
```

---

📌 **Last Updated**: December 2025 | **Version**: 1.0
