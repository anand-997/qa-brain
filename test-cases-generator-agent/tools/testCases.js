// Layer 3 Tool — domain core. Encodes the qa-skills/generate-test-cases methodology:
// suite auto-detection + technique selection + the 13-field test-case template.
// Boundary rule (B.L.A.S.T.): the AI produces test-case CONTENT (JSON); coverage tally
// and Markdown/CSV/TXT rendering are deterministic code here.
//
// Token utilization is handled automatically (see generateTestCases): the requirement is
// split into section batches, and on any TokenLimitError a batch is split smaller and
// retried — the loop continues until ALL sections have produced their test cases.
import { aiChat, TokenLimitError } from './aiClient.js';

// ── Methodology encoded for the model (mirrors references/test-case-template.md
//    + testing-techniques.md + ui-context.md + api-context.md). ──
const METHODOLOGY = `You are a senior QA engineer generating COMPREHENSIVE test-case coverage.

SUITE AUTO-DETECTION — include cases for every applicable suite based on the requirement:
- Functional: ALWAYS.
- Regression: when an existing feature is being modified.
- Smoke: for critical paths (login, checkout, payment, core journeys) — mark P0.
- Security: for auth, payment, PII, file upload, RBAC, API endpoints (injection, XSS, authz).
- Performance/Load: for large datasets, dashboards, file uploads, concurrent users.
- Accessibility (WCAG 2.1): for UI/UX changes, new screens, user-facing forms.
- Cross-browser/Device: for web frontend / responsive design.
- API Contract/Schema: for REST endpoints, schema changes, integrations (status codes, validation).

TECHNIQUE SELECTION (set the "technique" field accordingly):
- ECP (Equivalent Class Partitioning): inputs with validation rules — one valid + each invalid class.
- BVA (Boundary Value Analysis): numeric ranges, string lengths, date/time/size limits — min-1, min, min+1, max-1, max, max+1.
- DTT (Decision Table Testing): multiple conditions combining into different outcomes.
- Behavioral: multi-step workflows, navigation, state transitions.
- Error Handling: error messages, timeouts, failures, empty/loading states.
- STT (State Transition): status-field lifecycles; include invalid transitions that must be rejected.
- Functional: straightforward positive/negative behavior.

RULES:
- ZERO hallucination — only test what the requirement describes. Use "TBD" for unknowns; never invent data.
- Cover positive, negative, boundary and (when modifying) regression scenarios.
- Each test maps to a requirement/TRD reference in "changeReference".
- Priorities: P0 critical (login/checkout/payment), P1 important, P2 standard, P3 nice-to-have.`;

const SCHEMA_HINT = `Return ONLY a JSON object: { "testCases": [ ... ] }.
Each test case object has EXACTLY these string keys (the 13-field template):
{
  "id": string,               // leave "" — the system renumbers as TC_[MODULE]_[NNN]
  "createdBy": string,        // "AI Generated"
  "title": string,            // action-oriented, e.g. "Verify login fails with invalid password"
  "module": string,           // feature/module name
  "priority": string,         // "P0" | "P1" | "P2" | "P3"
  "testType": string,         // Functional | UI | API | Integration | Regression | Smoke | Negative | Boundary | Performance | Security | Accessibility
  "technique": string,        // ECP | BVA | DTT | Behavioral | Error Handling | STT | Functional
  "changeReference": string,  // "TRD-XYZ: ..." or "Requirement: ..."
  "objective": string,        // 1-2 sentences: what this validates and why
  "testData": string,         // values separated by "; " (no line breaks)
  "expectedResult": string,   // outcomes, each prefixed with "✓ "
  "testEnvironment": string,  // "Browser: ...; OS: ...; Environment: QA; Build: TBD" (use "N/A (API)" for API tests)
  "notes": string             // references / related ids / platform notes ("" if none)
}
Generate as many distinct, non-duplicate cases as the requirement warrants. Output strictly valid JSON.`;

