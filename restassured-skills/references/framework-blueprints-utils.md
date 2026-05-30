# Framework Blueprints — Utility & Listener Classes

Reference file for `/create-restassured-framework`. Contains verbatim blueprints for utility and listener classes (framework files 7–13). Substitute project values per Phase 2 rules before generating.

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
