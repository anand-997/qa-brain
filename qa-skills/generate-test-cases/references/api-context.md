<!--
📌 File: api-context.md
🎯 Purpose: API-specific test case generation patterns and guidance
👤 Intended Users: QA Engineers testing REST APIs, backend services
⚠️ Usage: Referenced by generate-test-cases skill for API feature test generation
-->

# API Test Case Generation — Context & Patterns

## When to Use This Reference
Load this file when the feature under test involves:
- REST API endpoints (new or modified)
- Backend service changes
- Database schema changes
- Third-party integrations
- Authentication / authorization flows (token-based, OAuth, API keys)

---

## API Testing Coverage Checklist

When generating test cases for API changes, always cover:

### 1. Endpoint Coverage
- [ ] All new/modified endpoints have positive test cases
- [ ] Correct HTTP methods (GET, POST, PUT, PATCH, DELETE)
- [ ] Correct request/response content types (application/json, multipart/form-data)
- [ ] Correct base URL and versioning (e.g., `/api/v1/`)

### 2. Status Code Coverage
| Status Code | When to Test |
|-------------|--------------|
| 200 OK | Successful GET |
| 201 Created | Successful POST creating resource |
| 204 No Content | Successful DELETE or PUT with no body |
| 400 Bad Request | Invalid input, missing required fields |
| 401 Unauthorized | No token, expired token |
| 403 Forbidden | Valid token but insufficient permissions |
| 404 Not Found | Resource doesn't exist |
| 409 Conflict | Duplicate resource, constraint violation |
| 422 Unprocessable Entity | Validation failure with valid format |
| 429 Too Many Requests | Rate limiting |
| 500 Internal Server Error | Unhandled exceptions (force if possible) |

### 3. Request Validation
- [ ] Required fields missing → 400 with clear error message
- [ ] Invalid field types (string where int expected) → 400
- [ ] Field exceeds max length/size → 400 or 413
- [ ] Invalid enum values → 400
- [ ] Malformed JSON body → 400
- [ ] Missing Content-Type header → 415

### 4. Authentication & Authorization
- [ ] No token → 401
- [ ] Expired/invalid token → 401
- [ ] Valid token, wrong role → 403
- [ ] Valid token, correct role → 200/201
- [ ] Token in wrong header location → 401

### 5. Data Integrity
- [ ] Response body matches schema (required fields present, correct types)
- [ ] Timestamps in correct format (ISO 8601)
- [ ] IDs are consistent across request and response
- [ ] Pagination parameters work (page, limit, offset)
- [ ] Sorting parameters work

### 6. Integration Points
- [ ] Third-party service success response handled correctly
- [ ] Third-party service failure/timeout handled gracefully
- [ ] Webhook delivery and retry logic (if applicable)

---

## Test Case Scenarios by TRD Change Type

### New Endpoint Added
Generate test cases for:
1. Happy path (correct request → expected response)
2. All required fields missing individually
3. All field validations (ECP + BVA for each field)
4. Authentication scenarios (no auth, invalid auth, correct auth)
5. Response schema validation
6. Idempotency (for POST: does duplicate request cause 409 or 201?)

### Existing Endpoint Modified
Generate test cases for:
1. Changed fields still work correctly
2. Removed fields are no longer accepted (or gracefully ignored)
3. New required fields validated
4. Backward compatibility (old client still works if applicable)
5. Regression: original endpoint behavior preserved

### Rate Limiting Added
Generate test cases using BVA:
- Requests at limit - 1: succeeds
- Requests at limit: succeeds
- Requests at limit + 1: → 429 with retry-after header
- After rate limit window resets: succeeds again

### Authentication Changed
Generate test cases for:
- New auth method works (positive)
- Old auth method rejected (if deprecated)
- Token expiry timing (BVA: expires at N, test at N-1 and N+1 minutes)
- Permission matrix: each role × each endpoint

---

## Output Format for API Test Cases

For API test cases, adapt the standard template as follows:

- **TEST TYPE**: Use `API - Functional`, `API - Security`, `API - Negative`, `API - Schema`
- **TESTING TECHNIQUE**: Match to field type (ECP for enums, BVA for numeric limits)
- **TEST DATA**: Always include:
  - HTTP Method
  - Endpoint URL
  - Request headers (Authorization, Content-Type)
  - Request body (full JSON example)
  - Expected HTTP status code
- **EXPECTED RESULT**: Always include:
  - Expected HTTP status code
  - Expected response body fields
  - Expected error message (for negative cases)

**Example:**
```
TEST CASE ID: TC_API_001
CREATED BY: AI Generated
TEST CASE TITLE: Upload profile picture — valid JPEG within size limit
MODULE/FEATURE: User Profile — Profile Picture Upload
PRIORITY: P0
TEST TYPE: API - Functional
TESTING TECHNIQUE: Functional Testing
CHANGE REFERENCE: Requirement: POST /api/v1/users/{id}/profile-picture

OBJECTIVE:
Verify the endpoint accepts a valid JPEG file under 5MB and returns 201 with the image URL.

TEST DATA:
- Method: POST
- Endpoint: /api/v1/users/123/profile-picture
- Authorization: Bearer <valid_jwt_token>
- Content-Type: multipart/form-data
- File: test_image.jpg (2MB, 800x800px, JPEG)

EXPECTED RESULT:
✓ HTTP 201 Created
✓ Response body contains { "imageUrl": "https://s3.amazonaws.com/..." }
✓ imageUrl is accessible via GET request
✓ Previous profile picture replaced

TEST ENVIRONMENT:
- Browser: N/A (API test)
- OS: Windows 11
- Environment: QA
- Build Version: TBD

NOTES:
- Use Postman or REST Assured for execution
- Verify S3 upload in AWS console for smoke
```

---

## Change Analysis Checklist for API TRDs

When analyzing an API TRD, identify and test:

- [ ] New features or endpoints added
- [ ] Modified request/response schemas
- [ ] Updated business logic or validation rules
- [ ] API versioning changes
- [ ] Authentication/authorization changes
- [ ] Database schema changes (tables, columns, indexes)
- [ ] Third-party integration changes
- [ ] Rate limiting or throttling changes
- [ ] Error handling or validation message changes
- [ ] Deprecated endpoints or fields
- [ ] Data migration requirements
- [ ] Backward compatibility considerations
- [ ] Logging or monitoring changes

---

## Tips for Best API Test Coverage

1. **Focus on changes**: Generate test cases specifically for modifications, not the entire API
2. **Include regression**: Always add regression tests to ensure existing endpoints still work
3. **Trace to TRD**: Reference specific TRD sections in each test case
4. **Test data migration**: If schema changes exist, include migration test cases
5. **Validate rollback**: Include test cases for reverting changes if deployment fails
6. **Security impact**: Analyze if TRD changes introduce security risks (OWASP API Top 10)
7. **Performance impact**: Consider if endpoint changes affect latency or throughput
8. **Backward compatibility**: Verify changes don't break existing API contracts

---

📌 **Last Updated**: December 2025 | **Version**: 2.0
