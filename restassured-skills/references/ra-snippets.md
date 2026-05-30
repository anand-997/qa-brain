# REST Assured Code Snippets

Reference file for `/ra-lookup`. Contains ready-to-use code snippets organized by topic. Return only the section(s) relevant to the user's question.

---

## HTTP Methods

```java
// GET
Response response = given()
    .contentType(ContentType.JSON)
    .when()
    .get("/api/users/123")
    .then()
    .statusCode(200)
    .extract().response();

// POST with body
Response response = given()
    .contentType(ContentType.JSON)
    .body(request)
    .when()
    .post("/api/users")
    .then()
    .statusCode(201)
    .extract().response();

// PUT (update)
Response response = given()
    .contentType(ContentType.JSON)
    .body(updateRequest)
    .pathParam("id", userId)
    .when()
    .put("/api/users/{id}")
    .then()
    .statusCode(200)
    .extract().response();

// DELETE
Response response = given()
    .pathParam("id", userId)
    .when()
    .delete("/api/users/{id}")
    .then()
    .statusCode(204)
    .extract().response();

// PATCH
Response response = given()
    .contentType(ContentType.JSON)
    .body(patchRequest)
    .pathParam("id", userId)
    .when()
    .patch("/api/users/{id}")
    .then()
    .statusCode(200)
    .extract().response();
```

---

## Headers

```java
Response response = given()
    .header("Authorization", "Bearer " + token)
    .header("Custom-Header", "value")
    .contentType(ContentType.JSON)
    .when()
    .get("/api/users")
    .then()
    .extract().response();
```

---

## Query Parameters

```java
Response response = given()
    .queryParam("page", 1)
    .queryParam("limit", 10)
    .queryParam("sort", "name")
    .when()
    .get("/api/users")
    .then()
    .statusCode(200)
    .extract().response();
```

---

## Path Parameters

```java
Response response = given()
    .pathParam("userId", "123")
    .pathParam("orderId", "456")
    .when()
    .get("/api/users/{userId}/orders/{orderId}")
    .then()
    .extract().response();
```

---

## Extract JSON Values

```java
// Single value
String name = response.jsonPath().getString("name");
int age      = response.jsonPath().getInt("age");

// Nested field
String city = response.jsonPath().getString("address.city");

// List
List<String> emails = response.jsonPath().getList("users.email");

// Convert to POJO
UserResponse user = response.as(UserResponse.class);

// Convert to list of POJOs
List<UserResponse> users = Arrays.asList(response.as(UserResponse[].class));
```

---

## Inline Assertions (Hamcrest)

```java
response.then()
    .statusCode(200)
    .body("name", equalTo("John Doe"))
    .body("email", containsString("@example.com"))
    .body("age", greaterThan(18))
    .body("id", notNullValue())
    .body("users", hasSize(10))
    .body("users.name", hasItems("John", "Jane"));
```

---

## Authentication

```java
// Basic Auth
given().auth().basic("username", "password").when().get("/api/secure")

// Bearer Token (OAuth2)
given().auth().oauth2(token).when().get("/api/secure")

// Manual Header
given().header("Authorization", "Bearer " + token).when().get("/api/secure")

// API Key Header
given().header("X-Api-Key", apiKey).when().get("/api/secure")
```

---

## Request / Response Spec (Reusable)

```java
// Build once
RequestSpecification requestSpec = new RequestSpecBuilder()
    .setBaseUri("https://api.example.com")
    .setContentType(ContentType.JSON)
    .addHeader("Authorization", "Bearer " + token)
    .build();

ResponseSpecification responseSpec = new ResponseSpecBuilder()
    .expectStatusCode(200)
    .expectContentType(ContentType.JSON)
    .build();

// Use per call
given()
    .spec(requestSpec)
    .when()
    .get("/api/users")
    .then()
    .spec(responseSpec);
```

---

## Schema Validation

```java
response.then()
    .assertThat()
    .body(matchesJsonSchemaInClasspath("schemas/user-schema.json"));
```

---

## Response Time Assertion

```java
response.then()
    .time(lessThan(2000L)); // Max 2 seconds
```

