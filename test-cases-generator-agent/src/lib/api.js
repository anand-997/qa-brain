const BASE = '/api';

export async function getConfigStatus() {
  const r = await fetch(`${BASE}/config`);
  if (!r.ok) throw new Error('Failed to load config');
  return r.json();
}

// Generate test cases from a tracker ID (Jira/Zoho) or pasted requirement context.
export async function generateTestCases({ id, context, config, idPrefix, priorityFocus }) {
  const r = await fetch(`${BASE}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, context, config, idPrefix, priorityFocus }),
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data.error || 'Generation failed');
  return data;
}

export async function saveTestCases(id, markdown, csv) {
  const r = await fetch(`${BASE}/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, markdown, csv }),
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data.error || 'Save failed');
  return data;
}
