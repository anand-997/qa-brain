<!--
📌 File: test-case-template.md
🎯 Purpose: Standard output structure for all test cases (AI-generated or manual)
👤 Intended Users: QA Engineers, Test Automation Engineers
⚠️ Usage: Referenced by generate-test-cases skill for output format
-->

# Test Case Output Structure Template

---

## BASIC TEST CASE STRUCTURE

```markdown
TEST CASE ID: TC_[MODULE]_[NUMBER]
CREATED BY: [Your name]
TEST CASE TITLE: [Descriptive title]
MODULE/FEATURE: [Feature/module name]
PRIORITY: [P0/P1/P2/P3]
TEST TYPE: [Functional/UI/Integration/Regression/Smoke]
TESTING TECHNIQUE: [ECP/BVA/DTT/Behavioral/Error Handling/Functional]
CHANGE REFERENCE: [TRD-XXX-YY-ZZ: Brief description]

OBJECTIVE:
[Clear description of what this test validates]

TEST DATA:
- [Data item 1]: [Value]
- [Data item 2]: [Value]

EXPECTED RESULT:
✓ [Expected outcome 1]
✓ [Expected outcome 2]
✓ [Expected outcome 3]

TEST ENVIRONMENT:
- Browser: [Chrome/Firefox/Safari]
- OS: [Windows/macOS/Linux]
- Environment: [Dev/QA/Staging]
- Build Version: [x.x.x]

NOTES:
[TRD references, platform notes, related test cases]
```

---

## FIELD DESCRIPTIONS

| Field | Description | Required |
|-------|-------------|----------|
| TEST CASE ID | TC_[MODULE]_[NUMBER] | Yes |
| CREATED BY | Person/team name | Yes |
| TEST CASE TITLE | Descriptive title | Yes |
| MODULE/FEATURE | Feature/module name | Yes |
| PRIORITY | P0/P1/P2/P3 | Yes |
| TEST TYPE | Functional, UI, Integration, etc. | Yes |
| TESTING TECHNIQUE | ECP, BVA, DTT, etc. | Yes |
| CHANGE REFERENCE | TRD ID + description | Yes |
| OBJECTIVE | What is being validated | Yes |
| TEST DATA | Specific test values | Yes |
| EXPECTED RESULT | All expected outcomes | Yes |
| TEST ENVIRONMENT | Browser, OS, environment, build | Yes |
| NOTES | TRD refs, platform notes | Optional |

---

## PRIORITY LEVELS

| Priority | Description | Example |
|----------|-------------|---------|
| **P0** | Critical, must work | Login, Checkout, Payment |
| **P1** | Important features | Search, Filters, Profile |
| **P2** | Standard features | Sorting, Pagination |
| **P3** | Nice-to-have | Tooltips, Help text |

---

## TEST TYPE CATEGORIES

- **Functional**: Business logic and functionality
- **UI**: User interface elements and layout
- **Integration**: Component/system interaction
- **Regression**: Existing functionality after changes
- **Smoke**: Critical paths quickly
- **Negative**: Error handling and invalid inputs
- **Boundary**: Edge cases and limits
- **Performance**: Speed and responsiveness

---

## NAMING CONVENTIONS

### Test Case ID Format
```
TC_[MODULE]_[NUMBER]

Examples:
TC_AUTH_001     (Authentication, test 1)
TC_CAT_015      (Category, test 15)
TC_HEADER_042   (Header, test 42)
TC_PERF_008     (Performance, test 8)
```

### Module Abbreviations
- **AUTH**: Authentication
- **CAT**: Category
- **HEADER**: Header/Navigation
- **CARD**: Card/UI Components
- **PERF**: Performance
- **REG**: Regression
- **FLOW**: User Flow
- **FORM**: Form Validation
- **CART**: Shopping Cart
- **PROFILE**: User Profile

---

## EXAMPLE OUTPUT

