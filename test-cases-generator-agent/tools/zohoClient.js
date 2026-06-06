// Layer 3 Tool — Zoho Sprints item fetch + normalize. Atomic, deterministic.
// Normalizes to the SAME shape as jiraClient.normalizeIssue so the domain core
// (testCases.js) stays tracker-agnostic.
//
// NOTE (B.L.A.S.T. self-anneal): Zoho Sprints REST shapes vary by account/version.
// This client targets the common item endpoint and parses defensively. Verify with
// `npm run handshake <ITEM-ID>` against live creds; if the shape differs, patch the
// field mapping here and record the learning in architecture/tracker-fetch.md.

// Strip simple HTML so descriptions render as readable plain text.
function stripHtml(html) {
  if (!html || typeof html !== 'string') return '';
  return html
    .replace(/<\s*br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li|h[1-6])\s*>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// Pick the first present value across a list of candidate keys (Zoho naming drifts).
function pick(obj, keys, def = '') {
  for (const k of keys) {
    const v = obj?.[k];
    if (v !== undefined && v !== null && String(v).trim() !== '') return v;
  }
  return def;
}

export function normalizeItem(raw) {
  // Zoho often wraps the item; unwrap common containers.
  const item = raw?.item || raw?.itemJObj || (Array.isArray(raw?.items) ? raw.items[0] : raw) || raw;

  const descRaw = pick(item, ['description', 'desc', 'itemDescription', 'content'], '');

  return {
    key: String(pick(item, ['itemNo', 'item_no', 'key', 'id', 'itemId'], 'ZOHO')),
    summary: String(pick(item, ['name', 'title', 'itemName', 'summary'], '')),
    description: stripHtml(String(descRaw)),
    issueType: String(pick(item, ['itemType', 'type', 'itemTypeName'], 'Item')),
    status: String(pick(item, ['statusName', 'status', 'statusType'], 'Unknown')),
    priority: String(pick(item, ['priorityName', 'priority'], 'Unspecified')),
    components: [].concat(pick(item, ['modules', 'components'], [])).map(String).filter(Boolean),
    labels: [].concat(pick(item, ['tags', 'labels'], [])).map(String).filter(Boolean),
    fixVersions: [].concat(pick(item, ['releases', 'fixVersions'], [])).map(String).filter(Boolean),
    reporter: String(pick(item, ['createdByName', 'reporter', 'addedByName'], 'Unknown')),
    assignee: (() => {
      const a = pick(item, ['assigneeName', 'assignee', 'ownerName'], '');
      return a ? String(a) : null;
    })(),
  };
}

export async function fetchItem(config, itemId) {
  const base = (config.zohoUrl || '').trim().replace(/\/+$/, '');
  if (!base) throw new Error('Missing Zoho base URL');
  if (!config.zohoToken) throw new Error('Missing Zoho token / API key');
  if (!itemId) throw new Error('Missing Zoho item ID');

  // Common Zoho Sprints item endpoint. Adjust in this file if your account differs.
  const url = `${base}/item/${encodeURIComponent(itemId)}/`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Zoho-oauthtoken ${config.zohoToken}`,
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Zoho ${res.status} fetching ${itemId}: ${body.slice(0, 300)}`);
  }

  const data = await res.json().catch(() => {
    throw new Error('Zoho did not return JSON (check base URL / token type)');
  });
  return normalizeItem(data);
}
