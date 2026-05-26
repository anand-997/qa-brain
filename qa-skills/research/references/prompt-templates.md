<!--
📌 File: prompt-templates.md
🎯 Purpose: Mode-specific prompt templates and analysis variations
⚠️ Usage: Load the section matching the detected analysis mode
-->

# Prompt Templates by Mode

## Table of Contents
- [Template 1: Quick Analysis](#template-1-quick-analysis)
- [Template 2: Standard Comprehensive](#template-2-standard-comprehensive-default)
- [Template 3: Technical Specifications](#template-3-technical-specifications)
- [Template 4: User Manual](#template-4-user-manual)
- [Template 5: QA Test Plan](#template-5-qa-test-plan)
- [Variation A: Deep Dive](#variation-a-deep-dive)
- [Variation B: Comparative Analysis](#variation-b-comparative-analysis)
- [Variation C: QA Testing Focus](#variation-c-qa-testing-focus)
- [Variation D: UX Focus](#variation-d-ux-focus)
- [Iteration Patterns](#iteration-patterns)

---

## Template 1: Quick Analysis

Use when: user wants a fast overview, limited time, or a first-pass before deeper analysis.

**Deliverable**: Under 2 pages, focused on the most important aspects.

**Output structure:**
```markdown
# [Page Name] — Quick Analysis
Date: [YYYY-MM-DD] | Source: [URL]

## 1. What This Page Does
[2-3 sentences: purpose, primary audience, key function]

## 2. Main Sections (Top 5-8)
| Section | Purpose | Key Features |
|---------|---------|--------------|

## 3. Top 10 Features
[Numbered list: feature name + one-sentence description]

## 4. Primary User Workflow
[5-7 steps: the most important thing a user does on this page]

## 5. Key Observations
- [Notable strength]
- [Notable gap or friction]
- [Anything surprising or worth highlighting]
```

---

## Template 2: Standard Comprehensive (Default)

Use when: no specific mode requested, or user wants a complete picture.

**Deliverable**: Full 10-section document (~5-15 pages depending on page complexity).

Use the base 10-section output structure defined in SKILL.md. No additional modifications needed.

**Depth guidance per section:**
- Section 1 (Executive Summary): 1 page max
- Section 2 (Sections Breakdown): the most detailed section — document every subsection
- Section 3 (Feature Inventory): table format preferred, one row per feature
- Section 4 (Workflows): 2-3 primary workflows with numbered steps
- Sections 5-10: moderate detail, capture what's observable

---

## Template 3: Technical Specifications

Use when: user mentions "developers", "dev team", "architecture", "API", "integration", "specs".

**Deliverable**: Technical document for developers and architects.

**Output structure:**
```markdown
# [Page Name] — Technical Specifications
Date: [YYYY-MM-DD] | Source: [URL] | Version: 1.0

## 1. System Overview
- Platform: [Web/Mobile/Desktop]
- Technology indicators: [React/Angular/Vue/etc. if observable]
- Hosting/CDN indicators: [if observable]

## 2. Architecture Overview
[Text-based diagram of page components and their relationships]

## 3. Data Architecture
| Data Entity | Source | Update Frequency | Display Format |
|-------------|--------|-----------------|----------------|

## 4. API Endpoints (Observable)
| Endpoint Pattern | Method | Purpose | Response Format |
|-----------------|--------|---------|-----------------|

## 5. Integration Points
| System | Type | Purpose | Direction |
|--------|------|---------|-----------|

## 6. Authentication & Authorization
- Auth mechanism observed: [JWT/Session/OAuth/etc.]
- Permission levels: [Admin/User/Guest/etc.]
- Gating mechanism: [How premium features are locked]

## 7. Performance Characteristics
- Load strategy: [SSR/CSR/SSG/lazy loading]
- Data refresh: [Real-time/polling/on-demand]
- Caching indicators: [if observable]

## 8. Responsive / Platform Behavior
| Breakpoint | Layout Change | Notable Differences |
|-----------|--------------|---------------------|

## 9. Error Handling
| Scenario | Behavior | Error Message |
|---------|---------|--------------|

## 10. Testing Requirements
[Key integration test points derived from the architecture]
```

---

## Template 4: User Manual

Use when: user mentions "user manual", "help documentation", "how to use", "user guide", "tutorials".

**Deliverable**: User-facing documentation in plain language.

**Output structure:**
```markdown
# [Page Name] — User Guide
Last Updated: [YYYY-MM-DD]

## Getting Started
[What this page is for and how to access it]

## Quick Start (3 Steps)
1. [First thing the user needs to do]
2. [Second step]
3. [They're ready]

## Features Guide
### [Feature Category 1]
#### [Feature Name]
**What it does**: [Plain language description]
**How to use it**: [Step-by-step, numbered]
**What to expect**: [Outcome description]
**Tips**: [Pro tips or best practices]

[Repeat for each feature]

## Frequently Asked Questions
**Q: [Common question]?**
A: [Clear, direct answer]

## Troubleshooting
| Problem | Possible Cause | Solution |
|---------|---------------|----------|

## Glossary
| Term | Definition |
|------|-----------|
```

---

## Template 5: QA Test Plan

Use when: user mentions "QA", "test cases", "test plan", "testing", or combined with research.

**Deliverable**: Research document structured to feed directly into test case creation.

**Output structure:**
```markdown
# [Page Name] — QA Analysis
Date: [YYYY-MM-DD] | Source: [URL]

## 1. Feature Inventory for Testing
| Feature ID | Feature Name | Category | Priority | Testable Elements |
|-----------|-------------|----------|----------|------------------|

## 2. Input Validation Map
| Field/Input | Type | Validation Rules | Required | Boundary Values |
|-------------|------|-----------------|----------|-----------------|

## 3. User Workflows (Test Flows)
### Flow 1: [Name] (P0)
[Steps with expected outcomes at each step]
**Edge cases**: [List]
**Error paths**: [List]

## 4. Integration Test Points
| Source | Target | Trigger | Expected Behavior |
|--------|--------|---------|------------------|

## 5. Non-Functional Test Areas
- Performance: [Areas to load test]
- Security: [Auth, input sanitization, data exposure risks]
- Accessibility: [WCAG items needing verification]
- Cross-browser: [Areas with browser-specific risk]

## 6. Test Data Requirements
[Sample valid and invalid data values for each input field]

## 7. Acceptance Criteria
[Observable success conditions for each major feature]
```

---

## Variation A: Deep Dive

Use for: Deep Dive mode. Adds exhaustive element-level documentation on top of Standard.

**Additional instructions when using Deep Dive:**

For every interactive component on the page, document:
```
[Component Name] ([location on page])
- Default state: [description]
- Hover state: [description or "N/A"]
- Active/clicked state: [description]
- Disabled state: [description or "N/A"]
- Loading state: [description or "N/A"]
- Error state: [description or "N/A"]
- Empty state: [description or "N/A"]
- Mobile behavior: [description or "same as desktop"]
- Keyboard behavior: [Tab stop? Enter/Space triggers? Arrow keys?]
```

For every form field, document:
- Field type (text/email/select/date/file/etc.)
- Required or optional
- Validation rules (format, min/max length, pattern)
- Placeholder text and label text
- Error message text

---

## Variation B: Comparative Analysis

Use for: Comparative mode. Analyze each site independently, then synthesize.

**Research flow:**
1. Research Site A using Standard mode → save findings internally
2. Research Site B (and C if applicable) → save findings internally
3. Synthesize into comparison document

**Output structure:**
```markdown
# [Site A] vs. [Site B] — Comparative Analysis
Date: [YYYY-MM-DD]

## Executive Summary
[Who wins overall and why, in 3-5 sentences]

## Feature Comparison Matrix
| Feature | [Site A] | [Site B] | Winner | Notes |
|---------|----------|----------|--------|-------|

## UX Pattern Comparison
| Dimension | [Site A] | [Site B] | Best Practice |
|-----------|----------|----------|---------------|

## Individual Analysis: [Site A]
[Condensed Standard analysis]

## Individual Analysis: [Site B]
[Condensed Standard analysis]

## Key Takeaways
### [Site A] Advantages
### [Site B] Advantages
### Innovation Gaps (neither does this well)
### Recommendations
```

---

## Variation C: QA Testing Focus

Use for: QA Testing Focus mode. Standard mode + testing lens on every section.

**Additional layer when researching:**
- At each feature, ask: "What validation rules apply here?"
- At each form, document all error messages verbatim
- At each workflow, identify where it can break
- At each integration point, ask: "What happens if this external dependency fails?"
- Note: any race condition opportunities (concurrent users, double-click scenarios)

**Integration with generate-test-cases skill:**
After delivering the QA Analysis, always offer:
> "The QA Analysis is ready. Would you like me to use the `/generate-test-cases` skill
> to automatically convert this into formal test cases with TC IDs, priorities, and CSV export?"

---

## Variation D: UX Focus

Use for: UX Focus mode. Standard mode + UX lens using heuristics and journey mapping.

**Additional analysis layers:**
1. Apply Nielsen's 10 Heuristics (from `analysis-frameworks.md`) — rate each
2. Map at least 2 user journeys with emotional annotations
3. Identify the top 3 friction points and their UX impact
4. Note cognitive load indicators: information density, decision points, required memory
5. Document the visual hierarchy: what draws attention first, second, third
6. Identify the primary CTA and assess its visibility and clarity

**Output addition:**
```markdown
## UX Scorecard
[Heuristic evaluation table from analysis-frameworks.md]

## User Journey Maps
### Journey: [Name] ([Persona])
| Step | Action | Thought | Emotion | Friction |
|------|--------|---------|---------|---------|

## Top 3 UX Issues
1. **[Issue]**: [Description + impact + recommendation]
2. **[Issue]**: [Description + impact + recommendation]
3. **[Issue]**: [Description + impact + recommendation]
```

---

## Iteration Patterns

For large or complex pages, use multi-pass research:

**First Pass (Broad Overview)**
> "Give me a high-level overview of all sections and features."

**Second Pass (Section Deep Dive)**
> "Now provide detailed analysis of:
> 1. [Section 1] — all subsections and features
> 2. [Section 2] — all subsections and features
> 3. User workflows for [specific task]"

**Third Pass (Specific Questions)**
> "Clarify the following:
> 1. How does [Feature X] work exactly?
> 2. What's the relationship between [Section A] and [Section B]?
> 3. What data is displayed in [Component Y]?"

---

📌 **Last Updated**: December 2025 | **Version**: 1.0