```markdown
TEST CASE ID: TC_AUTH_001
CREATED BY: QA Team
TEST CASE TITLE: Verify successful login with valid credentials
MODULE/FEATURE: Authentication
PRIORITY: P0
TEST TYPE: Functional, Smoke
TESTING TECHNIQUE: Functional Testing
CHANGE REFERENCE: TRD-AUTH-FE-01: User login functionality

OBJECTIVE:
Verify users can login with valid email and password, redirected to Dashboard with session management.

TEST DATA:
- Email: testuser@example.com
- Password: Test@123456
- Expected Landing: Dashboard

EXPECTED RESULT:
✓ Login successful
✓ Redirected to Dashboard
✓ Session persists on refresh
✓ Username displayed in header
✓ No console errors

TEST ENVIRONMENT:
- Browser: Chrome 120.x, Firefox 121.x
- OS: Windows 11, macOS Sonoma
- Environment: QA
- Build Version: 2.5.0

NOTES:
- Test cross-browser compatibility
- Verify "Remember Me" if present
- Check console for errors
- Related: TRD-AUTH-FE-01, TRD-AUTH-BE-01
```

---

## USAGE GUIDELINES

### When Generating:

1. **Include all required fields**
2. **Use consistent naming** (TC_[MODULE]_[NUMBER])
3. **Write clear objective**
4. **Write clear expected results** (use ✓)
5. **Include test data explicitly**
6. **Map to TRD requirements**
7. **Specify testing technique**
8. **Consider platform differences**

### Best Practices:

✅ **DO**:
- Write atomic test cases (one scenario per case)
- Use specific error messages
- Include TRD references
- Write clear, testable objectives
- Specify testing technique

❌ **DON'T**:
- Use vague descriptions
- Skip test data values
- Combine multiple unrelated scenarios
- Forget priority, type, technique
- Write lengthy test steps

---

## 🔴 CSV FORMAT REQUIREMENT

**⚠️ ONE ROW PER TEST CASE - NO STEP BREAKDOWN**

**✅ CORRECT FORMAT:**
```csv
TEST CASE ID,CREATED BY,TEST CASE TITLE,MODULE/FEATURE,PRIORITY,TEST TYPE,TESTING TECHNIQUE,CHANGE REFERENCE,OBJECTIVE,TEST DATA,EXPECTED RESULT,TEST ENVIRONMENT,NOTES
TC_CAT_001,AI Generated,Verify three top-level category groups,Advice Page - Category Structure,P0,Functional - Positive,Functional Testing,TRD-CAT-FE-02: Display Three Groups,"Verify three primary category groups (Stocks, Derivatives, Alpha Zone) visible","Platform: Web; Expected: Stocks, Derivatives, Alpha Zone","✓ Exactly 3 groups ✓ Groups labeled correctly ✓ All clickable","Browser: Chrome; OS: Win 11; Env: QA; Build: 2.5.0",TRD-CAT-FE-02: Three-tier structure
TC_CAT_002,AI Generated,Verify legacy categories removed,Advice Page - Category Structure,P0,Functional - Negative,Regression Testing,TRD-CAT-FE-01: Remove Legacy Categories,Verify legacy names no longer visible,"Legacy: Alpha InvestPro, Alpha Day Trader","✓ No 'Alpha InvestPro' ✓ No 'Alpha Day Trader' ✓ No legacy references","Browser: Chrome; OS: Win 11; Env: QA; Build: 2.5.0",TRD-CAT-FE-01: Legacy removal
```

### CSV Column Instructions:

| Column | Fill With |
|--------|-----------|
| TEST CASE ID | TC_[MODULE]_[NUMBER] |
| CREATED BY | Person/team name |
| TEST CASE TITLE | Clear title |
| MODULE/FEATURE | Feature name |
| PRIORITY | P0/P1/P2/P3 |
| TEST TYPE | Functional, UI, etc. |
| TESTING TECHNIQUE | ECP, BVA, DTT, etc. |
| CHANGE REFERENCE | TRD ID + description |
| OBJECTIVE | What validates (1-2 sentences) |
| TEST DATA | All data separated by semicolons |
| EXPECTED RESULT | All outcomes using ✓, space-separated |
| TEST ENVIRONMENT | Browser, OS, Env, Build (semicolons) |
| NOTES | TRD refs, platform notes |

**Why This Matters:**
- ✅ Faster generation (avoids length limits)
- ✅ Each row independently filterable
- ✅ Data integrity in Excel/databases
- ✅ Easier to read and manage
- ✅ Test tools can import properly
- ✅ Reduces file size significantly

**🎯 Remember:** ONE ROW PER TEST CASE - all fields filled - no empty cells!

---

📌 **Last Updated**: December 8, 2025 | **Version**: 2.0
