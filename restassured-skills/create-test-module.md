---
name: create-test-module
description: Create a complete new REST Assured test module from a cURL or Postman command and test cases. Generates the endpoint class, request/response POJOs, test class, JSON schema, TestNG suite XML, and api.properties entry for a brand-new resource that does not yet exist in the project.
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

### A. ENDPOINT CLASS

File: src/main/java/com/company/api/automation/endpoints/{Resource}Endpoints.java

RULES:
- Extend com.company.api.automation.core.base.BaseAPI
- Use getAuthRequestSpec() for authenticated endpoints, getRequestSpec() for public ones
- EVERY method must call RequestResponseCapture.captureRequest(...) BEFORE the HTTP call
  and RequestResponseCapture.captureResponse(resp) AFTER it — no exceptions
- Return io.restassured.response.Response (never extract inside endpoint)
- Read BASE_PATH from ConfigManager: ConfigManager.get("api.path.{resources}", "/{resources}")
- Methods are instance methods (not static)
- Full imports — no wildcards

PATTERN:
```java
package com.company.api.automation.endpoints;

import com.company.api.automation.core.base.BaseAPI;
import com.company.api.automation.core.config.ConfigManager;
import com.company.api.automation.core.utils.RequestResponseCapture;
import com.company.api.automation.models.request.Create{Resource}Request;
import io.restassured.response.Response;
import java.util.Map;

public class {Resource}Endpoints extends BaseAPI {

    private static final String BASE_PATH =
        ConfigManager.get("api.path.{resources}", "/{resources}");

    public Response create{Resource}(Create{Resource}Request request) {
        RequestResponseCapture.captureRequest("POST", BASE_PATH, request,
            Map.of("Content-Type", "application/json"));
        Response resp = getAuthRequestSpec()
            .body(request)
            .post(BASE_PATH);
        RequestResponseCapture.captureResponse(resp);
        return resp;
    }

    public Response get{Resource}ById(String id) {
        String path = BASE_PATH + "/" + id;
        RequestResponseCapture.captureRequest("GET", path, null, null);
        Response resp = getAuthRequestSpec()
            .get(BASE_PATH + "/{id}", id);
        RequestResponseCapture.captureResponse(resp);
        return resp;
    }

    public Response update{Resource}(String id, Create{Resource}Request request) {
        RequestResponseCapture.captureRequest("PUT", BASE_PATH + "/" + id, request, null);
        Response resp = getAuthRequestSpec()
            .body(request)
            .put(BASE_PATH + "/{id}", id);
        RequestResponseCapture.captureResponse(resp);
        return resp;
    }

    public Response delete{Resource}(String id) {
        RequestResponseCapture.captureRequest("DELETE", BASE_PATH + "/" + id, null, null);
        Response resp = getAuthRequestSpec()
            .delete(BASE_PATH + "/{id}", id);
        RequestResponseCapture.captureResponse(resp);
        return resp;
    }
}
```

---

### B. REQUEST POJO

File: src/main/java/com/company/api/automation/models/request/Create{Resource}Request.java

RULES:
- Annotations: @Data @Builder @NoArgsConstructor @AllArgsConstructor (all four — Lombok)
- @JsonProperty("fieldName") on every field (Jackson) — use the exact JSON key from the CURL body
- No @JsonIgnoreProperties on request POJOs
- Map ALL fields present in the CURL body; infer Java types from JSON values

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
public class Create{Resource}Request {

    @JsonProperty("field1")
    private String field1;

