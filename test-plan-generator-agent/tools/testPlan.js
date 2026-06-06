// Layer 3 Tool — build the prompt, generate the plan via GROQ, render deterministic Markdown.
// Boundary rule (BLAST): GROQ produces CONTENT (JSON); Markdown rendering is deterministic code.
// 22-section model aligned with RICE_POT_CREATE_TESTPLAN_PROMPT.md.
import { groqChat } from './groqClient.js';

const SCHEMA_HINT = `Return ONLY a JSON object with EXACTLY these keys (22-section formal Test Plan):
{
  "testPlanId": string,                 // e.g. "TP-<KEY>-001"
  "version": string,                    // e.g. "1.0"
  "date": string,                       // creation date or "TBD"
  "sourceIssue": string,                // the Jira key
  "title": string,                      // "Test Plan — <summary>"
  "testingItem": string,                // name + brief description of the system under test
  "objective": string,
  "scope": { "inScope": string[], "outOfScope": string[] },   // inScope = testing types; outOfScope = Feature NOT to be Tested (with reason)
  "inclusions": string[],
  "testEnvironments": string[],
  "testDataManagement": string,         // how test data is sourced, refreshed, reset; PII handling
  "defectReporting": string,
  "defectLifecycle": string[],          // ordered states, each "State — description (JIRA: status)"
  "severityPriority": {
    "severity": [ { "level": string, "definition": string } ],   // S1..S4
    "priority": [ { "level": string, "definition": string } ]    // P1..P4
  },
  "testStrategy": string[],
  "schedule": [ { "phase": string, "owner": string, "dates": string } ],
  "resources": string[],                // people, tools, environments allocated
  "roles": [ { "name": string, "role": string, "allocation": string, "availability": string } ],
  "deliverables": string[],
  "entryCriteria": string[],
  "exitCriteria": string[],
  "suspensionResumption": { "suspension": string[], "resumption": string[] },
  "passFailCriteria": string[],         // explicit quantitative thresholds
  "metrics": [ { "metric": string, "definition": string, "target": string } ],
  "tools": string[],
  "risks": [ { "risk": string, "mitigation": string } ],
  "approvals": [ { "name": string, "role": string, "signature": string, "date": string } ]
}`;

// Standard QA-industry defaults for governance sections the ticket is usually silent on.
const DEFAULT_LIFECYCLE = [
  'New — defect logged, not yet triaged (JIRA: To Do).',
  'Assigned — triaged and assigned to a developer (JIRA: In Progress).',
  'Open — under active investigation/fix (JIRA: In Progress).',
  'Fixed — developer resolved; awaiting verification (JIRA: In Review).',
  'Retest — QA re-verifies the fix (JIRA: In Testing).',
  'Closed — fix verified and accepted (JIRA: Done); Reopened if retest fails (JIRA: Reopened).',
];

const DEFAULT_SEVERITY = [
  { level: 'S1 — Critical', definition: 'System unusable; a core flow is blocked with no workaround.' },
  { level: 'S2 — Major', definition: 'A major function fails; a costly workaround exists.' },
  { level: 'S3 — Minor', definition: 'A minor function issue with an easy workaround.' },
  { level: 'S4 — Cosmetic', definition: 'Cosmetic or trivial issue with no functional impact.' },
];

const DEFAULT_PRIORITY = [
  { level: 'P1 — Critical', definition: 'Must be fixed before release; blocks sign-off.' },
  { level: 'P2 — High', definition: 'Fix required in the current cycle; impacts key scenarios.' },
  { level: 'P3 — Medium', definition: 'Fix when capacity allows; moderate impact.' },
  { level: 'P4 — Low', definition: 'Optional fix; minimal impact.' },
];

