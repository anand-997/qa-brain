<!--
📌 File: analysis-frameworks.md
🎯 Purpose: Analysis frameworks (SWOT, JTBD, Heuristic) and mode guidance
⚠️ Usage: Load for Deep Dive, UX Focus, or when user requests a specific framework
-->

# Analysis Frameworks

## Table of Contents
1. [Analysis Mode Guidance](#1-analysis-mode-guidance)
2. [SWOT Analysis Framework](#2-swot-analysis-framework)
3. [Jobs-to-be-Done (JTBD)](#3-jobs-to-be-done-jtbd)
4. [Nielsen's 10 Heuristics](#4-nielsens-10-heuristics)
5. [Additional Context Frameworks](#5-additional-context-frameworks)

---

## 1. Analysis Mode Guidance

### Standard Comprehensive
- Default when no mode specified
- Cover all 10 output sections at moderate depth
- Balance breadth and detail — document the "what" for every section
- Aim for: "someone who's never seen this page could understand it fully"

### Deep Dive
- Maximum detail — document every visible element
- For each section, cover: all states (default/hover/active/disabled/error/loading/empty),
  all interactive elements (buttons/links/dropdowns/forms), responsive differences
- Document as if writing technical specifications for a development team
- Aim for: "a developer could rebuild this page from your documentation"

### QA Testing Focus
- Structure exploration around testable scenarios
- For every feature, identify: happy path, negative path, boundary conditions, error states
- Document: all form validations (required fields, format rules, length limits)
- Highlight: integration dependencies, race conditions, permission boundaries
- Output Section 3 (Feature Inventory) should map directly to test case IDs
- Aim for: "a QA engineer could write test cases from this without visiting the page"

### UX Focus
- Center on user journeys and experience quality
- Apply Nielsen's 10 Heuristics (§4) to each major interaction
- Map: user goals → steps → friction points → outcomes
- Document: cognitive load, visual hierarchy, CTA clarity, error recovery
- Aim for: "a UX designer could identify and prioritize improvements from this"

### Comparative
- Research each URL independently using the Standard mode
- Then synthesize with side-by-side comparison tables
- Highlight: feature gaps, UX pattern differences, unique capabilities
- Note: which product does each dimension better and why
- Aim for: "a product manager could make competitive positioning decisions from this"

### Technical Specs
- Focus on Sections 6 (Integration) and 7 (Technical Specifications)
- Document: API endpoints visible in network requests, data models inferred from UI,
  integration points, authentication patterns, data update frequencies
- Format as technical documentation readable by backend/frontend developers
- Aim for: "a developer could understand integration requirements without a separate briefing"

### User Manual
- Focus on Sections 3 (Feature Inventory) and 4 (User Workflows)
- Write in plain, non-technical language for end users
- Structure as: Getting Started → Feature Tutorials → FAQ → Troubleshooting
- For each feature: what it does, how to use it, what to expect, what can go wrong
- Aim for: "a new user could learn the platform from this document"

---

## 2. SWOT Analysis Framework

Include when user requests competitive context or product evaluation.

### Template

```markdown
## SWOT Analysis: [Page/Product Name]

### Strengths (What it does well)
- [Unique capability or feature]
- [UX advantage over competitors]
- [User satisfaction driver]

### Weaknesses (What's missing or broken)
- [Missing feature or gap]
- [Usability issue or friction point]
- [Performance problem]

### Opportunities (What could be improved)
- [Feature gap to fill]
- [UX enhancement opportunity]
- [Market gap this page doesn't address]

### Threats (External risks)
- [Competitor advantage]
- [Technology change making this obsolete]
- [User expectation shift]
```

---

## 3. Jobs-to-be-Done (JTBD)

Use when analyzing why users come to this page and what they're trying to accomplish.

### Template

```markdown
## Jobs-to-be-Done Analysis: [Page Name]

### Functional Jobs (Tasks users need to accomplish)
| Job | Current Execution | Quality |
|-----|-------------------|---------|
| [Task the page helps with] | [How the page enables it] | Good/Fair/Poor |

### Emotional Jobs (How users want to feel)
- Users want to feel: [confident/in-control/informed/safe/etc.]
- Current experience delivers: [assessment]
- Gap: [what's missing emotionally]

### Social Jobs (How users want to be perceived)
- [How using this product affects user's image or status]
- [Social sharing or visibility features]
```

---

## 4. Nielsen's 10 Heuristics

Apply for UX Focus mode or when evaluating usability. Rate each heuristic:
✅ Good | ⚠️ Fair | ❌ Poor | — N/A

```markdown
## Heuristic Evaluation: [Page Name]

| # | Heuristic | Rating | Observation |
|---|-----------|--------|-------------|
| 1 | Visibility of system status | ✅/⚠️/❌ | [Does the page show what's happening? Loading states, progress, feedback] |
| 2 | Match between system and real world | ✅/⚠️/❌ | [Does it use language users know? Familiar metaphors?] |
| 3 | User control and freedom | ✅/⚠️/❌ | [Can users undo actions? Cancel operations? Go back?] |
| 4 | Consistency and standards | ✅/⚠️/❌ | [Are patterns consistent across the page? Follows platform norms?] |
| 5 | Error prevention | ✅/⚠️/❌ | [Does the design prevent errors before they happen?] |
| 6 | Recognition rather than recall | ✅/⚠️/❌ | [Are options visible? Does user have to memorize anything?] |
| 7 | Flexibility and efficiency of use | ✅/⚠️/❌ | [Are there shortcuts for expert users? Customization?] |
| 8 | Aesthetic and minimalist design | ✅/⚠️/❌ | [Is information density appropriate? Any visual clutter?] |
| 9 | Help users recognize and recover from errors | ✅/⚠️/❌ | [Are error messages clear and actionable?] |
| 10 | Help and documentation | ✅/⚠️/❌ | [Is help available? Is it findable and useful?] |

**Overall UX Score**: [X/10 heuristics passing]
**Top 3 Issues**: [Most critical findings]
**Quick Wins**: [Easy improvements with high impact]
```

---

## 5. Additional Context Frameworks

### Business Model Canvas (for monetization-heavy pages)

```markdown
## Business Model: [Page/Product]

| Dimension | Observation |
|-----------|-------------|
| Value Proposition | [Core benefit offered] |
| Customer Segments | [Who this page targets] |
| Revenue Streams | [How it monetizes: subscription/freemium/ads/transaction] |
| Key Features | [Features that drive the value proposition] |
| Barriers to Entry | [What makes users stay / switch cost] |
```

### Accessibility Quick Check

```markdown
## Accessibility Observations

| Check | Status | Notes |
|-------|--------|-------|
| Keyboard navigation | ✅/⚠️/❌ | [Tab order, focus indicators] |
| Screen reader labels | ✅/⚠️/❌ | [ARIA labels, alt text] |
| Color contrast | ✅/⚠️/❌ | [Text vs. background, WCAG 4.5:1 ratio] |
| Touch targets | ✅/⚠️/❌ | [Min 44×44px for mobile] |
| Form field labels | ✅/⚠️/❌ | [Visible labels, not just placeholders] |
| Error identification | ✅/⚠️/❌ | [Errors not communicated by color alone] |
```

---

📌 **Last Updated**: December 2025 | **Version**: 1.0
