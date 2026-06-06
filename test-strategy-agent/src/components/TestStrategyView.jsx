import React, { useState } from 'react';

function List({ items }) {
  if (!items || !items.length) return <p className="tbd">TBD</p>;
  return (
    <ul>
      {items.map((i, n) => (
        <li key={n}>{i}</li>
      ))}
    </ul>
  );
}

function Table({ cols, rows, cells }) {
  if (!rows || !rows.length) return <p className="tbd">TBD</p>;
  return (
    <table>
      <thead>
        <tr>{cols.map((c) => <th key={c}>{c}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((r, n) => (
          <tr key={n}>{cells(r).map((v, m) => <td key={m}>{v || 'TBD'}</td>)}</tr>
        ))}
      </tbody>
    </table>
  );
}

export default function TestStrategyView({ strategy, issue, markdown }) {
  const [raw, setRaw] = useState(false);
  const dc = strategy.documentControl || {};
  const intro = strategy.introduction || {};
  const roles = strategy.roles || { entries: [] };
  const schedule = strategy.schedule || { items: [], milestones: [] };
  const criteria = strategy.criteria || {};
  const dm = strategy.defectManagement || { severity: [], priority: [] };
  const ad = strategy.assumptionsDependencies || {};

  return (
    <div className="plan">
      <div className="plan-head">
        <div>
          <h3>{dc.title}</h3>
          <p className="meta">
            <span>{dc.requirementSource}</span> · <span>{issue.issueType}</span> ·{' '}
            <span>{issue.priority}</span> · <span>{issue.status}</span>
          </p>
        </div>
        <button className="ghost" onClick={() => setRaw((r) => !r)}>
          {raw ? 'Formatted' : 'Markdown'}
        </button>
      </div>

      {raw ? (
        <pre className="md">{markdown}</pre>
      ) : (
        <div className="sections">
          <section>
            <h4>Document Control</h4>
            <table>
              <tbody>
                <tr><th>Document Title</th><td>{dc.title}</td></tr>
                <tr><th>Version</th><td>{dc.version}</td></tr>
                <tr><th>Status</th><td>{dc.status}</td></tr>
                <tr><th>Author</th><td>{dc.author}</td></tr>
                <tr><th>Reviewer(s)</th><td>{(dc.reviewers || []).join(', ') || 'TBD'}</td></tr>
                <tr><th>Approver</th><td>{dc.approver}</td></tr>
                <tr><th>Created Date</th><td>{dc.createdDate}</td></tr>
                <tr><th>Last Updated</th><td>{dc.lastUpdated}</td></tr>
                <tr><th>Requirement Source / Jira ID</th><td>{dc.requirementSource}</td></tr>
              </tbody>
            </table>
            <h5>Revision History</h5>
            <Table
              cols={['Version', 'Date', 'Author', 'Description of change']}
              rows={strategy.revisionHistory}
              cells={(r) => [r.version, r.date, r.author, r.description]}
            />
          </section>

          <section>
            <h4>Introduction / Background</h4>
            <ul>
              <li><strong>Feature summary:</strong> {intro.featureSummary || 'TBD'}</li>
              <li><strong>Requirement source:</strong> {intro.requirementSource || 'TBD'}</li>
              <li><strong>Why this matters:</strong> {intro.whyItMatters || 'TBD'}</li>
            </ul>
          </section>

          <section>
            <h4>Objective</h4>
            <p>{strategy.objective || 'TBD'}</p>
          </section>

          <section>
            <h4>Scope</h4>
            <h5>In scope</h5>
            <List items={strategy.scope?.inScope} />
            <h5>Out of scope</h5>
            <List items={strategy.scope?.outOfScope} />
          </section>

          <section>
            <h4>Test Levels &amp; Types</h4>
            <Table
              cols={['Level', 'Description']}
              rows={strategy.testLevels}
              cells={(t) => [t.level, t.description]}
            />
          </section>

          <section>
            <h4>Focus Areas / Quality Attributes</h4>
            <List items={strategy.focusAreas} />
          </section>

          <section>
            <h4>Test Approach</h4>
            <List items={strategy.testApproach} />
          </section>

          <section>
            <h4>Test Environment(s)</h4>
            <Table
              cols={['Environment', 'Purpose', 'URL / Access', 'Notes']}
              rows={strategy.testEnvironments}
              cells={(e) => [e.environment, e.purpose, e.url, e.notes]}
            />
          </section>

          <section>
            <h4>Test Data Management</h4>
            <List items={strategy.testDataManagement} />
          </section>

          <section>
            <h4>Tools &amp; Technology</h4>
            <Table
              cols={['Category', 'Tool']}
              rows={strategy.tools}
              cells={(t) => [t.category, t.tool]}
            />
          </section>

          <section>
            <h4>Roles &amp; Responsibilities</h4>
            <p className="muted">
              A team of {roles.teamSize || 'TBD'} members is needed for {roles.durationMonths || 'TBD'} months
              of testing effort.
            </p>
            <Table
              cols={['Role', 'Responsibility']}
              rows={roles.entries}
              cells={(r) => [r.role, r.responsibility]}
            />
          </section>

          <section>
            <h4>Schedule &amp; Milestones</h4>
            <Table
              cols={['Period', 'Focus']}
              rows={schedule.items}
              cells={(s) => [s.period, s.focus]}
            />
            <h5>Milestones</h5>
            <List items={schedule.milestones} />
            <p className="muted">
              <strong>Buffer / contingency:</strong> {schedule.buffer || 'TBD'}<br />
              <strong>Estimation basis:</strong> {schedule.estimationBasis || 'TBD'}
            </p>
          </section>

          <section>
            <h4>Deliverables</h4>
            <List items={strategy.deliverables} />
          </section>

          <section>
            <h4>Entry, Exit, Suspension &amp; Resumption Criteria</h4>
            <h5>Entry criteria</h5>
            <List items={criteria.entry} />
            <h5>Exit criteria</h5>
            <List items={criteria.exit} />
            <h5>Suspension criteria</h5>
            <List items={criteria.suspension} />
            <h5>Resumption criteria</h5>
            <List items={criteria.resumption} />
          </section>

          <section>
            <h4>Defect Management</h4>
            <ul>
              <li><strong>Lifecycle:</strong> {dm.lifecycle || 'TBD'}</li>
              <li><strong>Triage cadence:</strong> {dm.triageCadence || 'TBD'}</li>
              <li><strong>SLA:</strong> {dm.sla || 'TBD'}</li>
              <li><strong>Tracked in:</strong> {dm.tracker || 'TBD'}</li>
            </ul>
            <h5>Severity (technical impact)</h5>
            <Table cols={['Severity', 'Definition']} rows={dm.severity} cells={(s) => [s.level, s.definition]} />
            <h5>Priority (business urgency)</h5>
            <Table cols={['Priority', 'Definition']} rows={dm.priority} cells={(p) => [p.level, p.definition]} />
          </section>

          <section>
            <h4>Test Metrics &amp; KPIs</h4>
            <List items={strategy.metrics} />
          </section>

          <section>
            <h4>Risks &amp; Mitigation</h4>
            <Table
              cols={['Risk', 'Likelihood', 'Impact', 'Mitigation', 'Owner']}
              rows={strategy.risks}
              cells={(r) => [r.risk, r.likelihood, r.impact, r.mitigation, r.owner]}
            />
          </section>

          <section>
            <h4>Assumptions &amp; Dependencies</h4>
            <h5>Assumptions</h5>
            <List items={ad.assumptions} />
            <h5>Dependencies</h5>
            <List items={ad.dependencies} />
          </section>

          <section>
            <h4>Communication &amp; Reporting</h4>
            <List items={strategy.communication} />
          </section>

          <section>
            <h4>Domain-Specific Considerations</h4>
            <List items={strategy.domainConsiderations} />
          </section>

          <section>
            <h4>Approval &amp; Sign-off</h4>
            <Table
              cols={['Role', 'Name', 'Signature', 'Date']}
              rows={strategy.approvals}
              cells={(a) => [a.role, a.name, a.signature, a.date]}
            />
          </section>
        </div>
      )}
    </div>
  );
}
