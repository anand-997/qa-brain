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

function Ordered({ items }) {
  if (!items || !items.length) return <p className="tbd">TBD</p>;
  return (
    <ol>
      {items.map((i, n) => (
        <li key={n}>{i}</li>
      ))}
    </ol>
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

export default function TestPlanView({ plan, issue, markdown }) {
  const [raw, setRaw] = useState(false);
  const sp = plan.severityPriority || { severity: [], priority: [] };
  const sr = plan.suspensionResumption || { suspension: [], resumption: [] };

  return (
    <div className="plan">
      <div className="plan-head">
        <div>
          <h3>{plan.title}</h3>
          <p className="meta">
            <span>{plan.testPlanId}</span> · <span>{issue.issueType}</span> · <span>{issue.priority}</span> ·{' '}
            <span>{issue.status}</span>
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
            <h4>1. Test Plan ID</h4>
            <table>
              <tbody>
                <tr><th>Test Plan ID</th><td>{plan.testPlanId}</td></tr>
                <tr><th>Version</th><td>{plan.version || 'TBD'}</td></tr>
                <tr><th>Date</th><td>{plan.date || 'TBD'}</td></tr>
                <tr><th>Source Issue</th><td>{plan.sourceIssue}</td></tr>
              </tbody>
            </table>
          </section>
          <section>
            <h4>2. Testing Item</h4>
            <p>{plan.testingItem || 'TBD'}</p>
          </section>
          <section>
            <h4>3. Objective</h4>
            <p>{plan.objective}</p>
          </section>
          <section>
            <h4>4. Scope</h4>
            <List items={plan.scope.inScope} />
          </section>
          <section>
            <h4>5. Inclusions / Feature to be Tested</h4>
            <List items={plan.inclusions} />
          </section>
          <section>
            <h4>6. Feature NOT to be Tested</h4>
            <List items={plan.scope.outOfScope} />
          </section>
          <section>
            <h4>7. Test Environments</h4>
            <List items={plan.testEnvironments} />
          </section>
          <section>
            <h4>8. Test Data Management</h4>
            <p>{plan.testDataManagement || 'TBD'}</p>
          </section>
          <section>
            <h4>9. Defect Reporting Procedure</h4>
            <p>{plan.defectReporting}</p>
            <h5>Defect Life Cycle</h5>
            <Ordered items={plan.defectLifecycle} />
          </section>
          <section>
            <h4>10. Severity &amp; Priority Classification</h4>
            <h5>Severity</h5>
            <Table cols={['Severity', 'Definition']} rows={sp.severity} cells={(s) => [s.level, s.definition]} />
            <h5>Priority</h5>
            <Table cols={['Priority', 'Definition']} rows={sp.priority} cells={(p) => [p.level, p.definition]} />
          </section>
          <section>
            <h4>11. Test Strategy</h4>
            <List items={plan.testStrategy} />
          </section>
          <section>
            <h4>12. Test Schedule</h4>
            <Table
              cols={['Phase', 'Owner', 'Dates']}
              rows={plan.schedule}
              cells={(s) => [s.phase, s.owner, s.dates]}
            />
          </section>
          <section>
            <h4>13. Resources Allocation</h4>
            <List items={plan.resources} />
          </section>
          <section>
            <h4>14. Roles &amp; Responsibility</h4>
            <Table
              cols={['Team Member Name', 'Role', 'Job Allocation', 'Availability (%)']}
              rows={plan.roles}
              cells={(r) => [r.name, r.role, r.allocation, r.availability]}
            />
          </section>
          <section>
            <h4>15. Test Deliverables</h4>
            <List items={plan.deliverables} />
          </section>
          <section>
            <h4>16. Entry and Exit Criteria</h4>
            <h5>Entry Criteria</h5>
            <List items={plan.entryCriteria} />
            <h5>Exit Criteria</h5>
            <List items={plan.exitCriteria} />
          </section>
          <section>
            <h4>17. Suspension and Resumption Criteria</h4>
            <h5>Suspension</h5>
            <List items={sr.suspension} />
            <h5>Resumption</h5>
            <List items={sr.resumption} />
          </section>
          <section>
            <h4>18. Pass/Fail Criteria</h4>
            <List items={plan.passFailCriteria} />
          </section>
          <section>
            <h4>19. Test Metrics &amp; Reporting</h4>
            <Table
              cols={['Metric', 'Definition', 'Target']}
              rows={plan.metrics}
              cells={(m) => [m.metric, m.definition, m.target]}
            />
          </section>
          <section>
            <h4>20. Tools</h4>
            <List items={plan.tools} />
          </section>
          <section>
            <h4>21. Risks &amp; Mitigations</h4>
            <Table cols={['Risk', 'Mitigation']} rows={plan.risks} cells={(r) => [r.risk, r.mitigation]} />
          </section>
          <section>
            <h4>22. Signature &amp; Approval</h4>
            <Table
              cols={['Name', 'Role', 'Signature', 'Date']}
              rows={plan.approvals}
              cells={(a) => [a.name, a.role, a.signature, a.date]}
            />
          </section>
        </div>
      )}
    </div>
  );
}
