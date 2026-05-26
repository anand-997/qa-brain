# API Automation Prompts & Templates

**Version:** 2.0.0  
**Purpose:** Comprehensive AI-powered test automation toolkit for Rest Assured API testing  
**Updated:** January 2026

---

## 📁 File Organization

### 🎯 **CORE WORKFLOW FILES**

#### 1. **api-test-generator-skill.md** ⭐ RECOMMENDED
- **Purpose:** AI-powered code generation from Postman or raw cURL commands + test cases
- **Best For:** Rapidly generating framework-aligned API tests — new module or adding to existing project
- **Generates:**
  - ✅ Endpoint classes (getAuthRequestSpec + RequestResponseCapture pattern)
  - ✅ Request/Response POJOs with Lombok + Jackson
  - ✅ Test classes with SoftAssert, @BeforeClass init, @DataProvider negatives
  - ✅ JSON Schema (draft-07) for contract validation
  - ✅ TestNG suite XML with fully qualified listener names
  - ✅ api.properties path entry
- **Input Required:**
  - Postman-exported OR raw cURL command(s)
  - Test case specifications
  - Module/Service name and action (NEW or UPDATE)
- **Modes:**
  - **NEW** — generates all files for a new module
  - **UPDATE** — generates only endpoint/model/test/schema; never touches framework classes
- **Output:** Production-ready code aligned with `restassured-framework-complete-guide.md` v3.0.0

---

### 📚 **REFERENCE & GUIDE FILES**

#### 2. **restassured-framework-complete-guide.md** ⭐ FRAMEWORK SETUP
- **Purpose:** Production-ready complete framework guide — single source of truth for new project setup
- **Contains:**
  - Complete project directory structure
  - POM.xml with consistent, pinned dependency versions (RestAssured 5.4.0 | TestNG 7.10.2)
  - All core class implementations: BaseAPI, BaseTest, ConfigManager, TokenManager,
    RequestResponseCapture, SchemaValidator, RandomDataGenerator, ExtentTestManager,
    TestListener, RetryAnalyzer, RetryTransformer
  - All configuration files (config, api, auth, environments)
  - Log4j2 XML configuration
  - TestNG suite XML examples (smoke + regression)
  - Complete working example: UserEndpoints + POJOs + CreateUserTest
  - JSON Schema example
  - Test execution commands
  - Jenkinsfile + GitHub Actions workflow
  - .gitignore
  - Best practices
- **Use When:** Creating a new framework from scratch — copy each section in order

#### 3. *(test-patterns-reference.md — removed)*

Unique content merged into `api-test-generator-skill.md` (Add-On prompts section):
- Add-On 4: Authentication & Authorization Test Patterns (AuthEndpoints, login/refresh tests, 401/404/409 extended negatives)
- Add-On 5: Chained E2E Workflow Test (multi-step workflow pattern with reverse-order teardown)

Dropped (already covered by main skill template):
- CRUD, basic negative, data-driven, schema, endpoint class, and POJO examples — patterns for all of these are in Sections A–E of the main prompt template

#### 4. *(test-data-strategy-guide.md — removed)*

Unique content merged into `api-test-generator-skill.md` (Section I — TEST DATA GENERATION RULES):
- 4 core principles (Uniqueness, Realism, Boundary, Dependency)
- Full RandomDataGenerator method reference (so AI never invents non-existent method names)
- 8-row systematic boundary DataProvider matrix (null, empty, whitespace, oversized, format, XSS, SQL, special chars)
- One-field-varies DataProvider design pattern

Dropped from the guide (not merged):
- Full RandomDataGenerator class implementation — has a critical thread-safety bug (`static final Faker`, not `ThreadLocal<Faker>`); correct version is in `restassured-framework-complete-guide.md` section 4.7
- Entity-specific generators (UserDataGenerator, ProductDataGenerator) — project-specific; AI generates these per-resource
- DataCleanupManager — superseded by `@Override methodTeardown()` pattern

---

### 🔧 **QUICK REFERENCE FILES**

#### 5. **restassured-cheatsheet.md**
- **Purpose:** Quick code snippets for common RestAssured operations
- **Contains:**
  - HTTP method examples (GET, POST, PUT, DELETE)
  - Request/Response specifications
  - Authentication patterns (Basic, OAuth2, Bearer)
  - Response time assertions
  - File upload and form data
  - Cookie handling
  - Filters (interceptors) and proxy configuration
  - Hamcrest matchers reference table
  - Jackson annotations reference table
  - TestNG annotations reference table
  - ContentType enum reference
