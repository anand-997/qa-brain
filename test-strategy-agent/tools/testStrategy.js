// Layer 3 Tool — build the prompt, generate the strategy via GROQ, render deterministic Markdown.
// Boundary rule (BLAST): GROQ produces CONTENT (JSON); Markdown rendering is deterministic code.
// 21-section model aligned with TEST_STRATEGY_TEMPLATE.md.
import { groqChat } from './groqClient.js';

const SCHEMA_HINT = `Return ONLY a JSON object with EXACTLY these keys (21-section formal Test Strategy):
{
  "documentControl": {
    "title": string,                  // "Test Strategy — <Feature/Application Name>"
    "version": string,                // e.g. "1.0"
    "status": string,                 // "Draft" | "In Review" | "Approved"
    "author": string,                 // or "TBD"
    "reviewers": string[],            // or []
    "approver": string,               // or "TBD"
    "createdDate": string,            // "DD-MMM-YYYY" or "TBD"
    "lastUpdated": string,            // "DD-MMM-YYYY" or "TBD"
    "requirementSource": string       // Jira ID / requirement link / "Plain text"
  },
  "revisionHistory": [ { "version": string, "date": string, "author": string, "description": string } ],
  "introduction": {
    "featureSummary": string,         // brief description parsed from the requirement
    "requirementSource": string,      // Jira ID / plain-text / uploaded file reference
    "whyItMatters": string            // business value / problem this feature solves
  },
  "objective": string,                // end-to-end objective for the feature under test
  "scope": { "inScope": string[], "outOfScope": string[] },   // outOfScope items should include a reason
  "testLevels": [ { "level": string, "description": string } ],  // unit, integration, API, system/e2e, regression, smoke/sanity, UAT
  "focusAreas": string[],             // quality attributes: functional, UI, performance, security, compatibility, usability
  "testApproach": string[],           // techniques, automation vs manual split, framework design, CI integration
  "testEnvironments": [ { "environment": string, "purpose": string, "url": string, "notes": string } ],
  "testDataManagement": string[],     // sourcing, accounts, sensitive-data handling, refresh cadence
  "tools": [ { "category": string, "tool": string } ],   // UI/Mobile/API/Performance/Security/Test mgmt/Defect/CI/VCS/Reporting
  "roles": {
    "teamSize": string,               // e.g. "5" or "TBD"
    "durationMonths": string,         // e.g. "4" or "TBD"
    "entries": [ { "role": string, "responsibility": string } ]
  },
  "schedule": {
    "items": [ { "period": string, "focus": string } ],   // e.g. { "Month 1 (April)", "Functional and security testing" }
    "milestones": string[],
    "buffer": string,                 // contingency description or "TBD"
    "estimationBasis": string         // how team size & duration were derived or "TBD"
  },
  "deliverables": string[],
  "criteria": { "entry": string[], "exit": string[], "suspension": string[], "resumption": string[] },
  "defectManagement": {
    "lifecycle": string,              // one-line lifecycle, e.g. "New -> Assigned -> In Progress -> Fixed -> Retest -> Closed/Reopened"
    "severity": [ { "level": string, "definition": string } ],  // Critical/High/Medium/Low
    "priority": [ { "level": string, "definition": string } ],  // P1/P2/P3/P4
    "triageCadence": string,          // e.g. "daily defect triage with dev + QA + PO"
    "sla": string,                    // target turnaround per severity or "TBD"
    "tracker": string                 // e.g. "Jira"
  },
  "metrics": string[],                // KPIs + reporting frequency
  "risks": [ { "risk": string, "likelihood": string, "impact": string, "mitigation": string, "owner": string } ],
  "assumptionsDependencies": { "assumptions": string[], "dependencies": string[] },
  "communication": string[],          // standups, status reports, stakeholders, channels
  "domainConsiderations": string[],   // accessibility, security depth, performance depth, localization, domain specifics
  "approvals": [ { "role": string, "name": string, "signature": string, "date": string } ]
}`;

// Standard QA-industry defaults for governance sections the requirement is usually silent on.
const DEFAULT_TEST_LEVELS = [
  { level: 'Unit testing', description: 'Owned by developers; component-level verification.' },
  { level: 'Integration testing', description: 'Interfaces between modules/services.' },
  { level: 'API / backend testing', description: 'Contract, request/response, status codes, error handling.' },
  { level: 'System / end-to-end testing', description: 'Complete business workflows.' },
  { level: 'Regression testing', description: 'Protect existing functionality after changes.' },
  { level: 'Smoke / sanity testing', description: 'Build-acceptance and quick health checks.' },
  { level: 'User Acceptance Testing (UAT)', description: 'Business sign-off against requirements.' },
];

