<!--
📌 File: testing-techniques.md
🎯 Purpose: Testing technique explanations for test case creation and execution
👤 Intended Users: QA Engineers, Manual Testers, Test Case Reviewers
⚠️ Usage: Referenced by generate-test-cases skill for technique details
-->

# Testing Techniques Reference

## Table of Contents
1. [Test Case Preparation Phase](#1-test-case-preparation-phase)
2. [Behavioral Coverage Testing](#21-behavioral-coverage-testing)
3. [ECP — Equivalent Class Partitioning](#22-ecp--equivalent-class-partitioning)
4. [BVA — Boundary Value Analysis](#23-bva--boundary-value-analysis)
5. [DTT — Decision Table Testing](#24-dtt--decision-table-testing)
6. [Error Handling Coverage](#25-error-handling-coverage)
7. [Calculation-Based Testing](#26-calculation-based-testing)
8. [STT — State Transition Testing](#27-stt--state-transition-testing)
9. [Pairwise Testing (Combinatorial)](#28-pairwise-testing-combinatorial)
10. [Use Case Testing](#29-use-case-testing)
11. [Exploratory Testing](#210-exploratory-testing)
12. [Core Functionality Checklist](#3-core-functionality-checklist)
13. [UI/UX Testing](#4-uiux-testing)
14. [Cross-Browser & Mobile Testing](#5-cross-browser-testing)
15. [Mobile Testing](#6-mobile-testing)
16. [Non-Functional Testing](#7-non-functional-testing)

---

## 1. Test Case Preparation Phase

**Before Generating Test Cases:**
- Review requirements (BRD/SRS/TRD)
- Analyze acceptance criteria, edge cases
- Setup test environment
- Prepare test data (valid, invalid, boundary, special characters)

---

## 2. Testing Techniques

### 2.1 Behavioral Coverage Testing

**What:** Test system behavior under user actions, workflows, business rules

**When to Apply:**
- User workflows (e.g., login → dashboard → action)
- Business rules (e.g., discount calculations)
- State transitions (e.g., draft → approved → rejected)

**Example:**
| Test ID | Scenario | Expected |
|---------|----------|----------|
| BEH_001 | Add item without login, then login | Cart persists after login |
| BEH_002 | Apply expired coupon | Error: "Coupon expired" |

---

### 2.2 ECP — Equivalent Class Partitioning

**Definition:** Divide input into classes where behavior is same for all values

**Rules:**
1. Identify input conditions (valid/invalid ranges)
2. Divide into partitions (one valid, multiple invalid)
3. Select one value from each partition
4. Test with selected values

**Example: Age Field (Valid: 18-65)**

Partitions:
1. Invalid (Below min): Age < 18
2. Valid: 18 ≤ Age ≤ 65
3. Invalid (Above max): Age > 65
4. Invalid (Non-numeric): Letters/special chars
5. Invalid (Empty): Null/blank

**Test Cases:**
```
TC_ECP_001: Age field validation
- Partition 1: Age = 15 → Error "Minimum age is 18"
- Partition 2: Age = 30 → Accepted
- Partition 3: Age = 70 → Error "Maximum age is 65"
- Partition 4: Age = "Twenty" → Error "Enter numeric value"
- Partition 5: Age = null → Error "Age required"
```

---

### 2.3 BVA — Boundary Value Analysis

**Definition:** Test at boundaries (min, max, just below, just above)

**Boundary Rules:**
- **Minimum**: min, min-1, min+1
- **Maximum**: max, max-1, max+1

**Example: Password Length (Min: 8, Max: 20)**

| Boundary | Value | Length | Expected |
|----------|-------|--------|----------|
| Below min | "Pass12" | 7 | Error |
| Minimum | "Pass123!" | 8 | Accepted ✅ |
| Min + 1 | "Pass1234!" | 9 | Accepted ✅ |
| Normal | "MyPassword123" | 13 | Accepted ✅ |
| Max - 1 | "MyLongPassword12345" | 19 | Accepted ✅ |
| Maximum | "MyLongPassword123456" | 20 | Accepted ✅ |
| Above max | "MyLongPassword1234567" | 21 | Error |

**Test Cases:**
```
TC_BVA_001: Discount % validation (0-100%)
| Value  | Type          | Expected |
|--------|---------------|----------|
| -1%    | Below min     | Error    |
| 0%     | Minimum       | Accepted |
| 1%     | Min + 1       | Accepted |
| 50%    | Normal        | Accepted |
| 99%    | Max - 1       | Accepted |
| 100%   | Maximum       | Accepted |
| 101%   | Above max     | Error    |
```

---

### 2.4 DTT — Decision Table Testing

**Definition:** Test combinations of conditions and actions

**When to Use:**
- Multiple input conditions
- Complex business rules
- Condition combinations affect outcome

**How to Create:**
1. Identify Conditions (input variables)
2. Identify Actions (outcomes)
3. Create Combinations (all condition combos)
4. Define Actions (map actions for each)

**Example: Loan Approval**

| Rule | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|------|---|---|---|---|---|---|---|---|
| **Conditions** |
| Credit ≥ 700 | Y | Y | Y | Y | N | N | N | N |
| Income ≥ $50K | Y | Y | N | N | Y | Y | N | N |
| Loans < 3 | Y | N | Y | N | Y | N | Y | N |
| **Actions** |
| Approve | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Co-signer | - | ✅ | ✅ | - | ✅ | - | - | - |
| Reject | - | - | - | ✅ | - | ✅ | ✅ | ✅ |

**Test Cases:**
```
TC_DT_001: Credit ≥700, Income ≥50K, Loans <3 → Approve ✅
TC_DT_002: Credit ≥700, Income ≥50K, Loans ≥3 → Co-signer
TC_DT_003: Credit ≥700, Income <50K, Loans <3 → Co-signer
TC_DT_004: Credit ≥700, Income <50K, Loans ≥3 → Reject ❌
```

---

### 2.5 Error Handling Coverage

**Test Scenarios:**
```
SYSTEM ERRORS:
□ Database connection failure
□ API timeout (> 30 seconds)
□ File upload failure
□ Session expired
□ Concurrent update conflict
```

---

### 2.6 Calculation-Based Testing

**Example: Order Total**
```
PRICING FORMULA:
Subtotal = Sum of (Price × Quantity)
Discount = Subtotal × Discount_% / 100
Tax = (Subtotal - Discount) × Tax_Rate / 100
Shipping = Fixed_Rate or (Weight × Rate_Per_KG)
Total = Subtotal - Discount + Tax + Shipping

TEST SCENARIOS:
□ Single item
□ Multiple items
□ Apply percentage discount
□ Calculate tax on discounted amount
□ Free shipping threshold
□ Rounding to 2 decimals
```

---

### 2.7 STT — State Transition Testing

**What:** Test system behaviour as it moves through defined states triggered by events/actions. Ensures all valid transitions work and invalid transitions are rejected.

**When to Apply:**
- Features with a status field (order, ticket, subscription, account)
- Multi-step approval/rejection workflows
- User lifecycle management (active → suspended → deleted)

**How to Create:**
1. List all possible states
2. List events/triggers that cause transitions
3. Build a State Transition Table (from-state × event → to-state)
4. Identify invalid transitions (must be rejected)

**Example: Order Lifecycle**

| From State | Event | To State | Valid? |
|------------|-------|----------|--------|
| Created | Payment confirmed | Confirmed | ✅ |
| Confirmed | Shipped by warehouse | Shipped | ✅ |
| Shipped | Delivered to customer | Delivered | ✅ |
| Delivered | Return requested (≤30d) | Return Pending | ✅ |
| Created | Cancel by user | Cancelled | ✅ |
| Delivered | Cancel by user | Cancelled | ❌ Reject |
| Shipped | Payment confirmed | Confirmed | ❌ Reject |

**Test Cases:**
```
TC_STT_001: Created → [Payment confirmed] → Confirmed           ✅
TC_STT_002: Confirmed → [Shipped by warehouse] → Shipped        ✅
TC_STT_003: Shipped → [Delivered to customer] → Delivered       ✅
TC_STT_004: Delivered → [Cancel by user] → must be rejected     ❌
TC_STT_005: Skip state — Created → [Delivered directly]         ❌ Reject
```

---

### 2.8 Pairwise Testing (Combinatorial)

**What:** Test all pairs of input parameters rather than every possible combination. Provides strong defect-detection coverage with significantly fewer test cases.

**When to Apply:**
- Configuration/compatibility matrices (OS × browser × language)
- Multiple independent filters or options (≥ 3 parameters, each with ≥ 2 values)
- Reduces combinatorial explosion without sacrificing pair-coverage

**How to Create:**
1. List all parameters and their discrete values
2. Calculate full combination count (multiply all value counts) — this is what you avoid
3. Apply pairwise algorithm (tools: PICT, AllPairs, PairwiseOnline.com) to get minimum covering set
4. Each test case covers at least one unique pair not yet covered

**Example: Search Filters**

Parameters:
- Status: Active, Inactive, Pending (3 values)
- Role: Admin, User, Guest (3 values)
- Region: US, EU, APAC (3 values)

Full combinations: 3 × 3 × 3 = **27 test cases**
Pairwise coverage: **~9 test cases** (covers every Status×Role, Status×Region, Role×Region pair)

```
TC_PW_001: Status=Active,   Role=Admin, Region=US
TC_PW_002: Status=Active,   Role=User,  Region=EU
TC_PW_003: Status=Active,   Role=Guest, Region=APAC
TC_PW_004: Status=Inactive, Role=Admin, Region=EU
TC_PW_005: Status=Inactive, Role=User,  Region=APAC
TC_PW_006: Status=Inactive, Role=Guest, Region=US
TC_PW_007: Status=Pending,  Role=Admin, Region=APAC
TC_PW_008: Status=Pending,  Role=User,  Region=US
TC_PW_009: Status=Pending,  Role=Guest, Region=EU
```

---

### 2.9 Use Case Testing

**What:** Derive test cases directly from use cases or user stories. Covers the main (happy-path) flow, alternate flows (valid variations), and exception flows (errors, edge cases).

**When to Apply:**
- User stories with acceptance criteria exist
- End-to-end business workflow validation
- Sprint-level feature acceptance testing

**How to Create:**
1. Identify the use case / user story
2. Write the **Main Flow** (primary success path)
3. Write **Alternate Flows** (valid but non-default paths)
4. Write **Exception Flows** (failures, errors, edge cases)
5. Map one test case per flow

**Example: "User Places an Order"**

| Flow Type | Scenario | Expected |
|-----------|----------|----------|
| Main | User adds item → checkout → pays → order confirmed | Order confirmation email sent |
| Alternate | User applies valid coupon before checkout | Discount applied, order placed |
| Alternate | User changes quantity in cart before checkout | Updated total, order placed |
| Exception | Payment gateway times out | Error shown, order NOT created, retry offered |
| Exception | Item goes out-of-stock between add-to-cart and checkout | Block checkout, notify user |
| Exception | User session expires mid-checkout | Redirect to login, cart preserved |

---

### 2.10 Exploratory Testing

**What:** Simultaneous test design and execution in structured, time-boxed sessions guided by a charter. Not ad-hoc — it is focused, documented, and debriefed.

**When to Apply:**
- New or poorly documented features
- Post-fix sanity checks (go beyond the stated fix)
- UI/UX and usability validation
- Risk areas where scripted tests may miss unexpected behaviour

**Session Structure (SBTM — Session-Based Test Management):**
1. **Charter** — Define the mission: what to test, goal, and time box (60–90 min)
2. **Explore** — Execute freely within the charter scope, following leads
3. **Note** — Log issues, observations, and questions in real time
4. **Debrief** — Summarise coverage, bugs found, and areas needing follow-up

**Charter Template:**
```
Charter:   Explore [AREA] to discover [RISK/GOAL]
Tester:    [Name]
Duration:  90 minutes
Build:     [Version]
Coverage:  [What was tested]
Issues:    [Bugs found]
Blockers:  [What prevented testing]
```

**Example Charters:**
```
Charter 1: Explore checkout flow for payment edge cases
Charter 2: Explore admin dashboard with non-admin role (privilege escalation)
Charter 3: Explore search filters under rapid consecutive interactions (race conditions)
```

**Session Output Checklist:**
```
□ Charter goal achieved? (Y/Partial/N)
□ Bugs logged with steps to reproduce
□ Observations noted (UX issues, inconsistencies)
□ New charters identified for follow-up
□ Session notes attached to test run record
```

---

## 3. Core Functionality Checklist

**Use for ANY module:**

```
AUTHENTICATION
□ Valid/invalid login
□ Password visibility toggle
□ Forgot password flow
□ Session timeout
□ Logout
□ Role-based access

FORM VALIDATION
□ Required fields
□ Format validation (email, phone, date)
□ Character limits
□ Special character handling
□ Dropdown selections
□ File upload restrictions
□ Form reset

DATA OPERATIONS (CRUD)
□ Create record
□ Read/View details
□ Update record
□ Delete record
□ Bulk operations
□ Duplicate handling
□ Concurrent edit handling

SEARCH & FILTER
□ Exact match
□ Partial match
□ No results
□ Special characters
□ Multiple criteria
□ Clear filters
□ Sorting
□ Pagination
```

---

## 4. UI/UX Testing

**Visual Testing:**
```
LAYOUT
□ Consistent header/footer
□ Proper alignment
□ Spacing and padding
□ Font consistency
□ Color scheme
□ Responsive breakpoints

CONTENT
□ Spelling and grammar
□ Label accuracy
□ Error message clarity
□ Help text availability
□ Tooltips working

INTERACTIVE ELEMENTS
□ Button hover/disabled states
□ Link states
□ Focus indicators
□ Loading indicators
□ Modal behavior
□ Dropdowns
```

---

## 5. Cross-Browser Testing

**Browser Matrix:**

| Browser | Versions | Priority |
|---------|----------|----------|
| Chrome | Latest, Latest-1 | P0 |
| Firefox | Latest | P1 |
| Safari | Latest (macOS/iOS) | P1 |
| Edge | Latest | P1 |
| Mobile Chrome | Latest | P0 |
| Mobile Safari | Latest | P0 |

---

## 6. Mobile Testing

**Device Coverage:**
```
PHYSICAL DEVICES (Minimum)
□ iOS (iPhone - latest, latest-1)
□ Android (Samsung, Pixel)
□ Different screen sizes

RESPONSIVE TESTING
□ Portrait/Landscape
□ Tablet view
□ Touch gestures
□ Virtual keyboard
□ Screen rotation

MOBILE-SPECIFIC
□ Touch target size (≥ 44×44 px)
□ Scrolling performance
□ Auto-complete
□ Camera/photo upload
□ GPS/location
□ Network conditions (slow 3G, offline)
```

---

## 7. Non-Functional Testing

### 7.1 Compatibility Coverage

**Cross-Browser Matrix:**

| Browser | Versions | Key Checks |
|---------|----------|------------|
| Chrome | Latest, Latest-1, Latest-2 | CSS Grid, ES6+ |
| Firefox | Latest, Latest-1 | SVG, WebGL |
| Safari | Latest (macOS/iOS) | Webkit CSS, Date inputs |
| Edge | Latest | Chromium compatibility |

**Cross-Device Matrix:**

| Device | Models | OS | Screens |
|--------|--------|-----|---------|
| iPhone | 13, 14, 15 | iOS 16, 17 | 6.1", 6.7" |
| Android | Pixel 7, S23 | Android 13, 14 | 6.2", 6.8" |
| Desktop | Win PC | Win 10, 11 | 1920×1080, 2560×1440 |

**Device-Specific Checks:**
□ Touch target ≥ 44×44px
□ Viewport meta configured
□ Images responsive
□ Font size ≥ 16px
□ No horizontal scrolling

### 7.2 Performance Testing

**Key Metrics:**
- Page load < 3 seconds
- API response < 2 seconds
- Interaction < 100ms
- Time to Interactive (TTI) < 5 seconds

**Test Scenarios:**
□ Heavy data load (1000+ records)
□ Concurrent users (10, 50, 100)
□ Slow network (3G)
□ Large file upload (>10MB)
□ Memory leak detection

### 7.3 Security Testing

**Basic Checks:**
□ SQL injection
□ XSS (Cross-Site Scripting)
□ CSRF tokens
□ Password encryption
□ Session management
□ HTTPS enforcement
□ Input sanitization

### 7.4 Accessibility Testing

**WCAG Standards:**
□ Keyboard navigation (Tab order)
□ Screen reader support
□ Alt text for images
□ Color contrast ratio (4.5:1)
□ Focus indicators
□ ARIA labels
□ Form field labels

---

## 8. Test Execution Guidelines

**Best Practices:**
1. Execute P0 tests first
2. Document defects immediately
3. Retest after fixes
4. Perform smoke tests after deployments
5. Update test cases based on learnings

**Defect Reporting:**
- Clear title
- Steps to reproduce
- Expected vs actual
- Screenshots/videos
- Environment details
- Severity/Priority

---

📌 **Last Updated**: May 27, 2026 | **Version**: 3.0
