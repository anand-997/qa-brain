---
name: add-api-tests
description: Add REST Assured tests to an existing module from a cURL or Postman command. Generates only the new endpoint method, POJOs, test class, and suite XML block needed — never touches existing framework classes. Use when a resource already exists in the project and you need to add more tests or a new HTTP operation.
---

Generate REST Assured API test automation code for an **EXISTING project** following the exact patterns below.

═══════════════════════════════════════════════════════════════════
FRAMEWORK REFERENCE
═══════════════════════════════════════════════════════════════════

Stack: Java 11 | REST Assured 5.4.0 | TestNG 7.10.2 | ExtentReports 5.1.2 | Log4j2 2.23.1
Root package: com.company.api.automation
ACTION: UPDATE — generate only endpoint/model/test/schema files. Never touch framework classes.

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

Module:            [e.g., users]         ← lowercase, matches existing package
Resource:          [e.g., User]          ← PascalCase, matches existing endpoint class
Action:            [e.g., Update]        ← PascalCase, prefix for new test class
Existing suite:    [e.g., src/test/resources/testsuites/users-suite.xml]

═══════════════════════════════════════════════════════════════════
STEP 4: GENERATE CODE COMPONENTS
═══════════════════════════════════════════════════════════════════

### A. ENDPOINT METHOD (add to existing {Resource}Endpoints.java)

RULES:
- Add the new method to the EXISTING endpoint class — do NOT create a new class
- Extend com.company.api.automation.core.base.BaseAPI
- Use getAuthRequestSpec() for authenticated, getRequestSpec() for public
- EVERY method must call RequestResponseCapture.captureRequest(...) BEFORE the HTTP call
  and RequestResponseCapture.captureResponse(resp) AFTER — no exceptions
- Return io.restassured.response.Response
- Show only the NEW method(s) with a comment: // Add this method to {Resource}Endpoints.java

PATTERN:
```java
// Add this method to {Resource}Endpoints.java

public Response update{Resource}(String id, Update{Resource}Request request) {
    RequestResponseCapture.captureRequest("PUT", BASE_PATH + "/" + id, request, null);
    Response resp = getAuthRequestSpec()
        .body(request)
        .put(BASE_PATH + "/{id}", id);
    RequestResponseCapture.captureResponse(resp);
    return resp;
}
```

---

### B. REQUEST POJO (only if body fields differ from existing request POJO)

File: src/main/java/com/company/api/automation/models/request/{Action}{Resource}Request.java

RULES:
- Only generate if the new operation has a distinct request body
- Annotations: @Data @Builder @NoArgsConstructor @AllArgsConstructor
- @JsonProperty("fieldName") on every field
- No @JsonIgnoreProperties on request POJOs

PATTERN:
```java
package com.company.api.automation.models.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class {Action}{Resource}Request {

    @JsonProperty("field1")
    private String field1;
}
```

---

### C. RESPONSE POJO (only if response shape differs from existing)

File: src/main/java/com/company/api/automation/models/response/{Resource}Response.java

RULES:
- Only generate if new response fields are needed
- If the existing {Resource}Response already covers it, state: "Reuse existing {Resource}Response — no new file needed"
- Annotations: @Data @NoArgsConstructor only
- @JsonIgnoreProperties(ignoreUnknown = true) MANDATORY

---

### D. TEST CLASS

File: src/test/java/com/company/api/automation/tests/{module}/{Action}{Resource}Test.java

RULES:
- Extend com.company.api.automation.core.base.BaseTest
- Initialize endpoint in @BeforeClass (NOT @BeforeMethod)
- Test method naming: {action}_{scenario}_{expectedResult}
  CORRECT: updateUser_missingEmail_returns400
  WRONG:   testUpdateUser
- SoftAssert is MANDATORY in every @Test — always end with soft.assertAll()
- Call SchemaValidator.validate(response, "{resource}-schema.json") on the happy-path test
- Deserialize body: {Resource}Response body = response.as({Resource}Response.class)
- Use ExtentTestManager.logPass/logInfo after key assertions
- Cleanup: override methodTeardown() — do NOT add a separate @AfterMethod cleanup()
- All imports fully qualified (no wildcards except static)
- Collect all negative/boundary scenarios into one @DataProvider