const DEFAULT_FOCUS_AREAS = [
  'Functional correctness of flows',
  'UI / navigation',
  'Performance — load, stress and scalability',
  'Security — vulnerabilities, encryption',
  'Compatibility — browsers, devices, OS',
  'Usability — ease of use, accessibility',
];

const DEFAULT_ENVIRONMENTS = [
  { environment: 'Dev', purpose: 'Developer testing', url: 'TBD', notes: '' },
  { environment: 'QA / Test', purpose: 'Functional & integration testing', url: 'TBD', notes: '' },
  { environment: 'Staging / Pre-prod', purpose: 'UAT, performance, prod-like validation', url: 'TBD', notes: '' },
];

const DEFAULT_TEST_DATA = [
  'Test data covering valid, invalid, and boundary scenarios is prepared per scenario.',
  'Dedicated test accounts/users per role, stored in a secure credentials store.',
  'Sensitive/PII and payment data is masked or synthetic — never real production data.',
  'Data is refreshed/reset per cycle or on demand to keep tests independent.',
];

const DEFAULT_TOOLS = [
  { category: 'UI automation', tool: 'Selenium / Playwright' },
  { category: 'Mobile automation', tool: 'Appium' },
  { category: 'API testing', tool: 'Postman / RestAssured' },
  { category: 'Performance', tool: 'JMeter' },
  { category: 'Security', tool: 'OWASP ZAP / Burp Suite' },
  { category: 'Test management', tool: 'Zephyr / TestRail / Xray' },
  { category: 'Defect tracking', tool: 'Jira' },
  { category: 'CI/CD', tool: 'GitHub Actions / Jenkins' },
  { category: 'Version control', tool: 'Git / GitHub' },
  { category: 'Reporting', tool: 'Allure / built-in dashboards' },
];

const DEFAULT_ROLES = [
  { role: 'Test Lead / Manager', responsibility: 'Strategy, planning, reporting, sign-off' },
  { role: 'Manual / Functional Tester(s)', responsibility: 'Test design, execution, exploratory testing' },
  { role: 'Automation Engineer(s)', responsibility: 'Framework, automated suites, CI integration' },
  { role: 'Performance Tester', responsibility: 'Load/stress scripts and analysis' },
  { role: 'Security Tester', responsibility: 'Vulnerability & compliance testing' },
];

const DEFAULT_DELIVERABLES = [
  'Functional test cases and reports',
  'Performance test scripts and results',
  'Security vulnerabilities report',
  'User acceptance testing report',
  'Test coverage and defect reports',
  'Automation regression suite',
];

const DEFAULT_ENTRY = [
  "User stories to be tested must meet the defined 'Ready for Testing' criteria.",
  'Build deployed to the test environment; test data and environment available.',
];

const DEFAULT_EXIT = [
  'All planned test cases executed with no critical defects outstanding.',
  'Required coverage met; all high/critical defects closed or accepted by stakeholders.',
];

const DEFAULT_SUSPENSION = [
  'A blocker defect, unstable build, or unavailable environment halts testing.',
];

const DEFAULT_RESUMPTION = [
  'The blocker is resolved / a stable build is redeployed before testing resumes.',
];

const DEFAULT_SEVERITY = [
  { level: 'Critical', definition: 'System unusable; a core flow is blocked with no workaround.' },
  { level: 'High', definition: 'A major function fails; a costly workaround exists.' },
  { level: 'Medium', definition: 'A minor function issue with an easy workaround.' },
  { level: 'Low', definition: 'Cosmetic or trivial issue with no functional impact.' },
];

const DEFAULT_PRIORITY = [
  { level: 'P1', definition: 'Must be fixed before release; blocks sign-off.' },
  { level: 'P2', definition: 'Fix required in the current cycle; impacts key scenarios.' },
  { level: 'P3', definition: 'Fix when capacity allows; moderate impact.' },
  { level: 'P4', definition: 'Optional fix; minimal impact.' },
];

const DEFAULT_METRICS = [
  'Test case coverage % vs. requirements',
  'Test execution pass / fail rate',
  'Defect density and defect leakage (escaped defects)',
  'Automation coverage %',
  'Mean time to resolve (MTTR) defects',
  'Reporting frequency: daily/weekly status reports & dashboards',
];

