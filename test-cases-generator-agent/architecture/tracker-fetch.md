# SOP — Tracker Fetch (Layer 1)

Parent: `test-cases-generator-agent`. Governs `tools/jiraClient.js`, `tools/zohoClient.js`,
`tools/contextSource.js`. **Golden rule:** if the logic changes, update this SOP *before* the code.

## Goal
Turn a user-supplied requirement source into one **normalized issue object** that the domain
core (`tools/testCases.js`) consumes — regardless of where it came from.

## Inputs (one of)
- **Jira ID** (e.g. `TICKET-ID-101`) + Jira creds → `jiraClient.fetchIssue`.
- **Zoho Sprints item ID** + Zoho creds → `zohoClient.fetchItem`.
- **Plain text / `.txt` / `.md`** requirement → `contextSource.issueFromContext` (no creds).

## Normalized issue shape (the contract)
```json
{ "key": "string", "summary": "string", "description": "string",
  "issueType": "string", "status": "string", "priority": "string",
  "components": ["string"], "labels": ["string"], "fixVersions": ["string"],
  "reporter": "string", "assignee": "string | null" }
```
All three sources MUST emit this exact shape so downstream code is tracker-agnostic.

## Jira logic
- `GET {JIRA_URL}/rest/api/3/issue/{id}?fields=...`, `Authorization: Basic base64(email:token)`.
- Description arrives as **ADF** (Atlassian Document Format) → `flattenAdf` recursively to text.

## Zoho logic
- `GET {ZOHO_URL}/item/{id}/`, `Authorization: Zoho-oauthtoken {token}`.
- Response shapes drift by account/version → `normalizeItem` picks across candidate keys and
  strips HTML from the description.

## Edge cases / learnings
- Browser cannot call Jira/Zoho directly (CORS) → always go through the Express proxy.
- Missing creds → throw a clear `Missing ...` error; the UI gates on `/api/config` presence flags.
- **Zoho is unverified until a live handshake passes.** If the item shape differs, patch the field
  mapping in `zohoClient.normalizeItem` and record the exact endpoint/field names here.
