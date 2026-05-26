<!--
📌 File: ui-context.md
🎯 Purpose: UI/web-specific test case generation patterns, modular TRD handling, Figma integration
👤 Intended Users: QA Engineers testing web/mobile frontends
⚠️ Usage: Referenced by generate-test-cases skill for UI feature test generation
-->

# UI Test Case Generation — Context & Patterns

## When to Use This Reference
Load this file when the feature under test involves:
- Web application UI (React, Angular, Vue, etc.)
- Mobile app UI (iOS, Android)
- Figma designs or design screenshots provided
- Responsive / cross-device layout changes
- User workflows and navigation flows
- Form validation and user input

---

## Handling Large TRDs — Modular Approach

**Use when TRD is 500+ lines.** Break into sections and generate one at a time.

### Modular Section Breakdown Pattern
```
Prompt 1: Section 4.1 (Category Structure) → TC_CAT_001-025
Prompt 2: Section 4.2 (Header/Navigation) → TC_HEADER_001-010
Prompt 3: Section 4.3 (Card Components) → TC_CARD_001-010
Prompt 4: Section 4.4 (Performance) → TC_PERF_001-020
Prompt 5: User Flows/Workflows → TC_FLOW_001-010
Prompt 6: Regression Suite → TC_REG_001-020
```

Announce the section breakdown to the user before starting, generate one section at a time,
and confirm before moving to the next section. If a section hits response length limits,
split it further (TC_001-010, TC_011-020, etc.).

---

## Testing Technique Mapping for UI

| TRD Change Type | Technique | What to Test |
|----------------|-----------|--------------|
| Input field with validation rules | **ECP** | Valid class, each invalid class (empty, wrong format, too long) |
| Numeric range / string length limit | **BVA** | Min-1, min, min+1, max-1, max, max+1 |
| Multiple conditions → different UI states | **DTT** | Decision table of conditions → expected outcomes |
| Multi-step user workflow / navigation flow | **Behavioral** | Each step, forward/back navigation, interruptions |
| Error messages, loading states, empty states | **Error Handling** | All validation triggers, network failure, timeout |
| Form with many fields | **ECP + Error Handling** | Required fields, format validation, boundary values |

---

## UI Test Coverage Areas

### Forms & Input Validation
```
REQUIRED FIELDS
□ Submit with all required fields empty → appropriate error per field
□ Submit with one required field empty at a time
□ Submit with all valid data → success

FIELD FORMAT VALIDATION
□ Email: valid@domain.com (valid) vs invalid@, @domain, no-at (invalid)
□ Phone: correct format (valid) vs letters, wrong length (invalid)
□ Date: valid date vs past/future boundary vs invalid format
□ Password: meets criteria (valid) vs too short, no special chars (invalid)

CHARACTER LIMITS
□ At max characters: accepted
□ At max + 1: rejected or truncated
□ Field counter updates if displayed

SPECIAL CHARACTERS
□ XSS probe: <script>alert(1)</script> in text fields → sanitized
□ SQL injection probe: ' OR 1=1-- → handled safely
□ Unicode/emoji characters → handled correctly
```

### Navigation & Workflows
```
MULTI-STEP FLOWS
□ Forward navigation (each step completes successfully)
□ Back navigation (data persists from previous steps)
□ Page refresh mid-flow (data preserved or appropriate warning)
□ Browser back button behavior
□ Step validation (cannot skip required steps)

LINKS & BUTTONS
□ All navigation links work
□ CTAs (Call to Action buttons) perform correct action
□ Disabled state buttons cannot be clicked
□ Loading state appears during async actions
□ Success/error feedback after actions
```

### Responsive / Cross-Device
```
BREAKPOINTS TO TEST
□ Mobile (320px - 767px)
□ Tablet (768px - 1023px)
□ Desktop (1024px+)
□ Large desktop (1440px+)

LAYOUT CHECKS AT EACH BREAKPOINT
□ No horizontal scroll
□ Text readable (font size ≥ 16px)
□ Touch targets ≥ 44×44px
□ Images scale correctly
□ Navigation collapses to hamburger (if applicable)
□ Tables scroll or reformat (not overflow)
```