const DEFAULT_METRICS = [
  { metric: 'Test Execution %', definition: 'Executed test cases ÷ planned test cases.', target: '100% of planned cases executed.' },
  { metric: 'Pass Rate', definition: 'Passed test cases ÷ executed test cases.', target: '≥95%.' },
  { metric: 'Defect Density', definition: 'Defects ÷ size (per module/endpoint).', target: 'Trend downward release over release.' },
  { metric: 'Defect Leakage', definition: 'Defects found post-release ÷ total defects.', target: '<5%.' },
  { metric: 'Defect Removal Efficiency', definition: 'Defects removed in-cycle ÷ total defects.', target: '≥90%.' },
];

const DEFAULT_SUSPENSION = [
  'A blocker/P1 defect with no workaround is open.',
  'The test environment is unavailable or unstable.',
  'More than 20% of smoke tests fail.',
  'Required test data or credentials are missing.',
];

const DEFAULT_RESUMPTION = [
  'The blocking defect is fixed and verified.',
  'The environment is restored and smoke tests pass.',
  'Required test data and access are available.',
];

const DEFAULT_PASSFAIL = [
  '≥95% of planned test cases executed and passed.',
  'Zero P1 (Critical) defects open at test closure.',
  'No more than 2 P2 defects deferred with documented approval.',
  'p95 response time ≤ 2s under nominal load; error rate <1% under target load.',
];

const DEFAULT_TEST_DATA =
  'Test data covering valid, invalid, and boundary scenarios is prepared per test case, including authentication tokens where required. Data is provisioned in the QA environment, reset between runs to keep tests independent, and any sensitive/PII values are masked or synthetic. Specific data sets are TBD until requirements are finalized.';

const DEFAULT_RESOURCES = [
  'Test Lead — TBD',
  'Test Engineer(s) — TBD',
  'Developer POC — TBD',
  'QA and Pre-Prod environments',
  'Tooling: see Tools section',
];

const DEFAULT_ROLES = [
  { name: 'TBD', role: 'Test Lead', allocation: 'Test planning, review, sign-off', availability: '100%' },
  { name: 'TBD', role: 'Test Engineer', allocation: 'Test design, execution, defect reporting', availability: '100%' },
  { name: 'TBD', role: 'Developer POC', allocation: 'Defect fixes and clarifications', availability: 'TBD' },
  { name: 'TBD', role: 'Project Manager', allocation: 'Scheduling, escalation, stakeholder comms', availability: 'TBD' },
];

const DEFAULT_APPROVALS = [
  { name: 'TBD', role: 'Test Lead', signature: '', date: '' },
  { name: 'TBD', role: 'Project Manager', signature: '', date: '' },
  { name: 'TBD', role: 'Client Representative', signature: '', date: '' },
];

export function buildMessages(issue) {
  const system = [
    'You are a senior QA Lead writing a FORMAL, 22-section software Test Plan.',
    'Base project-specific content strictly on the provided Jira issue.',
    'For project-specific facts (names, dates, versions, endpoints) that the ticket does not provide, use "TBD" — never invent them.',
    'For standard governance sections the ticket is silent on (severity/priority scale, defect lifecycle, test metrics, suspension/resumption, pass/fail thresholds), use standard QA-industry defaults.',
    'Be concrete, professional, and concise. Output strictly valid JSON.',
  ].join(' ');

  const user = [
    'Create a formal Test Plan for the following Jira issue.',
    '',
    `Key: ${issue.key}`,
    `Summary: ${issue.summary}`,
    `Type: ${issue.issueType} | Status: ${issue.status} | Priority: ${issue.priority}`,
    `Components: ${issue.components.join(', ') || 'none'}`,
    `Labels: ${issue.labels.join(', ') || 'none'}`,
    `Fix Versions: ${issue.fixVersions.join(', ') || 'none'}`,
    `Reporter: ${issue.reporter} | Assignee: ${issue.assignee || 'Unassigned'}`,
    '',
    'Description / Acceptance Criteria:',
    issue.description || '(none provided)',
    '',
    SCHEMA_HINT,
  ].join('\n');

  return [
    { role: 'system', content: system },
    { role: 'user', content: user },
  ];
}