---

## Logging

```java
// Log everything
given().log().all().when().get("/api/users").then().log().all();

// Log only on failure
given()
    .log().ifValidationFails()
    .when()
    .get("/api/users")
    .then()
    .log().ifError();
```

---

## File Upload (Multipart)

```java
Response response = given()
    .multiPart("file", new File("path/to/file.pdf"))
    .multiPart("description", "Document upload")
    .when()
    .post("/api/upload")
    .then()
    .statusCode(200)
    .extract().response();
```

---

## Form Data

```java
Response response = given()
    .contentType("application/x-www-form-urlencoded")
    .formParam("username", "john")
    .formParam("password", "secret")
    .when()
    .post("/api/login")
    .then()
    .extract().response();
```

---

## Cookie Handling

```java
// Send cookie
given().cookie("sessionId", "abc123").when().get("/api/user")

// Extract cookies
String sessionId = response.getCookie("sessionId");
Map<String, String> cookies = response.getCookies();
```

---

## Filters (Interceptors)

```java
// Global logging filters
RestAssured.filters(new RequestLoggingFilter(), new ResponseLoggingFilter());

// Custom filter
given()
    .filter((reqSpec, resSpec, ctx) -> {
        reqSpec.header("Custom-Header", "value");
        Response response = ctx.next(reqSpec, resSpec);
        return response;
    })
    .when()
    .get("/api/users");
```

---

## Proxy Configuration

```java
given()
    .proxy("proxyhost.com", 8080)
    .when()
    .get("/api/users")
```

---

## Hamcrest Matchers Quick Reference

```java
import static org.hamcrest.Matchers.*;

// Equality
equalTo(value)
not(equalTo(value))

// Strings
containsString("text")
startsWith("text")
endsWith("text")
matchesPattern("regex")

// Numbers
greaterThan(10)
lessThan(100)
greaterThanOrEqualTo(10)
lessThanOrEqualTo(100)

// Collections
hasSize(10)
hasItem("value")
hasItems("val1", "val2")
empty()

// Nullability
notNullValue()
nullValue()

// Logical
anyOf(matcher1, matcher2)
allOf(matcher1, matcher2)
```

---

## Jackson Annotations

```java
import com.fasterxml.jackson.annotation.*;

@JsonProperty("user_name")                      // Map to different JSON field name
private String userName;

@JsonIgnore                                      // Exclude from serialization
private String password;

@JsonInclude(JsonInclude.Include.NON_NULL)       // Only include if not null
private String optionalField;

@JsonFormat(pattern = "yyyy-MM-dd")             // Date formatting
private LocalDate birthDate;

@JsonAlias({"phone", "phoneNumber"})            // Accept multiple JSON field names
private String phone;

@JsonIgnoreProperties(ignoreUnknown = true)     // On class — survive new API fields
public class UserResponse { ... }
```

---

## TestNG Annotations

```java
@BeforeSuite    // Run once before all tests in the suite
@AfterSuite     // Run once after all tests in the suite
@BeforeClass    // Run once before all tests in the class
@AfterClass     // Run once after all tests in the class
@BeforeMethod   // Run before each test method
@AfterMethod    // Run after each test method
@Test           // Test method

// Common @Test attributes
@Test(priority = 1)                                      // Execution order within class
@Test(enabled = false)                                   // Skip test
@Test(dataProvider = "testData")                         // Data-driven test
@Test(groups = {"smoke", "regression"})                  // Group membership
@Test(dependsOnMethods = {"testCreate"})                 // Method dependency
@Test(timeOut = 5000)                                    // Max execution time (ms)
@Test(expectedExceptions = IllegalArgumentException.class) // Expect exception
@Test(description = "Verify user creation returns 201")  // ExtentReports test name
```

---

## Content Types

```java
ContentType.JSON        // application/json
ContentType.XML         // application/xml
ContentType.HTML        // text/html
ContentType.TEXT        // text/plain
ContentType.URLENC      // application/x-www-form-urlencoded
ContentType.MULTIPART   // multipart/form-data
ContentType.BINARY      // application/octet-stream
ContentType.ANY         // */*
```
