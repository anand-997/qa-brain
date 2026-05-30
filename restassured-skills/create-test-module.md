---
name: create-test-module
description: Create a new REST Assured test module from a cURL command. Generates endpoint class, request/response POJOs, test class, JSON schema, TestNG suite XML, and api.properties entry.
---

Generate REST Assured API test automation code for a **NEW module** following the exact patterns below.

═══════════════════════════════════════════════════════════════════
FRAMEWORK REFERENCE
═══════════════════════════════════════════════════════════════════

Stack: Java 11 | REST Assured 5.4.0 | TestNG 7.10.2 | ExtentReports 5.1.2 | Log4j2 2.23.1
Root package: com.company.api.automation
ACTION: NEW — generate all files listed in Step 4.

═══════════════════════════════════════════════════════════════════
STEP 1: PARSE cURL
═══════════════════════════════════════════════════════════════════

From the cURL below, extract:
1. HTTP Method (default GET if absent)
2. Full URL → split into base URI + path
3. Headers: Authorization type, Content-Type, custom headers
4. Request body: JSON field names and their types
5. Path parameters (e.g., /users/{id})
6. Query parameters (e.g., ?page=1)

Postman normalization: --location→ignore | --request→-X | --header→-H | --data-raw→-d

CURL:
[PASTE YOUR CURL COMMAND HERE]

═══════════════════════════════════════════════════════════════════
STEP 2: ANALYZE TEST CASES
═══════════════════════════════════════════════════════════════════

From the test cases, extract:
1. Test type: Positive / Negative / Boundary
2. Expected HTTP status codes
3. Field-level validations (presence, value match, type)
4. Test groups: always include "regression"; include "smoke" for happy-path only
5. Data-driven scenarios: collect all negative/boundary into a @DataProvider

TEST CASE(S):
[PASTE YOUR TEST CASES HERE]

═══════════════════════════════════════════════════════════════════
STEP 3: MODULE AND RESOURCE
═══════════════════════════════════════════════════════════════════

Module:   [e.g., users]         ← lowercase, used in package name and suite file name
Resource: [e.g., User]          ← PascalCase, used in class names
Action:   [e.g., Create]        ← PascalCase, prefix for test class name

═══════════════════════════════════════════════════════════════════
STEP 4: GENERATE CODE COMPONENTS
═══════════════════════════════════════════════════════════════════

Load `restassured-skills/references/test-module-patterns.md` for the complete code patterns (A through G):
- A. Endpoint class pattern (extends BaseAPI, captureRequest/captureResponse, instance methods)
- B. Request POJO pattern (@Data @Builder @NoArgsConstructor @AllArgsConstructor + @JsonProperty)
- C. Response POJO pattern (@Data @NoArgsConstructor + @JsonIgnoreProperties, includes ErrorResponse)
- D. Test class pattern (extends BaseTest, @BeforeClass init, SoftAssert, @DataProvider, methodTeardown)
- E. JSON schema pattern (draft-07, required array, additionalProperties: false)
- F. TestNG suite XML template (parallel methods, listeners, smoke + regression tests)
- G. api.properties entry format

═══════════════════════════════════════════════════════════════════
STEP 5: CONSISTENCY REQUIREMENTS
═══════════════════════════════════════════════════════════════════

1. Root package: com.company.api.automation
2. Endpoint: com.company.api.automation.endpoints.{Resource}Endpoints
3. Request POJO: com.company.api.automation.models.request.Create{Resource}Request
4. Response POJO: com.company.api.automation.models.response.{Resource}Response
5. Tests: com.company.api.automation.tests.{module}.{Action}{Resource}Test
6. Test method naming: {action}_{scenario}_{result} — NEVER testXxx or verifyXxx
7. All imports fully qualified (no package.* wildcards except static imports)
8. Schema call: SchemaValidator.validate(response, "file.json")
9. Cleanup: @Override methodTeardown() + super.methodTeardown()
10. DataProvider: last parameter must always be a scenario String
11. Listener class names in suite XML must be fully qualified