const arr = (v) => (Array.isArray(v) ? v : []);
// Prefer LLM output when present; otherwise fall back to a standard default.
const orDefault = (v, def) => (Array.isArray(v) && v.length ? v : def);

export async function generateTestPlan(config, issue) {
  const plan = await groqChat(config, buildMessages(issue), { json: true, temperature: 0.3 });

  // Defensive normalization so the renderer never crashes on a missing key.
  const sp = plan.severityPriority || {};
  const sr = plan.suspensionResumption || {};
  return {
    testPlanId: plan.testPlanId || `TP-${issue.key}-001`,
    version: plan.version || '1.0',
    date: plan.date || 'TBD',
    sourceIssue: plan.sourceIssue || issue.key,
    title: plan.title || `Test Plan — ${issue.summary}`,
    testingItem: plan.testingItem || (issue.summary ? `${issue.summary} (${issue.key})` : 'TBD'),
    objective: plan.objective || 'TBD',
    scope: {
      inScope: arr(plan.scope?.inScope),
      outOfScope: arr(plan.scope?.outOfScope),
    },
    inclusions: arr(plan.inclusions),
    testEnvironments: arr(plan.testEnvironments),
    testDataManagement: plan.testDataManagement || DEFAULT_TEST_DATA,
    defectReporting: plan.defectReporting || 'TBD',
    defectLifecycle: orDefault(plan.defectLifecycle, DEFAULT_LIFECYCLE),
    severityPriority: {
      severity: orDefault(sp.severity, DEFAULT_SEVERITY),
      priority: orDefault(sp.priority, DEFAULT_PRIORITY),
    },
    testStrategy: arr(plan.testStrategy),
    schedule: arr(plan.schedule),
    resources: orDefault(plan.resources, DEFAULT_RESOURCES),
    roles: orDefault(plan.roles, DEFAULT_ROLES),
    deliverables: arr(plan.deliverables),
    entryCriteria: arr(plan.entryCriteria),
    exitCriteria: arr(plan.exitCriteria),
    suspensionResumption: {
      suspension: orDefault(sr.suspension, DEFAULT_SUSPENSION),
      resumption: orDefault(sr.resumption, DEFAULT_RESUMPTION),
    },
    passFailCriteria: orDefault(plan.passFailCriteria, DEFAULT_PASSFAIL),
    metrics: orDefault(plan.metrics, DEFAULT_METRICS),
    tools: arr(plan.tools),
    risks: arr(plan.risks),
    approvals: orDefault(plan.approvals, DEFAULT_APPROVALS),
  };
}

function bullets(list) {
  if (!list || !list.length) return ['- TBD'];
  return list.map((i) => `- ${i}`);
}

