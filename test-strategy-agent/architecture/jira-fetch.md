# SOP — Jira Fetch (Layer 1)

> Parent tool: `tools/jiraClient.js`. The Golden Rule: if the logic changes, update this SOP
> **before** the code.

## Goal
Fetch a single Jira Cloud issue by ID and normalize it into the shape `testStrategy.js` consumes.

## Inputs
- `config`: `{ jiraUrl, jiraEmail, jiraToken }`
- `jiraId`: issue key, e.g. `TICKET-ID-101`

## Logic
1. Trim trailing slashes from `jiraUrl`; require URL, email, token, and id (throw clear errors).
2. Build `GET {base}/rest/api/3/issue/{id}?fields=summary,description,issuetype,status,priority,labels,components,fixVersions,reporter,assignee`.
3. Auth header: `Basic base64(email:token)`; `Accept: application/json`.
4. On non-2xx, throw `Jira {status} fetching {id}: {body snippet}`.
5. `normalizeIssue`: map fields; flatten the ADF `description` to plain text via `flattenAdf`
   (recursively walk the node tree, inserting newlines around block-level nodes).

## Output (normalized issue)
`{ key, summary, description, issueType, status, priority, components[], labels[],
fixVersions[], reporter, assignee }`

## Edge cases / learnings
- `description` may be a plain string on some instances — handle both string and ADF.
- Collapse 3+ newlines to 2 to keep flattened text readable.
- Browser → Jira is blocked by CORS; always call through the proxy / serverless function.
