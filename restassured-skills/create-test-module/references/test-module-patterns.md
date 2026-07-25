# Test Module Code Patterns

Reference file for `/create-test-module` and `/add-api-tests`. Contains the complete code patterns for all generated files (Step 4 A–G). Replace `{Resource}`, `{resource}`, `{Action}`, `{action}`, `{module}`, and `{resources}` with values derived from the user's cURL and Step 3 inputs.

---

### A. ENDPOINT CLASS

File: `src/main/java/com/company/api/automation/endpoints/{Resource}Endpoints.java`

RULES:
- Extend `com.company.api.automation.core.base.BaseAPI`
- Use `getAuthRequestSpec()` for authenticated endpoints, `getRequestSpec()` for public ones
- EVERY method must call `RequestResponseCapture.captureRequest(...)` BEFORE the HTTP call and `RequestResponseCapture.captureResponse(resp)` AFTER — no exceptions
- Return `io.restassured.response.Response` (never extract inside endpoint)
- Read BASE_PATH from ConfigManager: `ConfigManager.get("api.path.{resources}", "/{resources}")`
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

File: `src/main/java/com/company/api/automation/models/request/Create{Resource}Request.java`

RULES:
- Annotations: `@Data @Builder @NoArgsConstructor @AllArgsConstructor` (all four — Lombok)
- `@JsonProperty("fieldName")` on every field (Jackson) — use the exact JSON key from the cURL body
- No `@JsonIgnoreProperties` on request POJOs
- Map ALL fields present in the cURL body; infer Java types from JSON values

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

File: `src/main/java/com/company/api/automation/models/response/{Resource}Response.java`

RULES:
- Annotations: `@Data @NoArgsConstructor` only — NO `@Builder`, NO `@AllArgsConstructor`
- `@JsonIgnoreProperties(ignoreUnknown = true)` MANDATORY on class
- `@JsonProperty` on every field
- Include standard fields: `id`, `createdAt`, `updatedAt` (if API returns them)
- Use `String` for all date/time fields unless API returns a numeric epoch

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

Also generate `ErrorResponse` if not already present:

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

File: `src/test/java/com/company/api/automation/tests/{module}/{Action}{Resource}Test.java`

RULES:
- Extend `com.company.api.automation.core.base.BaseTest`
- Initialize endpoint in `@BeforeClass` (NOT `@BeforeMethod`)
- Test method naming: `{action}_{scenario}_{expectedResult}`
  - CORRECT: `createUser_missingEmail_returns400`
  - WRONG: `testCreateUserWithMissingEmail`
- `SoftAssert` is MANDATORY in every `@Test` — always end with `soft.assertAll()`
- Call `SchemaValidator.validate(response, "{resource}-schema.json")` on the happy-path test
- Deserialize body: `{Resource}Response body = response.as({Resource}Response.class)`
- Use `ExtentTestManager.logPass/logInfo` after key assertions
- Cleanup: override `methodTeardown()` — do NOT add a separate `@AfterMethod cleanup()`
- All imports fully qualified (no wildcards except static)
- Collect all negative/boundary scenarios into one `@DataProvider`

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

File: `src/test/resources/schemas/{resource}-schema.json`

RULES:
- Use JSON Schema draft-07: `"$schema": "http://json-schema.org/draft-07/schema#"`
- List ALL guaranteed response fields in `"required"`
- Use `"additionalProperties": false` for strict contract enforcement
- Optional fields that can be null: `"type": ["string", "null"]`
- Date-time fields: `"format": "date-time"`
- Enum fields: `"enum": ["val1", "val2"]`

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

File: `src/test/resources/testsuites/{module}-suite.xml`

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

Add to `src/test/resources/config/api.properties`:
```properties
api.path.{resources}=/{api-path-extracted-from-curl}
```