PATTERN:
```java
package com.company.api.automation.tests.{module};

import com.company.api.automation.core.base.BaseTest;
import com.company.api.automation.core.utils.ExtentTestManager;
import com.company.api.automation.core.utils.RandomDataGenerator;
import com.company.api.automation.core.utils.SchemaValidator;
import com.company.api.automation.endpoints.{Resource}Endpoints;
import com.company.api.automation.models.request.{Action}{Resource}Request;
import com.company.api.automation.models.response.{Resource}Response;
import com.company.api.automation.models.response.ErrorResponse;
import io.restassured.response.Response;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;
import org.testng.asserts.SoftAssert;
import java.util.ArrayList;
import java.util.List;

public class {Action}{Resource}Test extends BaseTest {

    private {Resource}Endpoints {resource}Endpoints;
    private final List<String> created{Resource}Ids = new ArrayList<>();

    @BeforeClass
    public void init() {
        {resource}Endpoints = new {Resource}Endpoints();
    }

    @Test(
        description = "{Action} {resource} with valid payload returns 200",
        groups = {"smoke", "regression", "{module}"},
        priority = 1
    )
    public void {action}{Resource}_validPayload_returns200() {
        SoftAssert soft = new SoftAssert();

        {Action}{Resource}Request request = {Action}{Resource}Request.builder()
            .field1(RandomDataGenerator.fullName())
            .build();

        Response response = {resource}Endpoints.{action}{Resource}(existingId, request);

        soft.assertEquals(response.getStatusCode(), 200, "Status code");
        SchemaValidator.validate(response, "{resource}-schema.json");

        {Resource}Response body = response.as({Resource}Response.class);
        soft.assertEquals(body.getField1(), request.getField1(), "field1 must match");

        ExtentTestManager.logPass("{Resource} updated — ID: " + existingId);
        soft.assertAll();
    }

    @Test(
        description = "{Action} {resource} with missing required field returns 400",
        groups = {"regression", "{module}"},
        priority = 2
    )
    public void {action}{Resource}_missingRequiredField_returns400() {
        SoftAssert soft = new SoftAssert();

        {Action}{Resource}Request request = {Action}{Resource}Request.builder().build();
        Response response = {resource}Endpoints.{action}{Resource}(existingId, request);

        soft.assertEquals(response.getStatusCode(), 400, "Status for missing required field");
        ErrorResponse error = response.as(ErrorResponse.class);
        soft.assertNotNull(error.getMessage(), "Error message must be present");

        ExtentTestManager.logInfo("Validated 400 — message: " + error.getMessage());
        soft.assertAll();
    }

    @DataProvider(name = "invalid{Resource}Inputs")
    public Object[][] invalid{Resource}Inputs() {
        return new Object[][] {
            {"",                                400, "empty field1"},
            {null,                              400, "null field1"},
            {" ",                               400, "whitespace-only field1"},
            {"A".repeat(256),                   400, "field1 exceeds max length"},
            {"<script>alert(1)</script>",        400, "XSS injection attempt"},
            {"'; DROP TABLE {resources};--",     400, "SQL injection attempt"},
            {"!@#$%^&*()",                       400, "special characters"},
        };
    }

    @Test(
        description = "{Action} {resource} with invalid field1 values returns 400",
        dataProvider = "invalid{Resource}Inputs",
        groups = {"regression", "{module}"},
        priority = 3
    )
    public void {action}{Resource}_invalidField1_returns400(
            String field1, int expectedStatus, String scenario) {
        SoftAssert soft = new SoftAssert();

        {Action}{Resource}Request request = {Action}{Resource}Request.builder()
            .field1(field1)
            .build();

        Response response = {resource}Endpoints.{action}{Resource}(existingId, request);

        soft.assertEquals(response.getStatusCode(), expectedStatus,
            "Status for scenario [" + scenario + "]");
        ExtentTestManager.logInfo("Scenario [" + scenario + "] → HTTP " + response.getStatusCode());
        soft.assertAll();
    }

    @AfterMethod(alwaysRun = true)
    @Override
    public void methodTeardown() {
        for (String id : created{Resource}Ids) {
            try {
                {resource}Endpoints.delete{Resource}(id);
                log.debug("Cleaned up {resource}: {}", id);
            } catch (Exception e) {
                log.warn("Cleanup failed for {resource} [{}]: {}", id, e.getMessage());
            }
        }
        created{Resource}Ids.clear();
        super.methodTeardown();
    }
}
```

---

### E. JSON SCHEMA (update if response shape changed; otherwise skip)

RULES:
- Use JSON Schema draft-07
- Only add new fields — do not remove existing ones
- State: "Add these fields to existing {resource}-schema.json" if updating

---

### F. SUITE XML — Block to Add

Provide only the `<test>` block to insert into the existing suite file.

```xml
<!-- Add this <test> block inside: {existing-suite-file} -->
<test name="{Resource} {Action} Tests">
    <classes>
        <class name="com.company.api.automation.tests.{module}.{Action}{Resource}Test"/>
    </classes>
</test>
```