- **Use When:** Need quick syntax reminder or code snippet

#### 6. *(component-prompts-reference.md — removed)*

Unique components merged into `api-test-generator-skill.md` (Add-On Component Prompts section):
- CSV/Excel file-based DataProvider
- AssertionUtils (custom response assertion helper)
- File upload endpoint + test

Redundant components removed (already in framework or generator):
- POJO generation, JSON Schema, inline DataProvider → covered by main generator workflow
- TokenManager, SchemaValidator, RequestBuilder, ResponseLogger → framework classes (never regenerate)

---

### 📂 **TEMPLATES FOLDER**

#### 7. **restassured-framework-complete-guide.md** (moved to root — see item #2 above)
- Formerly `templates/complete-project-structure.md`
- Moved to root of this directory and fully rewritten as v3.0.0
- All 38 defects fixed: thread-safety, version consistency, missing implementations, package mismatches, corrupt content

---

## 🚀 Quick Start Guide

### For Complete Code Generation (RECOMMENDED):
1. **Use:** `api-test-generator-skill.md`
2. **Provide:** CURL command + Test cases
3. **Get:** Complete automation code ready to run

### For Framework Setup:
1. **Read:** `restassured-framework-complete-guide.md`
2. **Implement:** Copy each section in order (POM → Core Classes → Config → Suites)
3. **Customize:** Environment properties and base URI

### For Test Implementation:
1. **Browse:** `test-patterns-reference.md` for patterns
2. **Generate Data:** RandomDataGenerator reference is in `api-test-generator-skill.md` Section I
3. **Customize:** Adapt patterns to your API

### For Add-On Components (CSV/Excel DataProvider, AssertionUtils, File Upload):
1. **Use:** `api-test-generator-skill.md` → scroll to **Add-On Component Prompts** section
2. **Select:** The matching add-on prompt
3. **Generate:** Targeted component code

---

## 📋 File Usage Matrix

| Scenario | Primary File | Supporting Files |
|----------|-------------|------------------|
| **New Project Setup** | restassured-framework-complete-guide.md | api-test-generator-skill.md |
| **Generate Tests from Scratch** | api-test-generator-skill.md | - |
| **Add Tests to Existing Project** | api-test-generator-skill.md (UPDATE mode) | - |
| **Auth / 401 / 404 / 409 Tests** | api-test-generator-skill.md (Add-On 4) | - |
| **Chained E2E Workflow Test** | api-test-generator-skill.md (Add-On 5) | - |
| **Implement Data Generation** | api-test-generator-skill.md (Section I) | restassured-framework-complete-guide.md §4.7 |
| **CSV/Excel DataProvider** | api-test-generator-skill.md (Add-On 1) | - |
| **AssertionUtils / File Upload** | api-test-generator-skill.md (Add-On 2/3) | - |
| **Quick Code Snippet** | restassured-cheatsheet.md | - |
| **Review Best Practices** | All guides | - |

---

## 📌 Best Practices

1. **Start with the CURL-based generator** for maximum efficiency
2. **Use Add-On prompts** in `api-test-generator-skill.md` for auth, E2E, CSV, file-upload patterns
3. **Use RandomDataGenerator** for realistic test data
4. **Implement proper cleanup** in @AfterMethod
5. **Use SoftAssert** for multiple validations
6. **Enable detailed logging** for debugging
7. **Keep tests independent** - no dependencies between tests

---

## 📝 Version History

### v3.2.0 (Current - May 2026)
**Test Patterns Merged into Skill**

✅ **Merged into `api-test-generator-skill.md` (Add-Ons 4 and 5):**
- Authentication & Authorization Test Patterns (login, invalid login, refresh, 401/404/409 extended negatives)
- Chained E2E Workflow Test (multi-step workflow with reverse-order teardown)

✅ **Removed:**
- `test-patterns-reference.md` — unique patterns merged; CRUD/schema/POJO examples dropped (already in skill template Sections A–E and framework guide)

---

### v3.1.0 (May 2026)
**Test Data Strategy Merged into Skill**

✅ **Merged into `api-test-generator-skill.md`:**
- 4 test data principles (Uniqueness, Realism, Boundary, Dependency)
- Full RandomDataGenerator method reference (prevents AI inventing phantom method names)
- Systematic 8-row boundary DataProvider matrix
- Updated DataProvider pattern to one-field-varies design

