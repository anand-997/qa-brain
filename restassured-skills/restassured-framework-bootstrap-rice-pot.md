# REST Assured Framework Bootstrap — RICE-POT Prompt (Self-Contained)

## How to Use

1. Copy **everything inside the fenced block below** (the full RICE-POT prompt).
2. Paste it into your AI tool (Claude, ChatGPT, Copilot, etc.).
3. The AI will first **interview you** with a short set of questions.
4. Answer each question, then the AI will generate your complete, ready-to-use framework.

> **Tip for teams:** No extra files needed — this prompt is fully self-contained.
> Do not skip the interview. The AI will not generate any code until all questions are answered.

---

## The Prompt — Copy Everything Below This Line

````
### R — Role
You are a senior Java test automation architect with 15+ years of experience building
REST Assured + TestNG + Maven frameworks for enterprise QA teams.
You must follow the exact architecture and class implementations provided in the
Context section (§ Blueprint) — do not deviate from those blueprints.

---

### I — Instructions

#### PHASE 1 — Interview (complete ALL questions BEFORE writing any code)

Ask the user each question below, one block at a time. Wait for their answers.
Do NOT generate any code or file until every question is answered.

**Q1 — Project identity**
- What is your company or project name?
  (Used for Maven groupId, Java package root, and report title.)

**Q2 — Application / module under test**
- What is the name of the application or API module being tested?
  (Used for Maven artifactId and test folder names. e.g. "user-service", "payment-api")

**Q3 — Environment URLs**
- Provide the base API URL for each environment you use.
  At minimum: dev and qa. Example:
    dev  → https://api-dev.example.com
    qa   → https://api-qa.example.com
    uat  → https://api-uat.example.com  (optional)
    prod → https://api.example.com      (optional)
  If you only have one URL right now, provide it and label the environment.

**Q4 — Authentication**
- Do your APIs require authentication? (yes / no)
  If YES → Which type?
    a) Bearer token (OAuth2 / JWT) — provide: auth endpoint URL, request body
       format, and JSON path to the token in the response.
    b) API key header — provide: header name (e.g. "X-Api-Key") and whether
       the value comes from a property file or a CI environment variable.
    c) Basic Auth — provide nothing extra; framework will use basic auth helper.
  If NO → the framework is generated with unauthenticated specs only.
  Auth wiring can be added later; a TODO comment will mark the location.

**Q5 — Java version**
- Which Java version does your project use? (default: 11)
  Any Maven version constraint? (default: none)

**Q6 — Package prefix**
- Do you want a custom Java package prefix?
  Default: com.{company}.api.automation
  Override example: org.myorg.tests.api

**Q7 — Seed endpoints for smoke tests**
- Provide 2 API endpoint paths to seed the smoke test suite.
  These must be GET endpoints that return HTTP 200.
  Example:  /users   and   /products
  If you have no real endpoints yet, type: PLACEHOLDER
  The AI will generate REPLACE_ME stubs with TODO comments.

---

#### PHASE 2 — Framework Generation (only after Phase 1 is complete)

Using the answers from Phase 1 and the blueprints in § Context, generate
the complete framework — every file listed below, no exceptions.