---

### G. api.properties ADDITION (only if new path needed)

```properties
api.path.{resources}=/{api-path-extracted-from-curl}
```

---

### H. DO NOT GENERATE

The following classes already exist — do not regenerate or modify them:
BaseAPI, BaseTest, ConfigManager, TokenManager, RequestResponseCapture, SchemaValidator,
RandomDataGenerator, ExtentTestManager, TestListener, RetryAnalyzer, RetryTransformer, pom.xml

═══════════════════════════════════════════════════════════════════
STEP 5: CONSISTENCY REQUIREMENTS
═══════════════════════════════════════════════════════════════════

1. Root package: com.company.api.automation
2. Test method naming: {action}_{scenario}_{result} — NEVER testXxx or verifyXxx
3. All imports fully qualified (no wildcards except static)
4. Schema call: SchemaValidator.validate(response, "file.json")
5. Cleanup: @Override methodTeardown() + super.methodTeardown()
6. DataProvider: last parameter must always be a scenario String
7. Listener class names in suite XML must be fully qualified

═══════════════════════════════════════════════════════════════════
STEP 6: TEST DATA GENERATION RULES
═══════════════════════════════════════════════════════════════════

RULE 1 — UNIQUE DATA: Never hardcode emails, names, or IDs.
  ✅ uniqueEmail() | uuid() | alphanumeric(8)
  ❌ "test@test.com" | "TestUser1"

RULE 2 — REALISTIC DATA: Always use Faker-backed methods.
  ✅ fullName() | phone() | companyName()

RULE 3 — BOUNDARIES IN @DataProvider: Every negative/boundary DataProvider MUST include:
  ("",                          ...) → empty string
  (null,                        ...) → null value
  (" ",                         ...) → whitespace-only
  ("A".repeat(256),             ...) → oversized
  ("<script>alert(1)</script>",  ...) → XSS injection
  ("'; DROP TABLE t;--",         ...) → SQL injection
  ("!@#$%^&*()",                ...) → special characters

AVAILABLE RandomDataGenerator METHODS — use only these:
  fullName() | firstName() | lastName() | username()
  uniqueEmail()   ← ALWAYS use for email fields
  phone() | address()
  alphanumeric(int n) | randomInt(int min, int max) | uuid()
  companyName() | password() | timestamp() | isoDate()

═══════════════════════════════════════════════════════════════════
STEP 7: VALIDATION CHECKLIST
═══════════════════════════════════════════════════════════════════

Before providing output, verify:
[ ] Only new endpoint/model/test/schema files are listed (no framework classes)
[ ] Every new endpoint method has captureRequest() before and captureResponse() after
[ ] All @Test methods declare SoftAssert and end with soft.assertAll()
[ ] Test method names follow {action}_{scenario}_{result}
[ ] Response POJO has @JsonIgnoreProperties(ignoreUnknown = true); Request POJO does NOT
[ ] Cleanup uses @Override methodTeardown() + super.methodTeardown()
[ ] Suite XML provides only a block to ADD to the existing file
[ ] No hardcoded emails, names, or IDs
[ ] DataProvider includes boundary rows (empty, null, whitespace, oversized, XSS, SQL)

═══════════════════════════════════════════════════════════════════
STEP 8: OUTPUT FORMAT
═══════════════════════════════════════════════════════════════════

## Generated Code — {Module} / {Resource}

**Mode:** UPDATE

### Files Changed / Added
```
[list only new or modified files]
```

### New endpoint method — add to {Resource}Endpoints.java
```java
[method code only]
```

### {Action}{Resource}Request.java (skip if reusing existing)
```java
[complete code]
```

### {Resource}Response.java (skip if no changes)
```java
[fields to add or "no changes needed"]
```

### {Action}{Resource}Test.java
```java
[complete code]
```

### {resource}-schema.json (skip if no changes)
```json
[fields to add or "no changes needed"]
```

### Suite XML — block to add to {module}-suite.xml
```xml
[block only]
```

### api.properties addition (skip if path already exists)
```properties
[line to add]
```

### Implementation Notes
- Existing files reused (list them)
- New pom.xml dependencies required (if any — otherwise "none required")

### Run Commands
```bash
mvn clean test -DsuiteXmlFile=src/test/resources/testsuites/{module}-suite.xml -Denv=qa
mvn test -Dtest={Action}{Resource}Test
mvn test -Dtest={Action}{Resource}Test#{action}_{scenario}_{result}
```

### Test Coverage Summary
Total Generated: X | Positive: X | Negative: X | Data-Driven rows: X
