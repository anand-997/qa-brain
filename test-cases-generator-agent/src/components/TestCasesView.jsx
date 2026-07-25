import React, { useMemo, useState } from 'react';

const PRIORITY_CLASS = { P0: 'p0', P1: 'p1', P2: 'p2', P3: 'p3' };

function Chip({ label, count, kind }) {
  return (
    <span className={`chip ${kind || ''}`}>
      <span className="chip-label">{label}</span>
      <span className="chip-count">{count}</span>
    </span>
  );
}

export default function TestCasesView({ payload, issue, markdown }) {
  const [raw, setRaw] = useState(false);
  const [sortKey, setSortKey] = useState('id');
  const [sortDir, setSortDir] = useState('asc');
  const [open, setOpen] = useState(() => new Set());

  const cases = payload?.testCases || [];
  const cov = payload?.coverage || { total: 0, byType: {}, byTechnique: {}, byPriority: {} };

  const sorted = useMemo(() => {
    const arr = [...cases];
    arr.sort((a, b) => {
      const av = String(a[sortKey] ?? '').toLowerCase();
      const bv = String(b[sortKey] ?? '').toLowerCase();
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return arr;
  }, [cases, sortKey, sortDir]);

  function sortBy(k) {
    if (k === sortKey) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(k); setSortDir('asc'); }
  }

  function toggle(id) {
    setOpen((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }

  const arrow = (k) => (k === sortKey ? (sortDir === 'asc' ? ' ▲' : ' ▼') : '');

  const COLS = [
    { k: 'id', label: 'ID' },
    { k: 'title', label: 'Title' },
    { k: 'module', label: 'Module' },
    { k: 'priority', label: 'Pri' },
    { k: 'testType', label: 'Type' },
    { k: 'technique', label: 'Technique' },
  ];

  return (
    <div className="cases">
      <div className="cases-head">
        <div>
          <h3>{issue.summary || issue.key}</h3>
          <p className="meta">
            <span>{issue.key}</span> · <span>{issue.issueType}</span> · <span>{issue.priority}</span> · <span>{issue.status}</span>
          </p>
        </div>
        <button className="ghost" onClick={() => setRaw((r) => !r)}>
          {raw ? 'Formatted' : 'Markdown'}
        </button>
      </div>

      {/* Coverage summary */}
      <div className="coverage">
        <Chip label="TOTAL" count={cov.total} kind="total" />
        {Object.entries(cov.byPriority).map(([k, v]) => (
          <Chip key={k} label={k} count={v} kind={PRIORITY_CLASS[k] || ''} />
        ))}
        <span className="cov-sep" />
        {Object.entries(cov.byType).map(([k, v]) => (
          <Chip key={k} label={k} count={v} kind="type" />
        ))}
        <span className="cov-sep" />
        {Object.entries(cov.byTechnique).map(([k, v]) => (
          <Chip key={k} label={k} count={v} kind="tech" />
        ))}
      </div>

      {raw ? (
        <pre className="md">{markdown}</pre>
      ) : cases.length === 0 ? (
        <p className="tbd">No test cases were generated.</p>
      ) : (
        <div className="table-wrap">
          <table className="tc-table">
            <thead>
              <tr>
                <th className="expander" />
                {COLS.map((c) => (
                  <th key={c.k} onClick={() => sortBy(c.k)} className="sortable">
                    {c.label}{arrow(c.k)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((c) => {
                const isOpen = open.has(c.id);
                return (
                  <React.Fragment key={c.id}>
                    <tr className={isOpen ? 'row open' : 'row'} onClick={() => toggle(c.id)}>
                      <td className="expander">{isOpen ? '−' : '+'}</td>
                      <td className="mono id-cell">{c.id}</td>
                      <td className="title-cell">{c.title}</td>
                      <td>{c.module}</td>
                      <td><span className={`pri ${PRIORITY_CLASS[c.priority] || ''}`}>{c.priority}</span></td>
                      <td><span className="tag type">{c.testType}</span></td>
                      <td><span className="tag tech">{c.technique}</span></td>
                    </tr>
                    {isOpen && (
                      <tr className="detail">
                        <td />
                        <td colSpan={6}>
                          <dl className="tc-detail">
                            <dt>Change Reference</dt><dd>{c.changeReference}</dd>
                            <dt>Objective</dt><dd>{c.objective}</dd>
                            <dt>Test Data</dt><dd>{c.testData}</dd>
                            <dt>Expected Result</dt><dd>{c.expectedResult}</dd>
                            <dt>Test Environment</dt><dd>{c.testEnvironment}</dd>
                            {c.notes && (<><dt>Notes</dt><dd>{c.notes}</dd></>)}
                          </dl>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
