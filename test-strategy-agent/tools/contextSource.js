// Layer 3 Tool — build a normalized issue object from pasted requirement/context text.
// Mirrors the shape of jiraClient.normalizeIssue so generateStrategy/renderMarkdown work unchanged.
// No external creds required — this is the GROQ-only source path.

function firstLine(text) {
  const line = (text || '')
    .split('\n')
    .map((l) => l.trim())
    .find((l) => l.length > 0);
  return line ? line.slice(0, 120) : '';
}

export function issueFromContext(context) {
  const text = (context || '').trim();
  return {
    key: 'REQ',
    summary: firstLine(text) || 'Requirement-based Test Strategy',
    description: text,
    issueType: 'Requirement',
    status: 'N/A',
    priority: 'Unspecified',
    components: [],
    labels: [],
    fixVersions: [],
    reporter: 'N/A',
    assignee: null,
  };
}
