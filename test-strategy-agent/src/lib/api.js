const BASE = '/api';

export async function getConfigStatus() {
  const r = await fetch(`${BASE}/config`);
  if (!r.ok) throw new Error('Failed to load config');
  return r.json();
}

export async function generateStrategy(jiraId, config) {
  const r = await fetch(`${BASE}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jiraId, config }),
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data.error || 'Generation failed');
  return data;
}

export async function generateFromContext(context, config) {
  const r = await fetch(`${BASE}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ context, config }),
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data.error || 'Generation failed');
  return data;
}

export async function saveStrategy(id, markdown) {
  const r = await fetch(`${BASE}/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, markdown }),
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data.error || 'Save failed');
  return data;
}