✅ **Removed:**
- `test-data-strategy-guide.md` — unique content merged; buggy non-thread-safe `RandomDataGenerator` dropped

---

### v3.0.0 (May 2026)
**Generator Renamed to Skill + Component Consolidation**

✅ **Renamed:**
- `ai-test-generator-by-curl-prompt.md` → `api-test-generator-skill.md` (reusable skill)

✅ **Merged into `api-test-generator-skill.md`:**
- CSV/Excel file-based DataProvider (from component-prompts-reference.md)
- AssertionUtils custom assertion helper (from component-prompts-reference.md)
- File upload endpoint + test (from component-prompts-reference.md)

✅ **Removed:**
- `component-prompts-reference.md` — unique content merged; redundant prompts dropped
  (TokenManager, SchemaValidator, RequestBuilder, ResponseLogger are framework classes)

✅ **Updated:**
- CLAUDE.md: corrected code standards and package conventions to match framework v3.0.0
- README: updated file matrix, Quick Start, and all cross-references

---

### v2.0.0 (January 2026)
**Major Reorganization - Consolidated and Generic**

✅ **Merged Files:**
- Merged framework-architecture-guide.md into templates/complete-project-structure.md
- Now ONE comprehensive guide with structure + implementation

✅ **Created New Files:**
- test-patterns-reference.md (consolidated test patterns)
- component-prompts-reference.md (quick component generation)
- test-data-strategy-guide.md (data generation strategies)
- restassured-cheatsheet.md (code snippets)

✅ **Removed Redundant Files:**
- Deleted api-test-templates.md (replaced by test-patterns-reference.md)
- Deleted api-data-generation-rules.md (replaced by test-data-strategy-guide.md)
- Deleted restassured-ai-prompts.md (replaced by component-prompts-reference.md)
- Deleted restassured-framework-guide.md (replaced by restassured-cheatsheet.md)
- Deleted framework-architecture-guide.md (merged into complete-project-structure.md)

✅ **Improvements:**
- Made all content generic and reusable (removed project-specific references)
- Properly segregated files by purpose
- Reduced file lengths for better readability (< 1200 lines)
- Improved README navigation and structure
- Added file usage matrix for quick reference
- Single comprehensive guide for framework setup

### v1.0.0
- Initial prompt files creation
- Basic test templates and guides

---

## 🤝 Contributing

When adding new patterns or guides:
- Keep files focused and not too long (< 1000 lines)
- Make content generic and reusable
- Include complete working examples
- Add clear section headers
- Update this README's file usage matrix

---

**Ready to automate? Start with `api-test-generator-skill.md` for the fastest path to working tests!** 🚀
  - Best practices
  - Framework capabilities
  - Code examples
  - CI/CD integration
- **Use When:** 
  - Planning project structure
  - Understanding framework architecture
  - Reference for AI code generation
  - Onboarding new team members

---

## 🚀 Quick Start Guide

### Scenario 1: "I have a CURL command and want complete test code"
**Use:** [api-test-generator-skill.md](api-test-generator-skill.md)
1. Provide your CURL command
2. Provide your test case(s)
3. Specify module name
4. Get complete code (Endpoints + POJOs + Tests + Schema + Suite)

### Scenario 2: "I want to setup a new framework"
**Use:** [restassured-framework-guide.md](restassured-framework-guide.md)
1. Follow POM.xml setup
2. Create base classes
3. Setup configuration
4. Reference: [templates/automation-structure-template.md](templates/automation-structure-template.md)

### Scenario 3: "I need example test code to understand patterns"
**Use:** [api-test-templates.md](api-test-templates.md)
1. Browse template categories
2. Copy relevant template
3. Modify for your API

### Scenario 4: "I only need to generate POJOs from JSON"
**Use:** [restassured-ai-prompts.md](restassured-ai-prompts.md) → Prompt #1

### Scenario 5: "I need to generate test data"
**Use:** [api-data-generation-rules.md](api-data-generation-rules.md)
1. Review core principles
2. Use RandomDataGenerator patterns
3. Generate realistic, unique data

### Scenario 6: "I want to convert Postman to RestAssured"
**Use:** [restassured-ai-prompts.md](restassured-ai-prompts.md) → Prompt #9

### Scenario 7: "I need GraphQL test generation"
**Use:** [restassured-ai-prompts.md](restassured-ai-prompts.md) → Prompt #13

---

## 📊 File Comparison Matrix

