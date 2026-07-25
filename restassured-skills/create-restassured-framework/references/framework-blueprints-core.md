# Framework Blueprints — Core Classes

Reference file for `/create-restassured-framework`. Contains verbatim blueprints for the 6 core files (framework files 1–6). Substitute project values per Phase 2 rules before generating.

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