### Cross-Browser Matrix

| Browser | Priority | Versions |
|---------|----------|---------|
| Chrome | P0 | Latest, Latest-1 |
| Mobile Chrome (Android) | P0 | Latest |
| Mobile Safari (iOS) | P0 | Latest |
| Firefox | P1 | Latest |
| Safari (macOS) | P1 | Latest |
| Edge | P1 | Latest |

**Cross-browser checks:**
- CSS rendering consistent
- JavaScript behavior identical
- Date inputs behave correctly (Safari handles these differently)
- CSS Grid/Flexbox layouts consistent
- Font rendering consistent

---

## Figma Integration Guidance

When the user provides a Figma URL:

1. Use the Figma MCP tool (`get_design_context` or `get_screenshot`) to read the design
2. Extract the following from the design:
   - Component names and their states (default, hover, active, disabled, error, loading, empty)
   - Form fields: labels, placeholder text, validation hints shown in the design
   - Error state messages shown in the design (use exact text in expected results)
   - Loading indicators and their behavior
   - Empty states (no data, no results, first-time use)
   - Success states and confirmation messages
   - Modal/dialog behavior
   - Navigation flow between screens
3. Use extracted field names and error messages verbatim in test case EXPECTED RESULT
4. For each component state visible in the design, create at least one test case

**Example approach:**
If the Figma shows a file upload component with states: `idle | dragging | uploading | success | error (file too large) | error (wrong format)`, create test cases for all 6 states.

---

## Scenario Templates for Common UI Changes

### New Screen / Page Added
Generate test cases for:
1. Page loads successfully (P0 smoke)
2. All UI elements render correctly (labels, buttons, inputs)
3. Navigation to/from the page works
4. Page title and URL correct
5. Responsive layout at all breakpoints
6. Cross-browser rendering

### Form Modified (Fields Added/Removed/Changed)
Generate test cases for:
1. New required fields validated
2. Removed fields no longer present (regression: no broken references)
3. Changed field labels match TRD specification
4. Existing valid form submission still works (regression)
5. ECP + BVA for all new/changed fields

### Component State Changed
Generate test cases for:
1. Each new/modified state renders correctly
2. Transitions between states work (e.g., idle → loading → success)
3. Error state displays correct message
4. Empty state handled gracefully
5. Loading state prevents duplicate actions

### Workflow / Navigation Changed
Generate test cases using Behavioral Coverage:
1. Happy path: all steps complete successfully
2. Step validation: missing required data prevents progression
3. Back navigation: data persists
4. Error recovery: user can retry after error
5. Session persistence: refresh doesn't lose progress

---

## Output Format for UI Test Cases

For UI test cases, the TEST ENVIRONMENT must include:

```
TEST ENVIRONMENT:
- Browser: Chrome 120.x (P0), Firefox 121.x (P1)
- OS: Windows 11, macOS Sonoma
- Resolution: 1920×1080 (desktop), 390×844 (mobile)
- Environment: QA
- Build Version: x.x.x
```

For cross-browser test cases, create separate test cases per browser OR note
browser-specific variations in the NOTES field with "(repeat for Firefox, Safari, Edge)".

---

## Change Analysis Checklist for UI TRDs

When analyzing a UI TRD, identify and test:

- [ ] New screens or pages added
- [ ] Modified UI components (layout, states, behavior)
- [ ] Updated business rules reflected in UI
- [ ] Form field changes (added, removed, modified validation)
- [ ] Navigation/routing changes
- [ ] User workflow changes
- [ ] Copy/label changes (text, button labels, error messages)
- [ ] Design system updates (colors, typography, spacing)
- [ ] Accessibility improvements
- [ ] Responsive layout changes
- [ ] Performance impacts (lazy loading, pagination, virtualization)
- [ ] Integration with new/changed APIs (loading states, error handling)

---

📌 **Last Updated**: December 2025 | **Version**: 2.0
