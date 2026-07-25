---
name: research
description: >
  Conduct comprehensive research and analysis of any web page, screen, application module,
  or UI feature. Produces a structured markdown document covering structural, functional,
  content, technical, business, and UX analysis. Use this skill whenever the user says
  "research", "analyze page", "analyze website", "conduct research", "page analysis",
  "analyze this screen", "analyze this module", "website research", or shares a URL and
  asks what a page does, how it works, or wants documentation of its features — even if
  they don't use the word "research". Auto-detects the right analysis mode (standard,
  deep-dive, QA-focused, UX-focused, comparative, technical specs, user manual) from
  context. Saves results to a dated markdown file. Invoke proactively whenever a user
  shares a URL and wants it understood, documented, or analyzed.
---

# Research & Analysis Skill

Conducts live research on any web page or UI screen and produces a comprehensive,
structured markdown document. The skill browses the target using available tools,
systematically explores all sections and features, and auto-saves the findings.

## How This Skill Works

Four phases: **Clarify → Mode Selection → Research → Document & Save**

If the user already provided a URL and enough context, skip straight to Mode Selection
and confirm the detected mode before starting research. The goal is to minimize friction
while still being precise about what you'll produce.

---

## Phase 1: Clarify

Ask in one message. Tell the user that items marked *(optional)* can be skipped.

```
Before I start researching, a few quick details:

1. **Target URL** — Paste the URL of the page/screen to analyze.
   (If it's a logged-in screen you can describe it instead.)

2. **Page name** — What should I call this page? Used for the output filename.
   e.g., "MO Advice", "Checkout", "User Dashboard"

3. **Analysis type** — I'll auto-detect from context, but you can specify:
   - Standard (default) — comprehensive all-around analysis
   - Deep Dive — exhaustive, every element documented
   - QA Testing Focus — structured for test case creation
   - UX Focus — usability, journeys, friction points
   - Comparative — vs. one or more competitors
   - Technical Specs — architecture/integration docs for dev teams
   - User Manual — user-facing help documentation

4. **Output folder** *(optional)* — Where to save the file.
   Defaults to the current working directory.

5. **Specific focus areas** *(optional)* — Anything to emphasize.
   e.g., "subscription model", "data visualization", "mobile behavior"
```

---

## Phase 2: Mode Selection

Detect the mode from the user's language if they didn't specify one. Show the detected
mode and let them confirm or redirect before you start — this takes two seconds and
prevents wasted effort.

### Auto-Detection Rules

| Signal in User's Language | Mode |
|---|---|
| "test cases", "QA", "testing", "validate", "testable" | QA Testing Focus |
| "exhaustive", "everything", "pixel-by-pixel", "extreme detail", "every element" | Deep Dive |
| "vs", "compare", "compared to", "competitor", "better than", "similar to" | Comparative |
| "UX", "usability", "user experience", "journey", "friction", "cognitive load" | UX Focus |
| "developers", "technical specs", "architecture", "API", "integration", "schema" | Technical Specs |
| "user manual", "help docs", "documentation", "guide", "tutorials", "how to use" | User Manual |
| (none of the above) | Standard Comprehensive |

Confirm like this:
```
I'll run a **[Mode]** analysis on [Page Name] ([URL]).
Focus areas: [any from Q5, or "all sections"].
Output: [PageName]_Research_Analysis_[date].md → [folder]

Starting now — let me know if you want to change anything.
```

### Tool Selection

Use the best available tool for live exploration:
- **Playwright MCP** (server key: `playwright`) — preferred for interactive exploration.
  Use it to navigate, click, scroll, take screenshots, test responsive breakpoints.
  Check if it's available before assuming.
- **WebFetch** — use for fetching page content when Playwright is unavailable.
- **WebSearch** — supplement with search for public documentation, competitor info,
  or features not visible in a single page load.

---

## Phase 3: Research Execution

Follow the 6-step methodology in `references/methodology.md`. Read it before starting
any research task — it contains the systematic exploration checklist.

For **Comparative mode**: research each URL separately, then synthesize findings.
For **QA Testing Focus**: structure exploration to surface testable elements, validation
rules, error states, and boundary conditions.
For **Deep Dive**: document every interactive element — buttons, dropdowns, tooltips,
loading states, error states, empty states, responsive behavior.

For all modes, cover these six analysis dimensions:
1. **Structural** — main sections, sub-navigation, page hierarchy, content layout
2. **Functional** — core features, interactions, search/filter, CTAs, forms
3. **Content** — data types displayed, real-time vs. static, media types
4. **Technical** — integration points, API hints, mobile responsiveness, performance
5. **Business** — monetization model, access tiers, value propositions, target personas
6. **UX** — user journey mapping, pain points, personalization, accessibility

---

## Phase 4: Document & Save

### Output Structure

Produce all 10 sections. For each section, be exhaustive — document what you observed,
not what you assume. Note locked/premium content. Use tables for comparative data.

```markdown
---
Title: [Page Name] Research Analysis
Date: [YYYY-MM-DD]
Source: [URL]
Analysis Mode: [Mode]
Version: 1.0
---

## 1. Executive Summary
- Brief overview (3-5 sentences)
- Primary purpose and objectives
- Key highlights and notable observations

## 2. Main Sections Breakdown
[Hierarchical: section → subsection → features → data points]

## 3. Feature Inventory
[Table: Feature | Category | Description | User Permissions | Use Cases]

## 4. User Workflows
### Primary Workflows
[Step-by-step flows for the 2-3 most important journeys]
### Secondary Workflows
[Other user paths]
### Edge Cases
[Error paths, boundary scenarios, unusual flows]

## 5. UI/UX Documentation
- Navigation structure
- Visual hierarchy and color coding
- Interactive components (modals, dropdowns, tooltips)
- Loading, empty, and error states

## 6. Integration & Ecosystem
- Connected pages and modules
- Data flow diagram (text-based)
- Cross-references and dependencies

## 7. Technical Specifications
- Platform and tech stack indicators
- Data update frequencies (real-time vs. periodic)
- Responsive breakpoints observed
- Performance observations

## 8. Access & Monetization
- Free features
- Premium/locked features
- Subscription tiers (if applicable)

## 9. Key Metrics & Statistics
[Quantitative data visible on the page: counts, percentages, rates]

## 10. Appendix
- Observations and assumptions
- Limitations of this analysis
- Reference links
- Suggested next steps
```

### Auto-Save

Save the document immediately after generation using this naming convention:
```
[PageName]_Research_Analysis_[YYYY-MM-DD].md
```

Then confirm:
```
✓ Saved: [full file path]
✓ Sections: all 10
✓ [N] features documented
✓ Analysis mode: [Mode]
```

---

## Follow-up Options

After delivery, always offer:

```
What would you like next?
1. Deep dive into a specific section (which one?)
2. Generate test cases from this analysis → use /generate-test-cases
3. Comparative analysis vs. a competitor
4. Create a TRD from these findings → use /generate-trd
5. Re-run with a different analysis mode
```

---

## Reference Files

| File | Purpose | When to Load |
|---|---|---|
| `references/methodology.md` | 6-step research process, quality checklist, naming conventions | Always — read before starting research |
| `references/analysis-frameworks.md` | SWOT, Jobs-to-be-Done, Nielsen's Heuristics, analysis mode guidance | For Deep Dive, UX Focus, or when user requests a specific framework |
| `references/prompt-templates.md` | Mode-specific templates: QA Test Plan, Technical Specs, User Manual, Comparative, Quick | Load the section matching the detected mode |