| File | CURL Input | Test Case Input | Full Code Gen | Quick Prompts | Examples | Architecture |
|------|-----------|----------------|---------------|---------------|----------|--------------|
| **api-test-generator-skill.md** | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| **restassured-framework-guide.md** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| **api-test-templates.md** | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| **api-data-generation-rules.md** | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| **restassured-ai-prompts.md** | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ |
| **templates/automation-structure-template.md** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |

---

## 🎯 Recommended Workflow

### Phase 1: Setup (One-time)
1. Read **restassured-framework-guide.md** for framework setup
2. Reference **templates/automation-structure-template.md** for structure
3. Setup POM.xml, BaseAPI, configurations

### Phase 2: Development (Per API)
1. **Primary:** Use **api-test-generator-skill.md** with CURL + Test Cases
2. **Alternative:** Use **restassured-ai-prompts.md** for specific components
3. **Reference:** Use **api-test-templates.md** for code examples
4. **Data:** Use **api-data-generation-rules.md** for test data patterns

### Phase 3: Maintenance
1. **Templates:** Reference **api-test-templates.md** for patterns
2. **Debug:** Use **restassured-ai-prompts.md** → Prompt #8 (Fix Failing Tests)
3. **Enhance:** Use specialized prompts from **restassured-ai-prompts.md**

---

## 🔑 Key Principles Across All Files

### ✅ **Mandatory Standards:**
1. **Always use SoftAssert** in all tests
2. **Always call softAssert.assertAll()** at the end
3. **Extend BaseAPI** for endpoint classes
4. **Use Lombok + Jackson** annotations for POJOs
5. **Include JavaDoc** comments
6. **Use ThreadLocal** for specs
7. **Follow naming conventions** (resource-based)
8. **Include cleanup** in @AfterMethod
9. **Add ExtentReport** logging
10. **Generate unique test** data

---

## 📖 Documentation Standards

All files follow:
- Clear purpose statement
- Structured sections
- Code examples
- Best practices
- Version tracking
- Last updated date

---

## 🔄 File Update Policy

When updating any file:
1. **Check for duplicates** across other files
2. **Remove redundant** content
3. **Cross-reference** related files
4. **Update version** and date
5. **Maintain consistency** in patterns

---

## 📝 Contributing

When adding new content:
- **api-test-generator-skill.md:** Comprehensive workflow additions
- **restassured-ai-prompts.md:** New quick prompts for specific components
- **api-test-templates.md:** New template patterns
- **api-data-generation-rules.md:** New data generation patterns
- **restassured-framework-guide.md:** Framework setup changes
- **templates/automation-structure-template.md:** Structure/architecture changes

---

## 📞 Quick Reference

| Need | File | Section |
|------|------|---------|
| Generate from CURL | api-test-generator-skill.md | Main Template |
| Setup framework | restassured-framework-guide.md | POM.xml Setup |
| Project structure | templates/automation-structure-template.md | Full Structure |
| CRUD test example | api-test-templates.md | BASIC CRUD TEST |
| Negative test example | api-test-templates.md | NEGATIVE TEST |
| Data generation | api-data-generation-rules.md | RandomDataGenerator |
| POJO generation | restassured-ai-prompts.md | Prompt #1 |
| Token management | restassured-ai-prompts.md | Prompt #4 |
| Performance test | restassured-ai-prompts.md | Prompt #7 |
| Fix failing test | restassured-ai-prompts.md | Prompt #8 |
| Postman conversion | restassured-ai-prompts.md | Prompt #9 |
| GraphQL tests | restassured-ai-prompts.md | Prompt #13 |

---

## 🎓 Learning Path

### Beginner
1. Start with **restassured-framework-guide.md**
2. Review **templates/automation-structure-template.md**
3. Study **api-test-templates.md** examples

### Intermediate
1. Use **api-test-generator-skill.md** for code generation
2. Apply **api-data-generation-rules.md** for better data
3. Explore **restassured-ai-prompts.md** for specific needs

### Advanced
1. Customize **api-test-generator-skill.md** workflow
2. Create custom templates in **api-test-templates.md**
3. Extend **api-data-generation-rules.md** with domain-specific patterns

---

**Version:** 1.0.0  
**Last Updated:** December 23, 2025  
**Total Files:** 6

---

**Pro Tip:** Bookmark **api-test-generator-skill.md** - it's your primary tool for generating complete, consistent code from CURL commands! 🚀