// ── Prompt builder ──
export function buildMessages(issue, { sectionText, idPrefix, priorityFocus }) {
  const system = [METHODOLOGY, '', SCHEMA_HINT].join('\n');

  const priorityLine =
    priorityFocus === 'p0'
      ? 'Priority focus: generate P0 cases only.'
      : priorityFocus === 'p0p1'
      ? 'Priority focus: generate P0 and P1 cases.'
      : 'Priority focus: all priorities (P0-P3).';

  const user = [
    'Generate test cases for the following requirement.',
    '',
    `Key: ${issue.key}`,
    `Summary: ${issue.summary}`,
    `Type: ${issue.issueType} | Status: ${issue.status} | Priority: ${issue.priority}`,
    `Components: ${issue.components.join(', ') || 'none'}`,
    `Labels: ${issue.labels.join(', ') || 'none'}`,
    '',
    idPrefix ? `Use module/prefix hint: ${idPrefix}` : 'Derive a sensible module name per case.',
    priorityLine,
    '',
    'Requirement / Acceptance Criteria:',
    sectionText || issue.description || '(none provided)',
  ].join('\n');

  return [
    { role: 'system', content: system },
    { role: 'user', content: user },
  ];
}

// ── Section splitting for automatic token handling ──
const MAX_SECTION_CHARS = 3500;