    @JsonProperty("field2")
    private String field2;
}
```

---

### C. RESPONSE POJO

File: src/main/java/com/company/api/automation/models/response/{Resource}Response.java

RULES:
- Annotations: @Data @NoArgsConstructor only — NO @Builder, NO @AllArgsConstructor
- @JsonIgnoreProperties(ignoreUnknown = true) MANDATORY on class
- @JsonProperty on every field
- Include standard fields: id, createdAt, updatedAt (if API returns them)
- Use String for all date/time fields unless API returns a numeric epoch

PATTERN:
```java
package com.company.api.automation.models.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class {Resource}Response {

    @JsonProperty("id")        private String id;
    @JsonProperty("field1")    private String field1;
    @JsonProperty("createdAt") private String createdAt;
    @JsonProperty("updatedAt") private String updatedAt;
}
```

Also generate ErrorResponse if not already present:

```java
package com.company.api.automation.models.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ErrorResponse {

    @JsonProperty("error")     private String error;
    @JsonProperty("message")   private String message;
    @JsonProperty("code")      private String code;
    @JsonProperty("timestamp") private String timestamp;
}
```

---

### D. TEST CLASS

File: src/test/java/com/company/api/automation/tests/{module}/{Action}{Resource}Test.java

RULES:
- Extend com.company.api.automation.core.base.BaseTest
- Initialize endpoint in @BeforeClass (NOT @BeforeMethod)
- Test method naming: {action}_{scenario}_{expectedResult}
  CORRECT: createUser_missingEmail_returns400
  WRONG:   testCreateUserWithMissingEmail
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
import com.company.api.automation.models.request.Create{Resource}Request;
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
        description = "Create {resource} with valid payload returns 201",
        groups = {"smoke", "regression", "{module}"},
        priority = 1
    )
    public void create{Resource}_validPayload_returns201() {
        SoftAssert soft = new SoftAssert();

        Create{Resource}Request request = Create{Resource}Request.builder()
            .field1(RandomDataGenerator.fullName())
            .field2(RandomDataGenerator.uniqueEmail())
            .build();

        Response response = {resource}Endpoints.create{Resource}(request);

        soft.assertEquals(response.getStatusCode(), 201, "Status code");
        SchemaValidator.validate(response, "{resource}-schema.json");

        {Resource}Response body = response.as({Resource}Response.class);
        soft.assertNotNull(body.getId(),                          "ID must not be null");
        soft.assertEquals(body.getField1(), request.getField1(), "field1 must match");
        soft.assertNotNull(body.getCreatedAt(),                   "createdAt must be present");

        created{Resource}Ids.add(body.getId());
        ExtentTestManager.logPass("{Resource} created — ID: " + body.getId());
        soft.assertAll();
    }

    @Test(
        description = "Create {resource} with missing required field returns 400",
        groups = {"regression", "{module}"},
        priority = 2
    )
    public void create{Resource}_missingRequiredField_returns400() {
        SoftAssert soft = new SoftAssert();

        Create{Resource}Request request = Create{Resource}Request.builder().build();

        Response response = {resource}Endpoints.create{Resource}(request);

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
            {"not-a-valid-value",               400, "invalid field1 format"},
            {"<script>alert(1)</script>",        400, "XSS injection attempt"},
            {"'; DROP TABLE {resources};--",     400, "SQL injection attempt"},
            {"!@#$%^&*()",                       400, "special characters"},
        };
    }

    @Test(
        description = "Create {resource} with invalid field1 values returns 400",
        dataProvider = "invalid{Resource}Inputs",
        groups = {"regression", "{module}"},
        priority = 3
    )
    public void create{Resource}_invalidField1_returns400(
            String field1, int expectedStatus, String scenario) {
        SoftAssert soft = new SoftAssert();

        Create{Resource}Request request = Create{Resource}Request.builder()
            .field1(field1)
            .field2(RandomDataGenerator.uniqueEmail())
            .build();

        Response response = {resource}Endpoints.create{Resource}(request);

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

### E. JSON SCHEMA

File: src/test/resources/schemas/{resource}-schema.json

RULES:
- Use JSON Schema draft-07: "$schema": "http://json-schema.org/draft-07/schema#"
- List ALL guaranteed response fields in "required"
- Use "additionalProperties": false for strict contract enforcement
- Optional fields that can be null: "type": ["string", "null"]
- Date-time fields: "format": "date-time"
- Enum fields: "enum": ["val1", "val2"]

PATTERN:
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "{Resource}",
  "type": "object",
  "required": ["id", "field1", "createdAt"],
  "properties": {
    "id":        { "type": "string",  "minLength": 1 },
    "field1":    { "type": "string" },
    "field2":    { "type": "string" },
    "createdAt": { "type": "string",  "format": "date-time" },
    "updatedAt": { "type": ["string", "null"] }
  },
  "additionalProperties": false
}
```

---

### F. TESTNG SUITE XML — New File

File: src/test/resources/testsuites/{module}-suite.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE suite SYSTEM "https://testng.org/testng-1.0.dtd">
<suite name="{Module} Test Suite" parallel="methods" thread-count="5" verbose="1">

    <listeners>
        <listener class-name="com.company.api.automation.core.listeners.TestListener"/>
        <listener class-name="com.company.api.automation.core.listeners.RetryTransformer"/>
    </listeners>

    <test name="{Module} Smoke Tests">
        <groups><run><include name="smoke"/></run></groups>
        <packages>
            <package name="com.company.api.automation.tests.{module}"/>
        </packages>
    </test>

    <test name="{Module} Regression Tests">
        <groups><run><include name="regression"/></run></groups>
        <packages>
            <package name="com.company.api.automation.tests.{module}"/>
        </packages>
    </test>

</suite>
```

---

### G. api.properties ADDITION

Add to src/test/resources/config/api.properties:
```properties
api.path.{resources}=/{api-path-extracted-from-curl}
```

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