**Substitution rules**
- Replace `com.company.api.automation` with the package prefix from Q6.
- Replace `api-automation-framework` with the artifactId from Q2.
- Replace `com.company` (groupId) with the value derived from Q1.
- Replace `Company` / `company` in report titles and class names with the Q1 value.
- Substitute all environment URLs from Q3 into environments/*.properties.
- If Q4 = yes: generate full TokenManager body and populate auth.properties;
  use getAuthRequestSpec() in endpoint methods.
- If Q4 = no: use getRequestSpec() in endpoint methods; add exactly one comment
  in BaseAPI: `// TODO: wire authentication when required`.
- If Q7 = PLACEHOLDER: use `/REPLACE_ME_ENDPOINT_1` and `/REPLACE_ME_ENDPOINT_2`
  with a `// TODO: replace with real endpoint path` comment on each occurrence.

**Files to generate — all 29, in this order**

Core (src/main/java/…/core/):
  1.  pom.xml
  2.  core/config/ConfigManager.java
  3.  core/base/BaseAPI.java
  4.  core/base/BaseTest.java
  5.  core/utils/TokenManager.java          ← stub with TODO if no auth
  6.  core/utils/RequestResponseCapture.java
  7.  core/utils/SchemaValidator.java
  8.  core/utils/RandomDataGenerator.java
  9.  core/utils/ExtentTestManager.java
  10. core/utils/JsonUtils.java
  11. core/listeners/TestListener.java
  12. core/listeners/RetryAnalyzer.java
  13. core/listeners/RetryTransformer.java

Endpoints & models (src/main/java/…/):
  14. endpoints/SmokeEndpoints.java         ← two GET methods using paths from Q7
  15. models/response/SmokeResponse.java    ← minimal POJO: id (String), status (String)

Config (src/test/resources/):
  16. config/config.properties
  17. config/api.properties                 ← include the two smoke paths as properties
  18. config/auth.properties                ← populate if auth required; gitignored otherwise
  19. config/data.properties
  20. environments/dev.properties
  21. environments/qa.properties
  22. environments/uat.properties
  23. environments/prod.properties

Logging:
  24. src/main/resources/log4j2.xml

TestNG suites (src/test/resources/testsuites/):
  25. smoke-api-suite.xml
  26. regression-api-suite.xml

Test class (src/test/java/…/tests/smoke/):
  27. SmokeTest.java                        ← 2 @Test methods (see smoke rules below)

Schema (src/test/resources/schemas/):
  28. smoke-response-schema.json

Misc:
  29. .gitignore

**Smoke test rules — mandatory for both @Test methods in SmokeTest.java**
  - groups = {"smoke"}
  - description annotation describes what the test validates
  - SoftAssert soft = new SoftAssert() at the top
  - Call SmokeEndpoints method → returns Response
  - captureRequest() called inside endpoint BEFORE the HTTP call
  - captureResponse() called inside endpoint AFTER the HTTP call
  - soft.assertEquals(response.getStatusCode(), 200, "Status code")
  - SchemaValidator.validate(response, "smoke-response-schema.json")
  - SmokeResponse body = response.as(SmokeResponse.class)
  - soft.assertNotNull(body, "Response body must not be null")
  - ExtentTestManager.logPass("…") on success path
  - soft.assertAll() as the LAST line
  - @AfterMethod overrides methodTeardown() and calls super.methodTeardown()

**End of generation — output a checklist**
After all 29 files, output a markdown checklist titled "Generated Files Checklist"
listing every file path as an unchecked [ ] item.

---

Do NOT:
- Generate any code before Phase 1 is complete.
- Invent URLs, credentials, endpoint paths, field names, or error codes.
- Use ThreadLocal for RequestSpecification (BaseAPI specs are immutable; given().spec() copies them).
- Add a separate @AfterMethod cleanup() — always override methodTeardown().
- Use testXxx-style method names — always use {action}_{scenario}_{result} format.
- Skip soft.assertAll() at the end of any @Test method.
- Skip captureRequest()/captureResponse() in any endpoint method.
- Omit the Generated Files Checklist.

---

### C — Context (§ Blueprint)

Stack: Java 11 | RestAssured 5.4.0 | TestNG 7.10.2 | ExtentReports 5.1.2 | Log4j2 2.23.1
Pattern: Endpoint → Model → Service + Listener-based Reporting

Use every class below verbatim (substituting project values per Phase 2 rules).

---

#### pom.xml blueprint

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.company</groupId>
    <artifactId>api-automation-framework</artifactId>
    <version>1.0.0</version>
    <packaging>jar</packaging>
    <name>API Automation Framework</name>
    <properties>
        <java.version>11</java.version>
        <maven.compiler.source>${java.version}</maven.compiler.source>
        <maven.compiler.target>${java.version}</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <restassured.version>5.4.0</restassured.version>
        <testng.version>7.10.2</testng.version>
        <jackson.version>2.17.2</jackson.version>
        <lombok.version>1.18.34</lombok.version>
        <extentreports.version>5.1.2</extentreports.version>
        <log4j.version>2.23.1</log4j.version>
        <slf4j.version>2.0.13</slf4j.version>
        <javafaker.version>1.0.2</javafaker.version>
        <assertj.version>3.26.3</assertj.version>
        <hamcrest.version>2.2</hamcrest.version>
        <commons-lang3.version>3.14.0</commons-lang3.version>
        <commons-io.version>2.16.1</commons-io.version>
        <poi.version>5.2.5</poi.version>
        <maven-compiler-plugin.version>3.13.0</maven-compiler-plugin.version>
        <maven-surefire-plugin.version>3.2.5</maven-surefire-plugin.version>
        <suiteXmlFile>src/test/resources/testsuites/smoke-api-suite.xml</suiteXmlFile>
        <env>dev</env>
    </properties>
    <dependencies>
        <dependency><groupId>io.rest-assured</groupId><artifactId>rest-assured</artifactId><version>${restassured.version}</version></dependency>
        <dependency><groupId>io.rest-assured</groupId><artifactId>json-schema-validator</artifactId><version>${restassured.version}</version></dependency>
        <dependency><groupId>org.testng</groupId><artifactId>testng</artifactId><version>${testng.version}</version></dependency>
        <dependency><groupId>com.fasterxml.jackson.core</groupId><artifactId>jackson-databind</artifactId><version>${jackson.version}</version></dependency>
        <dependency><groupId>com.fasterxml.jackson.core</groupId><artifactId>jackson-annotations</artifactId><version>${jackson.version}</version></dependency>
        <dependency><groupId>com.fasterxml.jackson.datatype</groupId><artifactId>jackson-datatype-jsr310</artifactId><version>${jackson.version}</version></dependency>
        <dependency><groupId>org.projectlombok</groupId><artifactId>lombok</artifactId><version>${lombok.version}</version><scope>provided</scope></dependency>
        <dependency><groupId>com.aventstack</groupId><artifactId>extentreports</artifactId><version>${extentreports.version}</version></dependency>
        <dependency><groupId>org.apache.logging.log4j</groupId><artifactId>log4j-api</artifactId><version>${log4j.version}</version></dependency>
        <dependency><groupId>org.apache.logging.log4j</groupId><artifactId>log4j-core</artifactId><version>${log4j.version}</version></dependency>
        <dependency><groupId>org.apache.logging.log4j</groupId><artifactId>log4j-slf4j2-impl</artifactId><version>${log4j.version}</version></dependency>
        <dependency><groupId>org.slf4j</groupId><artifactId>slf4j-api</artifactId><version>${slf4j.version}</version></dependency>
        <dependency><groupId>com.github.javafaker</groupId><artifactId>javafaker</artifactId><version>${javafaker.version}</version></dependency>
        <dependency><groupId>org.assertj</groupId><artifactId>assertj-core</artifactId><version>${assertj.version}</version></dependency>
        <dependency><groupId>org.hamcrest</groupId><artifactId>hamcrest</artifactId><version>${hamcrest.version}</version></dependency>
        <dependency><groupId>org.apache.commons</groupId><artifactId>commons-lang3</artifactId><version>${commons-lang3.version}</version></dependency>
        <dependency><groupId>commons-io</groupId><artifactId>commons-io</artifactId><version>${commons-io.version}</version></dependency>
        <dependency><groupId>org.apache.poi</groupId><artifactId>poi-ooxml</artifactId><version>${poi.version}</version></dependency>
    </dependencies>
    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>${maven-compiler-plugin.version}</version>
                <configuration>
                    <source>${java.version}</source>
                    <target>${java.version}</target>
                    <annotationProcessorPaths>
                        <path><groupId>org.projectlombok</groupId><artifactId>lombok</artifactId><version>${lombok.version}</version></path>
                    </annotationProcessorPaths>
                </configuration>
            </plugin>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-surefire-plugin</artifactId>
                <version>${maven-surefire-plugin.version}</version>
                <configuration>
                    <suiteXmlFiles><suiteXmlFile>${suiteXmlFile}</suiteXmlFile></suiteXmlFiles>
                    <systemPropertyVariables><env>${env}</env></systemPropertyVariables>
                    <argLine>-Dfile.encoding=UTF-8</argLine>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

---

#### ConfigManager.java blueprint

```java
package com.company.api.automation.core.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class ConfigManager {
    private static final Logger log = LoggerFactory.getLogger(ConfigManager.class);
    private static final Properties props = new Properties();

    static {
        loadFile("config/config.properties");
        loadFile("config/api.properties");
        loadFile("config/auth.properties");
        String env = System.getProperty("env", "dev");
        loadFile("environments/" + env + ".properties");
        log.info("ConfigManager initialized for environment: [{}]", env);
    }

    private static void loadFile(String classpathPath) {
        ClassLoader cl = Thread.currentThread().getContextClassLoader();
        try (InputStream in = cl.getResourceAsStream(classpathPath)) {
            if (in != null) {
                props.load(in);
                log.debug("Loaded: {}", classpathPath);
            } else {
                log.debug("Not found on classpath (skipped): {}", classpathPath);
            }
        } catch (IOException e) {
            log.error("Failed to load: {}", classpathPath, e);
            throw new ExceptionInInitializerError("Config load failed: " + classpathPath);
        }
    }

    public static String get(String key) {
        String value = System.getProperty(key, props.getProperty(key));
        if (value == null) log.warn("Property not found: [{}]", key);
        return value;
    }

    public static String get(String key, String defaultValue) {
        String value = System.getProperty(key, props.getProperty(key));
        return value != null ? value.trim() : defaultValue;
    }

    public static int getInt(String key, int defaultValue) {
        String value = get(key);
        if (value == null) return defaultValue;
        try { return Integer.parseInt(value.trim()); }
        catch (NumberFormatException e) {
            log.warn("Cannot parse int for key [{}], value [{}]. Using default: {}", key, value, defaultValue);
            return defaultValue;
        }
    }

    public static boolean getBoolean(String key, boolean defaultValue) {
        String value = get(key);
        return value != null ? Boolean.parseBoolean(value.trim()) : defaultValue;
    }
}
```

---

#### BaseAPI.java blueprint

```java
package com.company.api.automation.core.base;

import com.company.api.automation.core.config.ConfigManager;
import com.company.api.automation.core.utils.TokenManager;
import io.restassured.RestAssured;
import io.restassured.builder.RequestSpecBuilder;
import io.restassured.builder.ResponseSpecBuilder;
import io.restassured.config.HttpClientConfig;
import io.restassured.config.RestAssuredConfig;
import io.restassured.filter.log.LogDetail;
import io.restassured.http.ContentType;
import io.restassured.specification.RequestSpecification;
import io.restassured.specification.ResponseSpecification;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class BaseAPI {
    private static final Logger log = LoggerFactory.getLogger(BaseAPI.class);
    private static final RequestSpecification BASE_REQUEST_SPEC;
    private static final ResponseSpecification BASE_RESPONSE_SPEC;

    static {
        String baseUri  = ConfigManager.get("api.base.uri");
        String basePath = ConfigManager.get("api.base.path", "");
        int connectTimeout = ConfigManager.getInt("api.connect.timeout.ms", 10000);
        int socketTimeout  = ConfigManager.getInt("api.socket.timeout.ms", 30000);
        log.info("BaseAPI init — URI: [{}]  Path: [{}]", baseUri, basePath);
        RestAssuredConfig raConfig = RestAssuredConfig.config()
            .httpClient(HttpClientConfig.httpClientConfig()
                .setParam("http.connection.timeout", connectTimeout)
                .setParam("http.socket.timeout", socketTimeout));
        BASE_REQUEST_SPEC = new RequestSpecBuilder()
            .setBaseUri(baseUri)
            .setBasePath(basePath)
            .setContentType(ContentType.JSON)
            .setAccept(ContentType.JSON)
            .setConfig(raConfig)
            .log(LogDetail.ALL)
            .build();
        BASE_RESPONSE_SPEC = new ResponseSpecBuilder()
            .log(LogDetail.ALL)
            .build();
    }

    // TODO: wire authentication when required
    protected static RequestSpecification getRequestSpec() {
        return RestAssured.given().spec(BASE_REQUEST_SPEC);
    }

    protected static RequestSpecification getAuthRequestSpec() {
        return RestAssured.given()
            .spec(BASE_REQUEST_SPEC)
            .header("Authorization", "Bearer " + TokenManager.getToken());
    }

    protected static RequestSpecification getAuthRequestSpec(String headerName, String headerValue) {
        return RestAssured.given()
            .spec(BASE_REQUEST_SPEC)
            .header(headerName, headerValue);
    }

    protected static ResponseSpecification getResponseSpec() {
        return BASE_RESPONSE_SPEC;
    }
}
```

---

#### BaseTest.java blueprint

```java
package com.company.api.automation.core.base;

import com.company.api.automation.core.config.ConfigManager;
import com.company.api.automation.core.utils.RequestResponseCapture;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testng.annotations.*;

public class BaseTest {
    protected static final Logger log = LoggerFactory.getLogger(BaseTest.class);

    @BeforeSuite(alwaysRun = true)
    public void suiteSetup() {
        log.info("══════════════════════════════════════════");
        log.info("  API AUTOMATION SUITE STARTING");
        log.info("  Environment : {}", System.getProperty("env", "dev"));
        log.info("  Base URI    : {}", ConfigManager.get("api.base.uri", "NOT CONFIGURED"));
        log.info("══════════════════════════════════════════");
    }

    @AfterSuite(alwaysRun = true)
    public void suiteTeardown() {
        log.info("══════════════════════════════════════════");
        log.info("  API AUTOMATION SUITE COMPLETE");
        log.info("══════════════════════════════════════════");
    }

    @BeforeClass(alwaysRun = true)
    public void classSetup() {
        log.info("── Test class: [{}] ──", getClass().getSimpleName());
    }

    @AfterClass(alwaysRun = true)
    public void classTeardown() {
        log.debug("Completed class: {}", getClass().getSimpleName());
    }

    @BeforeMethod(alwaysRun = true)
    public void methodSetup() {
        RequestResponseCapture.clear();
    }

    @AfterMethod(alwaysRun = true)
    public void methodTeardown() {
        RequestResponseCapture.clear();
    }
}
```

---

#### TokenManager.java blueprint

```java
package com.company.api.automation.core.utils;

import com.company.api.automation.core.config.ConfigManager;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Map;
import static io.restassured.RestAssured.given;

public class TokenManager {
    private static final Logger log = LoggerFactory.getLogger(TokenManager.class);
    private static final ThreadLocal<String> threadToken  = new ThreadLocal<>();
    private static volatile String  cachedToken   = null;
    private static volatile long    tokenExpiresAt = 0L;
    private static final Object     LOCK           = new Object();

    private TokenManager() {}

    public static String getToken() {
        if (threadToken.get() != null) return threadToken.get();
        String token = getOrRefresh();
        threadToken.set(token);
        return token;
    }

    public static void invalidate() {
        synchronized (LOCK) { cachedToken = null; tokenExpiresAt = 0L; }
        threadToken.remove();
        log.info("Token cache invalidated");
    }

    public static void clearThreadToken() { threadToken.remove(); }

    private static String getOrRefresh() {
        if (cachedToken != null && System.currentTimeMillis() < tokenExpiresAt) return cachedToken;
        synchronized (LOCK) {
            if (cachedToken == null || System.currentTimeMillis() >= tokenExpiresAt) {
                cachedToken = fetchToken();
                long ttlMs = ConfigManager.getInt("auth.token.ttl.seconds", 3600) * 1000L;
                tokenExpiresAt = System.currentTimeMillis() + ttlMs - 60_000L;
                log.info("Token refreshed — valid for ~{} min", ttlMs / 60_000);
            }
        }
        return cachedToken;
    }

    private static String fetchToken() {
        String authUrl   = ConfigManager.get("auth.url");
        String username  = ConfigManager.get("auth.username");
        String password  = ConfigManager.get("auth.password");
        String tokenPath = ConfigManager.get("auth.token.json.path", "access_token");
        log.debug("Fetching token from: {}", authUrl);
        Response response = given()
            .contentType(ContentType.JSON)
            .body(Map.of("username", username, "password", password))
            .post(authUrl);
        if (response.getStatusCode() != 200)
            throw new RuntimeException("Token fetch failed [HTTP " + response.getStatusCode() + "]: " + response.asString());
        String token = response.jsonPath().getString(tokenPath);
        if (token == null || token.isBlank())
            throw new RuntimeException("Token path [" + tokenPath + "] returned null/empty. Response: " + response.asString());
        return token;
    }
}
```

---

#### RequestResponseCapture.java blueprint

```java
package com.company.api.automation.core.utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.restassured.response.Response;
import java.util.LinkedHashMap;
import java.util.Map;

public class RequestResponseCapture {
    private static final ThreadLocal<String>              method       = new ThreadLocal<>();
    private static final ThreadLocal<String>              url          = new ThreadLocal<>();
    private static final ThreadLocal<String>              payload      = new ThreadLocal<>();
    private static final ThreadLocal<Map<String, String>> headers      = new ThreadLocal<>();
    private static final ThreadLocal<String>              responseBody = new ThreadLocal<>();
    private static final ThreadLocal<Integer>             statusCode   = new ThreadLocal<>();
    private static final ObjectMapper MAPPER = new ObjectMapper();

    private RequestResponseCapture() {}

    public static void captureRequest(String httpMethod, String requestUrl,
                                      Object requestPayload, Map<String, String> requestHeaders) {
        method.set(httpMethod);
        url.set(requestUrl);
        headers.set(requestHeaders != null ? new LinkedHashMap<>(requestHeaders) : new LinkedHashMap<>());
        try {
            payload.set(MAPPER.writerWithDefaultPrettyPrinter().writeValueAsString(requestPayload));
        } catch (Exception e) {
            payload.set(requestPayload != null ? requestPayload.toString() : "");
        }
    }

    public static void captureResponse(Response response) {
        if (response != null) {
            responseBody.set(response.asPrettyString());
            statusCode.set(response.getStatusCode());
        }
    }

    public static String generateCurl() {
        StringBuilder curl = new StringBuilder("curl -X ")
            .append(getMethod()).append(" \"").append(getUrl()).append("\"");
        Map<String, String> hdrs = headers.get();
        if (hdrs != null)
            hdrs.forEach((k, v) -> curl.append(" \\\n  -H \"").append(k).append(": ").append(v).append("\""));
        String body = getPayload();
        if (!body.isBlank()) curl.append(" \\\n  -d '").append(body).append("'");
        return curl.toString();
    }

    public static String  getMethod()       { return orEmpty(method);       }
    public static String  getUrl()          { return orEmpty(url);          }
    public static String  getPayload()      { return orEmpty(payload);      }
    public static String  getResponseBody() { return orEmpty(responseBody); }
    public static int     getStatusCode()   { return statusCode.get() != null ? statusCode.get() : 0; }

    public static void clear() {
        method.remove(); url.remove(); payload.remove();
        headers.remove(); responseBody.remove(); statusCode.remove();
    }

    private static String orEmpty(ThreadLocal<String> tl) { return tl.get() != null ? tl.get() : ""; }
}
```

---

#### SchemaValidator.java blueprint

```java
package com.company.api.automation.core.utils;

import io.restassured.module.jsv.JsonSchemaValidator;
import io.restassured.response.Response;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SchemaValidator {
    private static final Logger log = LoggerFactory.getLogger(SchemaValidator.class);
    private static final String SCHEMA_DIR = "schemas/";

    private SchemaValidator() {}

    public static void validate(Response response, String schemaFile) {
        log.debug("Validating schema: {}", schemaFile);
        response.then().assertThat()
            .body(JsonSchemaValidator.matchesJsonSchemaInClasspath(SCHEMA_DIR + schemaFile));
        log.debug("Schema validation passed: {}", schemaFile);
    }
}
```

---

#### RandomDataGenerator.java blueprint

```java
package com.company.api.automation.core.utils;

import com.github.javafaker.Faker;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;

public class RandomDataGenerator {
    private static final ThreadLocal<Faker> FAKER = ThreadLocal.withInitial(Faker::new);
    private RandomDataGenerator() {}
    private static Faker faker() { return FAKER.get(); }

    public static String fullName()    { return faker().name().fullName();   }
    public static String firstName()   { return faker().name().firstName();  }
    public static String lastName()    { return faker().name().lastName();   }
    public static String username()    { return faker().name().username();   }
    public static String email()       { return faker().internet().emailAddress(); }
    public static String phone()       { return faker().phoneNumber().phoneNumber(); }
    public static String address()     { return faker().address().fullAddress(); }

    public static String uniqueEmail() {
        return "test_" + timestamp() + "_" + faker().number().numberBetween(1000, 9999) + "@automation.com";
    }

    public static String alphanumeric(int length) {
        return faker().regexify("[A-Za-z0-9]{" + length + "}");
    }
    public static int    randomInt(int min, int max) { return faker().number().numberBetween(min, max); }
    public static String uuid()        { return UUID.randomUUID().toString(); }
    public static String companyName() { return faker().company().name(); }
    public static String password()    { return faker().internet().password(10, 20, true, true, true); }

    public static String timestamp() { return new SimpleDateFormat("yyyyMMddHHmmssSSS").format(new Date()); }
    public static String isoDate()   { return new SimpleDateFormat("yyyy-MM-dd").format(new Date()); }
}
```

---

#### ExtentTestManager.java blueprint

```java
package com.company.api.automation.core.utils;

import com.aventstack.extentreports.ExtentTest;
import com.aventstack.extentreports.Status;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ExtentTestManager {
    private static final Logger log = LoggerFactory.getLogger(ExtentTestManager.class);
    static final ThreadLocal<ExtentTest> extentTest = new ThreadLocal<>();
    private ExtentTestManager() {}

    public static void logPass(String message)    { log(Status.PASS,    message); }
    public static void logFail(String message)    { log(Status.FAIL,    message); }
    public static void logInfo(String message)    { log(Status.INFO,    message); }
    public static void logWarning(String message) { log(Status.WARNING, message); }

    private static void log(Status status, String message) {
        ExtentTest test = extentTest.get();
        if (test != null) test.log(status, message);
        else log.warn("ExtentTest not set for thread [{}] — message dropped: {}",
                Thread.currentThread().getName(), message);
    }

    static void set(ExtentTest test) { extentTest.set(test); }
    static void clear()              { extentTest.remove();  }
}
```

---

#### JsonUtils.java blueprint

```java
package com.company.api.automation.core.utils;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class JsonUtils {
    private static final Logger log = LoggerFactory.getLogger(JsonUtils.class);
    private static final ObjectMapper MAPPER = new ObjectMapper()
        .enable(SerializationFeature.INDENT_OUTPUT);

    private JsonUtils() {}

    public static String prettify(String json) {
        try {
            JsonNode node = MAPPER.readTree(json);
            return MAPPER.writeValueAsString(node);
        } catch (Exception e) {
            log.warn("Could not prettify JSON: {}", e.getMessage());
            return json;
        }
    }

    public static <T> T fromJson(String json, Class<T> clazz) {
        try { return MAPPER.readValue(json, clazz); }
        catch (Exception e) { throw new RuntimeException("JSON parse failed: " + e.getMessage(), e); }
    }

    public static String toJson(Object obj) {
        try { return MAPPER.writeValueAsString(obj); }
        catch (Exception e) { throw new RuntimeException("JSON write failed: " + e.getMessage(), e); }
    }
}
```

---

#### TestListener.java blueprint

```java
package com.company.api.automation.core.listeners;

import com.aventstack.extentreports.ExtentReports;
import com.aventstack.extentreports.ExtentTest;
import com.aventstack.extentreports.Status;
import com.aventstack.extentreports.markuputils.CodeLanguage;
import com.aventstack.extentreports.markuputils.MarkupHelper;
import com.aventstack.extentreports.reporter.ExtentSparkReporter;
import com.aventstack.extentreports.reporter.configuration.Theme;
import com.company.api.automation.core.config.ConfigManager;
import com.company.api.automation.core.utils.ExtentTestManager;
import com.company.api.automation.core.utils.RequestResponseCapture;
import org.testng.*;
import java.text.SimpleDateFormat;
import java.util.Date;

public class TestListener implements ITestListener, ISuiteListener {
    private static volatile ExtentReports extentReports;

    @Override
    public synchronized void onStart(ISuite suite) {
        String env = System.getProperty("env", "dev");
        String timestamp = new SimpleDateFormat("yyyy-MM-dd_HH-mm-ss").format(new Date());
        String reportPath = "reports/API_Report_" + env.toUpperCase() + "_" + timestamp + ".html";
        ExtentSparkReporter spark = new ExtentSparkReporter(reportPath);
        spark.config().setTheme(Theme.DARK);
        spark.config().setDocumentTitle("API Automation Report");
        spark.config().setReportName("API Tests — " + env.toUpperCase());
        spark.config().setTimeStampFormat("yyyy-MM-dd HH:mm:ss");
        extentReports = new ExtentReports();
        extentReports.attachReporter(spark);
        extentReports.setSystemInfo("Environment", env.toUpperCase());
        extentReports.setSystemInfo("Base URI",    ConfigManager.get("api.base.uri", "N/A"));
        extentReports.setSystemInfo("Java",        System.getProperty("java.version"));
        extentReports.setSystemInfo("OS",          System.getProperty("os.name"));
        extentReports.setSystemInfo("Suite",       suite.getName());
    }

    @Override
    public synchronized void onFinish(ISuite suite) {
        if (extentReports != null) extentReports.flush();
    }

    @Override public void onStart(ITestContext context)  {}
    @Override public void onFinish(ITestContext context) {}

    @Override
    public void onTestStart(ITestResult result) {
        String description = result.getMethod().getDescription();
        String testName = (description != null && !description.isBlank())
            ? description : result.getMethod().getMethodName();
        ExtentTest test = extentReports.createTest(
            result.getTestClass().getRealClass().getSimpleName() + " ➜ " + testName);
        String[] groups = result.getMethod().getGroups();
        if (groups != null && groups.length > 0) test.assignCategory(groups);
        ExtentTestManager.set(test);
    }

    @Override
    public void onTestSuccess(ITestResult result) {
        ExtentTest test = ExtentTestManager.extentTest.get();
        if (test != null) test.log(Status.PASS, "PASSED");
        ExtentTestManager.clear();
    }

    @Override
    public void onTestFailure(ITestResult result) {
        ExtentTest test = ExtentTestManager.extentTest.get();
        if (test == null) { ExtentTestManager.clear(); return; }
        test.log(Status.FAIL,
            "<b>Class:</b> "  + result.getTestClass().getRealClass().getName() + "<br>" +
            "<b>Method:</b> " + result.getMethod().getMethodName());
        if (result.getThrowable() != null) test.fail(result.getThrowable());
        attachApiDetails(test);
        ExtentTestManager.clear();
    }

    @Override
    public void onTestSkipped(ITestResult result) {
        ExtentTest test = ExtentTestManager.extentTest.get();
        if (test != null) {
            String reason = result.getThrowable() != null ? result.getThrowable().getMessage() : "Skipped";
            test.log(Status.SKIP, reason);
        }
        ExtentTestManager.clear();
    }

    private void attachApiDetails(ExtentTest test) {
        String httpMethod   = RequestResponseCapture.getMethod();
        String url          = RequestResponseCapture.getUrl();
        String requestBody  = RequestResponseCapture.getPayload();
        String responseBody = RequestResponseCapture.getResponseBody();
        int    code         = RequestResponseCapture.getStatusCode();
        String curl         = RequestResponseCapture.generateCurl();
        if (!url.isBlank())          test.fail("<b>Request:</b> " + httpMethod + " " + url);
        if (!requestBody.isBlank())  { test.fail("Request Payload:"); test.fail(MarkupHelper.createCodeBlock(requestBody, CodeLanguage.JSON)); }
        if (!responseBody.isBlank()) { test.fail("Response [HTTP " + code + "]:"); test.fail(MarkupHelper.createCodeBlock(responseBody, CodeLanguage.JSON)); }
        if (!curl.isBlank())         { test.fail("Reproduce with cURL:"); test.fail(MarkupHelper.createCodeBlock(curl, CodeLanguage.XML)); }
    }
}
```

---

#### RetryAnalyzer.java blueprint

```java
package com.company.api.automation.core.listeners;

import com.company.api.automation.core.config.ConfigManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testng.IRetryAnalyzer;
import org.testng.ITestResult;

public class RetryAnalyzer implements IRetryAnalyzer {
    private static final Logger log = LoggerFactory.getLogger(RetryAnalyzer.class);
    private static final int MAX_RETRIES = ConfigManager.getInt("retry.max.count", 2);
    private int attempt = 0;

    @Override
    public boolean retry(ITestResult result) {
        if (!ConfigManager.getBoolean("retry.enabled", true)) return false;
        if (attempt < MAX_RETRIES) {
            attempt++;
            log.warn("Retrying [{}/{}]: {}", attempt, MAX_RETRIES, result.getMethod().getMethodName());
            return true;
        }
        return false;
    }
}
```

---

#### RetryTransformer.java blueprint

```java
package com.company.api.automation.core.listeners;

import org.testng.IAnnotationTransformer;
import org.testng.annotations.ITestAnnotation;
import java.lang.reflect.Constructor;
import java.lang.reflect.Method;

public class RetryTransformer implements IAnnotationTransformer {
    @Override
    public void transform(ITestAnnotation annotation, Class testClass,
                          Constructor testConstructor, Method testMethod) {
        annotation.setRetryAnalyzer(RetryAnalyzer.class);
    }
}
```

---

#### Configuration files blueprint

```properties
# config/config.properties
api.connect.timeout.ms=10000
api.socket.timeout.ms=30000
retry.enabled=true
retry.max.count=2
report.title=API Automation Report

# config/api.properties
api.base.path=/api/v1
api.path.smoke.endpoint1=/REPLACE_ME_ENDPOINT_1
api.path.smoke.endpoint2=/REPLACE_ME_ENDPOINT_2

# config/auth.properties  (gitignored — populate only if auth is required)
auth.url=REPLACE_ME
auth.username=REPLACE_ME
auth.password=REPLACE_ME
auth.token.json.path=access_token
auth.token.ttl.seconds=3600

# config/data.properties
testdata.users=testdata/users.json
testdata.products=testdata/products.json

# environments/dev.properties
api.base.uri=REPLACE_ME_DEV_URL
retry.enabled=true

# environments/qa.properties
api.base.uri=REPLACE_ME_QA_URL
retry.enabled=true

# environments/uat.properties
api.base.uri=REPLACE_ME_UAT_URL
retry.enabled=false

# environments/prod.properties
api.base.uri=REPLACE_ME_PROD_URL
retry.enabled=false
retry.max.count=0
api.connect.timeout.ms=5000
api.socket.timeout.ms=15000
```

---

#### log4j2.xml blueprint

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Configuration status="WARN">
    <Properties>
        <Property name="logDir">logs</Property>
        <Property name="pattern">%d{yyyy-MM-dd HH:mm:ss.SSS} [%t] %-5level %-40logger{40} — %msg%n</Property>
    </Properties>
    <Appenders>
        <Console name="Console" target="SYSTEM_OUT">
            <PatternLayout pattern="${pattern}"/>
        </Console>
        <RollingFile name="FileAppender"
                     fileName="${logDir}/api-automation.log"
                     filePattern="${logDir}/archived/api-automation-%d{yyyy-MM-dd}-%i.log.gz">
            <PatternLayout pattern="${pattern}"/>
            <Policies>
                <TimeBasedTriggeringPolicy interval="1" modulate="true"/>
                <SizeBasedTriggeringPolicy size="20MB"/>
            </Policies>
            <DefaultRolloverStrategy max="15"/>
        </RollingFile>
    </Appenders>
    <Loggers>
        <Logger name="com.company.api.automation" level="DEBUG" additivity="false">
            <AppenderRef ref="Console"/>
            <AppenderRef ref="FileAppender"/>
        </Logger>
        <Logger name="io.restassured" level="WARN" additivity="false">
            <AppenderRef ref="FileAppender"/>
        </Logger>
        <Root level="INFO">
            <AppenderRef ref="Console"/>
            <AppenderRef ref="FileAppender"/>
        </Root>
    </Loggers>
</Configuration>
```

---

#### TestNG suite XML blueprints

```xml
<!-- smoke-api-suite.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE suite SYSTEM "https://testng.org/testng-1.0.dtd">
<suite name="Smoke API Suite" parallel="methods" thread-count="5" verbose="1">
    <listeners>
        <listener class-name="com.company.api.automation.core.listeners.TestListener"/>
        <listener class-name="com.company.api.automation.core.listeners.RetryTransformer"/>
    </listeners>
    <test name="Smoke Tests">
        <groups><run><include name="smoke"/></run></groups>
        <packages><package name="com.company.api.automation.tests"/></packages>
    </test>
</suite>
```

```xml
<!-- regression-api-suite.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE suite SYSTEM "https://testng.org/testng-1.0.dtd">
<suite name="Regression API Suite" parallel="classes" thread-count="10" verbose="1">
    <listeners>
        <listener class-name="com.company.api.automation.core.listeners.TestListener"/>
        <listener class-name="com.company.api.automation.core.listeners.RetryTransformer"/>
    </listeners>
    <test name="Smoke Tests">
        <packages><package name="com.company.api.automation.tests.smoke"/></packages>
    </test>
</suite>
```

---

#### .gitignore blueprint

```gitignore
target/
build/
.idea/
*.iml
.vscode/
.settings/
.project
.classpath
reports/
test-output/
logs/
*.log
archived/
src/test/resources/config/auth.properties
*.local.properties
.env
.DS_Store
Thumbs.db
```

---

### E — Example

**Sample Phase 1 answers:**
  Q1: Acme Corp
  Q2: inventory-api
  Q3: dev → https://api-dev.acme.com  |  qa → https://api-qa.acme.com
  Q4: no (no authentication)
  Q5: Java 11, no Maven constraint
  Q6: (use default) → com.acme.api.automation
  Q7: /inventory/items   and   /inventory/categories

**Expected SmokeEndpoints.java snippet:**

```java
public class SmokeEndpoints extends BaseAPI {
    private static final String ENDPOINT_1 = ConfigManager.get("api.path.smoke.endpoint1", "/inventory/items");
    private static final String ENDPOINT_2 = ConfigManager.get("api.path.smoke.endpoint2", "/inventory/categories");

    public Response getEndpoint1() {
        RequestResponseCapture.captureRequest("GET", ENDPOINT_1, null, null);
        Response resp = getRequestSpec().get(ENDPOINT_1);
        RequestResponseCapture.captureResponse(resp);
        return resp;
    }

    public Response getEndpoint2() {
        RequestResponseCapture.captureRequest("GET", ENDPOINT_2, null, null);
        Response resp = getRequestSpec().get(ENDPOINT_2);
        RequestResponseCapture.captureResponse(resp);
        return resp;
    }
}
```

**Expected SmokeTest.java snippet:**

```java
@Test(
    description = "GET /inventory/items returns HTTP 200",
    groups = {"smoke"},
    priority = 1
)
public void getEndpoint1_validRequest_returns200() {
    SoftAssert soft = new SoftAssert();

    Response response = smokeEndpoints.getEndpoint1();

    soft.assertEquals(response.getStatusCode(), 200, "Status code");
    SchemaValidator.validate(response, "smoke-response-schema.json");
    SmokeResponse body = response.as(SmokeResponse.class);
    soft.assertNotNull(body, "Response body must not be null");
    ExtentTestManager.logPass("GET /inventory/items returned HTTP 200");

    soft.assertAll();
}
```

---

### P — Parameters

- Output must be deterministic: same Phase 1 answers → same generated framework.
- Every class name, package, property key, and path must be derived from Phase 1 answers.
- Do not invent URLs, credentials, endpoint paths, field names, or error codes.
- Do not assume "typical" API behavior — use only what the user provided.
- If a Phase 1 answer is missing or ambiguous, ask for clarification before generating.
- If information is missing or unclear, respond exactly: "Insufficient information to determine."
- If a detail is inferred, label it: "Inference (low confidence) — confirm before use."
- All generated code must compile against Java 11 with no libraries beyond those in the POM blueprint.
- Max line length: 120 characters. Indentation: 4 spaces.

---

### O — Output

- Format: one fenced Java/XML/JSON/properties code block per file.
- Each block preceded by a single label line:
    **File: src/main/java/com/acme/api/automation/core/config/ConfigManager.java**
- Order: exactly as listed in the "Files to generate" section (1 → 29).
- After all 29 files: a markdown checklist titled "Generated Files Checklist"
  with every file path as an unchecked [ ] item.
- No prose between files — label line → code block → next label line → next code block.

---

### T — Tone

Technical and output-only.
During Phase 1: ask questions in plain numbered list format, one question block at a time.
During Phase 2: no commentary, no explanations — only labeled code blocks followed by the checklist.
````

---

## Recommended Parameters Block (reusable in other prompts)

```
- Output must be deterministic (same input → same output).
- Every assertion must be traceable to a provided input.
- If information is missing or unclear, respond exactly: "Insufficient information to determine."
- If a detail is inferred, label it exactly: "Inference (low confidence)".
- Do not invent features, IDs, APIs, error codes, UI elements, or behavior.
- Do not assume default or "typical" system behavior.
```