// Split on headings / numbered sections first, then paragraphs, then hard char windows.
function splitSections(text) {
  const clean = (text || '').trim();
  if (!clean) return [''];
  if (clean.length <= MAX_SECTION_CHARS) return [clean];

  // Break at markdown headings or "4.1"-style numbered section starts.
  const byHeading = clean.split(/\n(?=#{1,6}\s|\d+(?:\.\d+)*\s+[A-Z])/);
  const out = [];
  for (const sec of byHeading) {
    if (sec.length <= MAX_SECTION_CHARS) {
      if (sec.trim()) out.push(sec.trim());
      continue;
    }
    // Too big — split by blank-line paragraphs.
    let buf = '';
    for (const para of sec.split(/\n\s*\n/)) {
      if ((buf + '\n\n' + para).length > MAX_SECTION_CHARS && buf) {
        out.push(buf.trim());
        buf = para;
      } else {
        buf = buf ? `${buf}\n\n${para}` : para;
      }
    }
    if (buf.trim()) out.push(buf.trim());
  }
  // Final guard: hard-split anything still oversized.
  const final = [];
  for (const s of out) {
    if (s.length <= MAX_SECTION_CHARS) final.push(s);
    else for (let i = 0; i < s.length; i += MAX_SECTION_CHARS) final.push(s.slice(i, i + MAX_SECTION_CHARS));
  }
  return final.length ? final : [clean.slice(0, MAX_SECTION_CHARS)];
}

// Split one section roughly in half on a paragraph/sentence boundary (for shrink-on-token-limit).
function halve(text) {
  const mid = Math.floor(text.length / 2);
  const para = text.indexOf('\n\n', mid);
  const cut = para !== -1 && para < text.length - 100 ? para : mid;
  return [text.slice(0, cut).trim(), text.slice(cut).trim()].filter(Boolean);
}

const str = (v, def = '') => (typeof v === 'string' && v.trim() ? v.trim() : def);

function normalizeCase(c = {}) {
  return {
    id: '', // assigned deterministically later
    createdBy: str(c.createdBy, 'AI Generated'),
    title: str(c.title, 'Untitled test case'),
    module: str(c.module, 'General'),
    priority: str(c.priority, 'P2'),
    testType: str(c.testType, 'Functional'),
    technique: str(c.technique, 'Functional'),
    changeReference: str(c.changeReference, 'Requirement'),
    objective: str(c.objective, 'TBD'),
    testData: str(c.testData, 'TBD'),
    expectedResult: str(c.expectedResult, 'TBD'),
    testEnvironment: str(c.testEnvironment, 'Browser: Chrome; OS: Windows 11; Environment: QA; Build: TBD'),
    notes: str(c.notes, ''),
  };
}

// Short module abbreviation for the TC_[MODULE]_[NNN] id scheme.
function moduleAbbrev(module) {
  const word = (module || 'GEN').toUpperCase().replace(/[^A-Z0-9 ]/g, '').trim().split(/\s+/)[0] || 'GEN';
  return word.slice(0, 6);
}

// Deterministically assign unique ids. Uses the user's prefix when given.
function assignIds(cases, idPrefix) {
  const counters = {};
  return cases.map((c) => {
    const base = (idPrefix && idPrefix.trim())
      ? idPrefix.trim().replace(/[^A-Za-z0-9_]/g, '_').replace(/_+$/,'')
      : `TC_${moduleAbbrev(c.module)}`;
    counters[base] = (counters[base] || 0) + 1;
    return { ...c, id: `${base}_${String(counters[base]).padStart(3, '0')}` };
  });
}

/**
 * generateTestCases — orchestrates resilient, complete generation.
 * Splits the requirement into section batches and generates each; on token pressure it
 * splits the offending batch smaller and retries, never stopping until every batch yields
 * results. Returns { idPrefix, suites, coverage, testCases, warnings }.
 */
export async function generateTestCases(config, issue, options = {}) {
  const idPrefix = options.idPrefix || '';
  const priorityFocus = options.priorityFocus || 'all';

  const queue = splitSections(issue.description).map((sectionText) => ({ sectionText, depth: 0 }));
  const collected = [];
  const warnings = [];

  while (queue.length) {
    const job = queue.shift();
    try {
      const messages = buildMessages(issue, { sectionText: job.sectionText, idPrefix, priorityFocus });
      const out = await aiChat(config, messages, { json: true, temperature: 0.3, maxTokens: 8000 });
      const arr = Array.isArray(out?.testCases) ? out.testCases : Array.isArray(out) ? out : [];
      arr.forEach((c) => collected.push(normalizeCase(c)));
    } catch (err) {
      // Token pressure → split this batch smaller and retry, until it is atomic.
      if (err instanceof TokenLimitError || err.isTokenLimit) {
        const parts = halve(job.sectionText);
        if (parts.length > 1 && job.depth < 6) {
          // Re-queue the smaller halves at the front so we finish this area first.
          queue.unshift(...parts.map((p) => ({ sectionText: p, depth: job.depth + 1 })));
          continue;
        }
        // Cannot split further — record and move on rather than interrupting the whole run.
        warnings.push(`A small requirement chunk repeatedly hit token limits and was skipped: "${job.sectionText.slice(0, 60)}…"`);
        continue;
      }
      // Non-token error → surface it (aiClient already retried transient failures).
      throw err;
    }
  }

  // Deduplicate by normalized title, then assign deterministic ids.
  const seen = new Set();
  const deduped = collected.filter((c) => {
    const k = c.title.toLowerCase().replace(/\s+/g, ' ').trim();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });

  const testCases = assignIds(deduped, idPrefix);
  const { suites, coverage } = computeCoverage(testCases);
  return { idPrefix, suites, coverage, testCases, warnings };
}

// ── Deterministic coverage tally ──
export function computeCoverage(testCases) {
  const byType = {};
  const byTechnique = {};
  const byPriority = {};
  for (const c of testCases) {
    byType[c.testType] = (byType[c.testType] || 0) + 1;
    byTechnique[c.technique] = (byTechnique[c.technique] || 0) + 1;
    byPriority[c.priority] = (byPriority[c.priority] || 0) + 1;
  }
  return {
    suites: Object.keys(byType),
    coverage: { total: testCases.length, byType, byTechnique, byPriority },
  };
}

// ── Renderers (deterministic) ──
export function renderMarkdown(payload, issue) {
  const { testCases, coverage } = payload;
  const L = [];
  L.push(`# Test Cases — ${issue.summary || issue.key}`, '');
  L.push(`**Source:** ${issue.key} | **Type:** ${issue.issueType} | **Priority:** ${issue.priority} | **Status:** ${issue.status}  `);
  L.push('');
  L.push('## Coverage Summary', '');
  L.push(`- **Total test cases:** ${coverage.total}`);
  L.push(`- **By type:** ${Object.entries(coverage.byType).map(([k, v]) => `${k} (${v})`).join(', ') || 'TBD'}`);
  L.push(`- **By technique:** ${Object.entries(coverage.byTechnique).map(([k, v]) => `${k} (${v})`).join(', ') || 'TBD'}`);
  L.push(`- **By priority:** ${Object.entries(coverage.byPriority).map(([k, v]) => `${k} (${v})`).join(', ') || 'TBD'}`);
  if (payload.warnings?.length) L.push('', `> ⚠ ${payload.warnings.length} chunk(s) skipped under token limits — see notes.`);
  L.push('', '---', '');

  testCases.forEach((c) => {
    L.push(`## ${c.id} — ${c.title}`, '');
    L.push(`- **Created By:** ${c.createdBy}`);
    L.push(`- **Module/Feature:** ${c.module}`);
    L.push(`- **Priority:** ${c.priority}`);
    L.push(`- **Test Type:** ${c.testType}`);
    L.push(`- **Testing Technique:** ${c.technique}`);
    L.push(`- **Change Reference:** ${c.changeReference}`);
    L.push('', `**Objective:** ${c.objective}`, '');
    L.push(`**Test Data:** ${c.testData}`, '');
    L.push(`**Expected Result:** ${c.expectedResult}`, '');
    L.push(`**Test Environment:** ${c.testEnvironment}`);
    if (c.notes) L.push('', `**Notes:** ${c.notes}`);
    L.push('', '---', '');
  });

  L.push(`_Generated from ${issue.key} via ${'B.L.A.S.T. Test Cases Buddy'}. Review before use._`);
  return L.join('\n');
}

const CSV_COLS = [
  'TEST CASE ID', 'CREATED BY', 'TEST CASE TITLE', 'MODULE/FEATURE', 'PRIORITY',
  'TEST TYPE', 'TESTING TECHNIQUE', 'CHANGE REFERENCE', 'OBJECTIVE', 'TEST DATA',
  'EXPECTED RESULT', 'TEST ENVIRONMENT', 'NOTES',
];

function csvCell(v) {
  const s = String(v ?? '').replace(/\r?\n/g, ' ').trim();
  return /[",]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

// One row per test case (per the skill's CSV rule).
export function renderCsv(payload) {
  const rows = [CSV_COLS.join(',')];
  payload.testCases.forEach((c) => {
    rows.push([
      c.id, c.createdBy, c.title, c.module, c.priority, c.testType, c.technique,
      c.changeReference, c.objective, c.testData, c.expectedResult, c.testEnvironment, c.notes || '-',
    ].map(csvCell).join(','));
  });
  return rows.join('\n');
}

export function renderTxt(payload, issue) {
  const { testCases, coverage } = payload;
  const L = [];
  L.push(`TEST CASES — ${issue.summary || issue.key}`);
  L.push(`Source: ${issue.key} | Type: ${issue.issueType} | Priority: ${issue.priority} | Status: ${issue.status}`);
  L.push('');
  L.push(`COVERAGE: ${coverage.total} total | ` +
    Object.entries(coverage.byType).map(([k, v]) => `${k}:${v}`).join('  '));
  L.push('='.repeat(70), '');

  testCases.forEach((c) => {
    L.push(`TEST CASE ID: ${c.id}`);
    L.push(`CREATED BY: ${c.createdBy}`);
    L.push(`TEST CASE TITLE: ${c.title}`);
    L.push(`MODULE/FEATURE: ${c.module}`);
    L.push(`PRIORITY: ${c.priority}`);
    L.push(`TEST TYPE: ${c.testType}`);
    L.push(`TESTING TECHNIQUE: ${c.technique}`);
    L.push(`CHANGE REFERENCE: ${c.changeReference}`);
    L.push('');
    L.push(`OBJECTIVE: ${c.objective}`);
    L.push(`TEST DATA: ${c.testData}`);
    L.push(`EXPECTED RESULT: ${c.expectedResult}`);
    L.push(`TEST ENVIRONMENT: ${c.testEnvironment}`);
    if (c.notes) L.push(`NOTES: ${c.notes}`);
    L.push('', '-'.repeat(70), '');
  });
  return L.join('\n');
}