const DEFAULT_RISKS = [
  { risk: 'Delay in test environment availability', likelihood: 'M', impact: 'H', mitigation: 'Early provisioning, fallback environment', owner: 'TBD' },
  { risk: 'Lack of access to third-party / integration systems', likelihood: 'M', impact: 'H', mitigation: 'Sandbox/mock services, early access requests', owner: 'TBD' },
  { risk: 'Complex workflows may require more time and resources', likelihood: 'M', impact: 'M', mitigation: 'Buffer in schedule, prioritize by risk', owner: 'TBD' },
];

const DEFAULT_COMMUNICATION = [
  'Daily standups and weekly status reports',
  'Stakeholders: PO, dev lead, QA lead, business owner',
  'Channels: Jira dashboards, email summaries, demo/review meetings',
];

const DEFAULT_APPROVALS = [
  { role: 'QA Lead', name: 'TBD', signature: '', date: '' },
  { role: 'Product Owner', name: 'TBD', signature: '', date: '' },
  { role: 'Project / Delivery Manager', name: 'TBD', signature: '', date: '' },
];

export function buildMessages(issue) {
  const system = [
    'You are a senior QA Lead writing a FORMAL, 21-section software Test Strategy.',
    'Base project-specific content strictly on the provided requirement / Jira issue.',
    'For project-specific facts (names, dates, versions, URLs, owners) that the requirement does not provide, use "TBD" — never invent them.',
    'For standard governance sections the requirement is silent on (test levels, defect lifecycle/severity/priority, metrics, entry/exit/suspension/resumption criteria, tools, roles), use standard QA-industry defaults.',
    'Be concrete, professional, and concise. Output strictly valid JSON.',
  ].join(' ');

  const user = [
    'Create a formal Test Strategy for the following requirement.',
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
const str = (v, def = 'TBD') => (typeof v === 'string' && v.trim() ? v : def);
// Prefer LLM output when present; otherwise fall back to a standard default.
const orDefault = (v, def) => (Array.isArray(v) && v.length ? v : def);

export async function generateStrategy(config, issue) {
  const s = await groqChat(config, buildMessages(issue), { json: true, temperature: 0.3 });

  // Defensive normalization so the renderer never crashes on a missing key.
  const dc = s.documentControl || {};
  const intro = s.introduction || {};
  const roles = s.roles || {};
  const schedule = s.schedule || {};
  const criteria = s.criteria || {};
  const dm = s.defectManagement || {};
  const ad = s.assumptionsDependencies || {};

  return {
    documentControl: {
      title: str(dc.title, `Test Strategy — ${issue.summary || issue.key}`),
      version: str(dc.version, '1.0'),
      status: str(dc.status, 'Draft'),
      author: str(dc.author),
      reviewers: arr(dc.reviewers),
      approver: str(dc.approver),
      createdDate: str(dc.createdDate),
      lastUpdated: str(dc.lastUpdated),
      requirementSource: str(dc.requirementSource, issue.key),
    },
    revisionHistory: orDefault(s.revisionHistory, [
      { version: '1.0', date: 'TBD', author: str(dc.author), description: 'Initial version' },
    ]),
    introduction: {
      featureSummary: str(intro.featureSummary, issue.summary || 'TBD'),
      requirementSource: str(intro.requirementSource, issue.key),
      whyItMatters: str(intro.whyItMatters),
    },
    objective: str(s.objective),
    scope: {
      inScope: arr(s.scope?.inScope),
      outOfScope: arr(s.scope?.outOfScope),
    },
    testLevels: orDefault(s.testLevels, DEFAULT_TEST_LEVELS),
    focusAreas: orDefault(s.focusAreas, DEFAULT_FOCUS_AREAS),
    testApproach: arr(s.testApproach),
    testEnvironments: orDefault(s.testEnvironments, DEFAULT_ENVIRONMENTS),
    testDataManagement: orDefault(s.testDataManagement, DEFAULT_TEST_DATA),
    tools: orDefault(s.tools, DEFAULT_TOOLS),
    roles: {
      teamSize: str(roles.teamSize),
      durationMonths: str(roles.durationMonths),
      entries: orDefault(roles.entries, DEFAULT_ROLES),
    },
    schedule: {
      items: arr(schedule.items),
      milestones: arr(schedule.milestones),
      buffer: str(schedule.buffer),
      estimationBasis: str(schedule.estimationBasis),
    },
    deliverables: orDefault(s.deliverables, DEFAULT_DELIVERABLES),
    criteria: {
      entry: orDefault(criteria.entry, DEFAULT_ENTRY),
      exit: orDefault(criteria.exit, DEFAULT_EXIT),
      suspension: orDefault(criteria.suspension, DEFAULT_SUSPENSION),
      resumption: orDefault(criteria.resumption, DEFAULT_RESUMPTION),
    },
    defectManagement: {
      lifecycle: str(dm.lifecycle, 'New → Assigned → In Progress → Fixed → Retest → Closed / Reopened'),
      severity: orDefault(dm.severity, DEFAULT_SEVERITY),
      priority: orDefault(dm.priority, DEFAULT_PRIORITY),
      triageCadence: str(dm.triageCadence, 'Regular defect triage with dev + QA + PO'),
      sla: str(dm.sla),
      tracker: str(dm.tracker, 'Jira'),
    },
    metrics: orDefault(s.metrics, DEFAULT_METRICS),
    risks: orDefault(s.risks, DEFAULT_RISKS),
    assumptionsDependencies: {
      assumptions: arr(ad.assumptions),
      dependencies: arr(ad.dependencies),
    },
    communication: orDefault(s.communication, DEFAULT_COMMUNICATION),
    domainConsiderations: arr(s.domainConsiderations),
    approvals: orDefault(s.approvals, DEFAULT_APPROVALS),
  };
}

function bullets(list) {
  if (!list || !list.length) return ['- TBD'];
  return list.map((i) => `- ${i}`);
}

export function renderMarkdown(strat, issue) {
  const L = [];
  const dc = strat.documentControl;
  L.push(`# ${dc.title}`, '');
  L.push(`**Issue Type:** ${issue.issueType} | **Priority:** ${issue.priority} | **Status:** ${issue.status}  `);
  L.push('');

  // 1
  L.push('## 1. Document Control', '');
  L.push('| Field | Value |', '| --- | --- |');
  L.push(`| Document Title | ${dc.title} |`);
  L.push(`| Version | ${dc.version} |`);
  L.push(`| Status | ${dc.status} |`);
  L.push(`| Author | ${dc.author} |`);
  L.push(`| Reviewer(s) | ${dc.reviewers.join(', ') || 'TBD'} |`);
  L.push(`| Approver | ${dc.approver} |`);
  L.push(`| Created Date | ${dc.createdDate} |`);
  L.push(`| Last Updated | ${dc.lastUpdated} |`);
  L.push(`| Requirement Source / Jira ID | ${dc.requirementSource} |`);
  L.push('');
  L.push('### Revision History', '');
  L.push('| Version | Date | Author | Description of change |', '| --- | --- | --- | --- |');
  strat.revisionHistory.forEach((r) =>
    L.push(`| ${r.version || 'TBD'} | ${r.date || 'TBD'} | ${r.author || 'TBD'} | ${r.description || 'TBD'} |`),
  );
  L.push('');

  // 2
  L.push('## 2. Introduction / Background', '');
  L.push(`- **Feature summary:** ${strat.introduction.featureSummary}`);
  L.push(`- **Requirement source:** ${strat.introduction.requirementSource}`);
  L.push(`- **Why this matters:** ${strat.introduction.whyItMatters}`);
  L.push('');

  // 3
  L.push('## 3. Objective', '', strat.objective, '');

  // 4
  L.push('## 4. Scope', '');
  L.push('### In scope', '', ...bullets(strat.scope.inScope), '');
  L.push('### Out of scope', '', ...bullets(strat.scope.outOfScope), '');

  // 5
  L.push('## 5. Test Levels & Types', '');
  strat.testLevels.forEach((t) => L.push(`- **${t.level || 'TBD'}** — ${t.description || 'TBD'}`));
  L.push('');

  // 6
  L.push('## 6. Focus Areas / Quality Attributes', '', ...bullets(strat.focusAreas), '');

  // 7
  L.push('## 7. Test Approach', '', ...bullets(strat.testApproach), '');

  // 8
  L.push('## 8. Test Environment(s)', '');
  L.push('| Environment | Purpose | URL / Access | Notes |', '| --- | --- | --- | --- |');
  strat.testEnvironments.forEach((e) =>
    L.push(`| ${e.environment || 'TBD'} | ${e.purpose || 'TBD'} | ${e.url || 'TBD'} | ${e.notes || ''} |`),
  );
  L.push('');

  // 9
  L.push('## 9. Test Data Management', '', ...bullets(strat.testDataManagement), '');

  // 10
  L.push('## 10. Tools & Technology', '');
  L.push('| Category | Tool |', '| --- | --- |');
  strat.tools.forEach((t) => L.push(`| ${t.category || 'TBD'} | ${t.tool || 'TBD'} |`));
  L.push('');

  // 11
  L.push('## 11. Roles & Responsibilities', '');
  L.push(`A team of ${strat.roles.teamSize} members is needed for ${strat.roles.durationMonths} months of testing effort.`, '');
  L.push('| Role | Responsibility |', '| --- | --- |');
  strat.roles.entries.forEach((r) => L.push(`| ${r.role || 'TBD'} | ${r.responsibility || 'TBD'} |`));
  L.push('');

  // 12
  L.push('## 12. Schedule & Milestones', '');
  if (strat.schedule.items.length) {
    L.push('| Period | Focus |', '| --- | --- |');
    strat.schedule.items.forEach((s) => L.push(`| ${s.period || 'TBD'} | ${s.focus || 'TBD'} |`));
  } else {
    L.push('- TBD');
  }
  L.push('');
  L.push('**Milestones**', '', ...bullets(strat.schedule.milestones), '');
  L.push(`- **Buffer / contingency:** ${strat.schedule.buffer}`);
  L.push(`- **Estimation basis:** ${strat.schedule.estimationBasis}`);
  L.push('');

  // 13
  L.push('## 13. Deliverables', '', ...bullets(strat.deliverables), '');

  // 14
  L.push('## 14. Entry, Exit, Suspension & Resumption Criteria', '');
  L.push('### Entry criteria', '', ...bullets(strat.criteria.entry), '');
  L.push('### Exit criteria', '', ...bullets(strat.criteria.exit), '');
  L.push('### Suspension criteria', '', ...bullets(strat.criteria.suspension), '');
  L.push('### Resumption criteria', '', ...bullets(strat.criteria.resumption), '');

  // 15
  L.push('## 15. Defect Management', '');
  L.push(`- **Lifecycle:** ${strat.defectManagement.lifecycle}`);
  L.push(`- **Triage cadence:** ${strat.defectManagement.triageCadence}`);
  L.push(`- **SLA:** ${strat.defectManagement.sla}`);
  L.push(`- **Tracked in:** ${strat.defectManagement.tracker}`);
  L.push('');
  L.push('**Severity** (technical impact)', '', '| Severity | Definition |', '| --- | --- |');
  strat.defectManagement.severity.forEach((s) => L.push(`| ${s.level || 'TBD'} | ${s.definition || 'TBD'} |`));
  L.push('');
  L.push('**Priority** (business urgency)', '', '| Priority | Definition |', '| --- | --- |');
  strat.defectManagement.priority.forEach((p) => L.push(`| ${p.level || 'TBD'} | ${p.definition || 'TBD'} |`));
  L.push('');

  // 16
  L.push('## 16. Test Metrics & KPIs', '', ...bullets(strat.metrics), '');

  // 17
  L.push('## 17. Risks & Mitigation', '');
  L.push('| Risk | Likelihood | Impact | Mitigation | Owner |', '| --- | --- | --- | --- | --- |');
  strat.risks.forEach((r) =>
    L.push(`| ${r.risk || 'TBD'} | ${r.likelihood || 'TBD'} | ${r.impact || 'TBD'} | ${r.mitigation || 'TBD'} | ${r.owner || 'TBD'} |`),
  );
  L.push('');

  // 18
  L.push('## 18. Assumptions & Dependencies', '');
  L.push('**Assumptions**', '', ...bullets(strat.assumptionsDependencies.assumptions), '');
  L.push('**Dependencies**', '', ...bullets(strat.assumptionsDependencies.dependencies), '');

  // 19
  L.push('## 19. Communication & Reporting', '', ...bullets(strat.communication), '');

  // 20
  L.push('## 20. Domain-Specific Considerations', '', ...bullets(strat.domainConsiderations), '');

  // 21
  L.push('## 21. Approval & Sign-off', '');
  L.push('| Role | Name | Signature | Date |', '| --- | --- | --- | --- |');
  strat.approvals.forEach((a) =>
    L.push(`| ${a.role || 'TBD'} | ${a.name || 'TBD'} | ${a.signature || ''} | ${a.date || ''} |`),
  );

  L.push('', '---', `_Generated from ${dc.requirementSource} via GROQ (${'openai/gpt-oss-120b'}). Review before use._`);
  return L.join('\n');
}