═══════════════════════════════════════════════════════════════════
STEP 6: TEST DATA GENERATION RULES
═══════════════════════════════════════════════════════════════════

RULE 1 — UNIQUE DATA: Use unique data on every call — parallel tests share the same DB.
  ✅ uniqueEmail()         → "test_20260520_1234@automation.com"
  ✅ uuid()               → UUID string for IDs
  ✅ alphanumeric(8)       → for reference codes
  ❌ "test@test.com"       → causes conflicts across threads

RULE 2 — REALISTIC DATA: Always use Faker-backed methods.
  ❌ "Test123", "John", "1234567890"
  ✅ fullName(), phone(), companyName()

RULE 3 — BOUNDARIES IN @DataProvider: Every negative/boundary DataProvider MUST include:
  ("",                 ...)   → empty string
  (null,               ...)   → null value
  ("A".repeat(256),    ...)   → oversized
  ("!@#$%^&*()",       ...)   → special characters
  ("<script>alert(1)</script>", ...) → XSS injection
  ("'; DROP TABLE t;--", ...)  → SQL injection
  (" ",                ...)   → whitespace-only

RULE 4 — DATA DEPENDENCY: Create prerequisites in @BeforeClass, not inside @Test.

AVAILABLE RandomDataGenerator METHODS — use only these:
  fullName() | firstName() | lastName() | username()
  uniqueEmail()   ← ALWAYS use for email fields
  phone() | address()
  alphanumeric(int n) | randomInt(int min, int max) | uuid()
  companyName() | password()
  timestamp() | isoDate()

═══════════════════════════════════════════════════════════════════
STEP 7: VALIDATION CHECKLIST
═══════════════════════════════════════════════════════════════════

Before providing output, verify:
[ ] All package declarations start with com.company.api.automation
[ ] Every endpoint method has captureRequest() before and captureResponse() after HTTP call
[ ] All @Test methods declare SoftAssert soft = new SoftAssert() and end with soft.assertAll()
[ ] Test method names follow {action}_{scenario}_{result}
[ ] Endpoint initialized in @BeforeClass
[ ] Response POJO has @JsonIgnoreProperties(ignoreUnknown = true); Request POJO does NOT
[ ] Cleanup uses @Override @AfterMethod methodTeardown() + super.methodTeardown()
[ ] Schema file is valid draft-07 JSON with required array
[ ] Suite XML listener names are fully qualified
[ ] No hardcoded emails, names, or IDs — all use RandomDataGenerator methods
[ ] uniqueEmail() used for every email field
[ ] DataProvider includes: empty, null, whitespace, oversized, special chars, XSS, SQL injection rows

═══════════════════════════════════════════════════════════════════
STEP 8: OUTPUT FORMAT
═══════════════════════════════════════════════════════════════════

## Generated Code — {Module} / {Resource}

**Mode:** NEW

### File Structure
```
[list files being generated]
```

### {Resource}Endpoints.java
```java
[complete code]
```

### Create{Resource}Request.java
```java
[complete code]
```

### {Resource}Response.java
```java
[complete code]
```

### ErrorResponse.java (skip if already exists)
```java
[complete code]
```

### {Action}{Resource}Test.java
```java
[complete code]
```

### {resource}-schema.json
```json
[complete code]
```

### Suite XML — New File: {module}-suite.xml
```xml
[complete code]
```

### api.properties addition
```properties
[line to add]
```

### Implementation Notes
- Field type assumptions made from cURL body
- Schema field assumptions (e.g., enum values inferred from test cases)
- New pom.xml dependencies required (if any — otherwise state "none required")

### Run Commands
```bash
mvn clean test -DsuiteXmlFile=src/test/resources/testsuites/{module}-suite.xml -Denv=qa
mvn clean test -Dgroups=smoke -Denv=qa
mvn test -Dtest={Action}{Resource}Test
mvn test -Dtest={Action}{Resource}Test#{action}_{scenario}_{result}
```

### Test Coverage Summary
Total Generated: X | Positive: X | Negative: X | Data-Driven rows: X
