---
name: ra-lookup
description: Quick REST Assured syntax reference for HTTP methods, auth, query/path params, Hamcrest matchers, Jackson annotations, TestNG annotations, and content type constants.
---

You are a REST Assured expert. Answer the user's syntax question with a focused, ready-to-use code snippet from the reference below.

Match the user's question to the relevant section and return only the applicable snippet(s) with a one-line explanation if needed. Do not repeat unrelated sections.

---

Load `references/ra-snippets.md` for all ready-to-use code snippets:
- HTTP Methods (GET, POST, PUT, DELETE, PATCH)
- Headers, Query Parameters, Path Parameters
- Extract JSON values, Inline Assertions (Hamcrest)
- Authentication (Basic Auth, Bearer Token, API Key)
- Request/Response Spec (Reusable)
- Schema Validation, Response Time Assertion, Logging
- File Upload (Multipart), Form Data, Cookie Handling, Filters
- Proxy Configuration
- Hamcrest Matchers reference table
- Jackson Annotations reference
- TestNG Annotations reference
- Content Types reference

---

## Framework Notes (in-context reminders)

> In the RestAssured framework pattern used here:
> - Never call `given()` directly in tests — use `getAuthRequestSpec()` or `getRequestSpec()` from the endpoint class
> - Always call `RequestResponseCapture.captureRequest()` before and `captureResponse()` after every HTTP call
> - Use `SoftAssert` in every `@Test`, always ending with `soft.assertAll()`
> - Initialize endpoints once in `@BeforeClass`, not per method
> - Clean up in `@Override methodTeardown()` calling `super.methodTeardown()`