export function renderMarkdown(plan, issue) {
  const L = [];
  L.push(`# ${plan.title}`, '');
  L.push(`**Issue Type:** ${issue.issueType} | **Priority:** ${issue.priority} | **Status:** ${issue.status}  `);
  L.push('');

  // 1
  L.push('## 1. Test Plan ID', '');
  L.push('| Field | Value |', '| --- | --- |');
  L.push(`| Test Plan ID | ${plan.testPlanId} |`);
  L.push(`| Version | ${plan.version} |`);
  L.push(`| Date | ${plan.date} |`);
  L.push(`| Source Issue | ${plan.sourceIssue} |`);
  L.push('');

  // 2
  L.push('## 2. Testing Item', '', plan.testingItem, '');
  // 3
  L.push('## 3. Objective', '', plan.objective, '');
  // 4
  L.push('## 4. Scope', '', ...bullets(plan.scope.inScope), '');
  // 5
  L.push('## 5. Inclusions / Feature to be Tested', '', ...bullets(plan.inclusions), '');
  // 6
  L.push('## 6. Feature NOT to be Tested', '', ...bullets(plan.scope.outOfScope), '');
  // 7
  L.push('## 7. Test Environments', '', ...bullets(plan.testEnvironments), '');
  // 8
  L.push('## 8. Test Data Management', '', plan.testDataManagement, '');

  // 9
  L.push('## 9. Defect Reporting Procedure', '', plan.defectReporting, '');
  L.push('### Defect Life Cycle', '');
  plan.defectLifecycle.forEach((s, i) => L.push(`${i + 1}. ${s}`));
  L.push('');

  // 10
  L.push('## 10. Severity & Priority Classification', '');
  L.push('**Severity**', '', '| Severity | Definition |', '| --- | --- |');
  plan.severityPriority.severity.forEach((s) => L.push(`| ${s.level || 'TBD'} | ${s.definition || 'TBD'} |`));
  L.push('');
  L.push('**Priority**', '', '| Priority | Definition |', '| --- | --- |');
  plan.severityPriority.priority.forEach((p) => L.push(`| ${p.level || 'TBD'} | ${p.definition || 'TBD'} |`));
  L.push('');

  // 11
  L.push('## 11. Test Strategy', '', ...bullets(plan.testStrategy), '');

  // 12
  L.push('## 12. Test Schedule', '');
  if (plan.schedule.length) {
    L.push('| Phase | Owner | Dates |', '| --- | --- | --- |');
    plan.schedule.forEach((s) => L.push(`| ${s.phase || 'TBD'} | ${s.owner || 'TBD'} | ${s.dates || 'TBD'} |`));
  } else L.push('TBD');
  L.push('');

  // 13
  L.push('## 13. Resources Allocation', '', ...bullets(plan.resources), '');

  // 14
  L.push('## 14. Roles & Responsibility', '');
  L.push('| Team Member Name | Role | Job Allocation | Availability (%) |', '| --- | --- | --- | --- |');
  plan.roles.forEach((r) =>
    L.push(`| ${r.name || 'TBD'} | ${r.role || 'TBD'} | ${r.allocation || 'TBD'} | ${r.availability || 'TBD'} |`),
  );
  L.push('');

  // 15
  L.push('## 15. Test Deliverables', '', ...bullets(plan.deliverables), '');

  // 16
  L.push('## 16. Entry and Exit Criteria', '');
  L.push('### Entry Criteria', '', ...bullets(plan.entryCriteria), '');
  L.push('### Exit Criteria', '', ...bullets(plan.exitCriteria), '');

  // 17
  L.push('## 17. Suspension and Resumption Criteria', '');
  L.push('### Suspension', '', ...bullets(plan.suspensionResumption.suspension), '');
  L.push('### Resumption', '', ...bullets(plan.suspensionResumption.resumption), '');

  // 18
  L.push('## 18. Pass/Fail Criteria', '', ...bullets(plan.passFailCriteria), '');

  // 19
  L.push('## 19. Test Metrics & Reporting', '');
  L.push('| Metric | Definition | Target |', '| --- | --- | --- |');
  plan.metrics.forEach((m) => L.push(`| ${m.metric || 'TBD'} | ${m.definition || 'TBD'} | ${m.target || 'TBD'} |`));
  L.push('');

  // 20
  L.push('## 20. Tools', '', ...bullets(plan.tools), '');

  // 21
  L.push('## 21. Risks & Mitigations', '');
  if (plan.risks.length) {
    L.push('| Risk | Mitigation |', '| --- | --- |');
    plan.risks.forEach((r) => L.push(`| ${r.risk || 'TBD'} | ${r.mitigation || 'TBD'} |`));
  } else L.push('TBD');
  L.push('');

  // 22
  L.push('## 22. Signature & Approval', '');
  L.push('| Name | Role | Signature | Date |', '| --- | --- | --- | --- |');
  plan.approvals.forEach((a) =>
    L.push(`| ${a.name || 'TBD'} | ${a.role || 'TBD'} | ${a.signature || ''} | ${a.date || ''} |`),
  );

  L.push('', '---', `_Generated from ${plan.sourceIssue} via GROQ (${'openai/gpt-oss-120b'}). Review before use._`);
  return L.join('\n');
}
