import React, { useState } from 'react';
import { generateTestCases, saveTestCases } from '../lib/api.js';
import TestCasesView from './TestCasesView.jsx';

export default function Generator({ config, envStatus, goSettings }) {
  const [mode, setMode] = useState('id'); // 'id' | 'context'
  const [id, setId] = useState('TICKET-ID-101');
  const [context, setContext] = useState('');
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [savedPaths, setSavedPaths] = useState([]);

  const trackerLabel = config.tracker === 'zoho' ? 'Zoho Sprints' : 'Jira';

  const hasTracker =
    config.tracker === 'zoho'
      ? (config.zohoUrl || envStatus?.zohoUrl) && (config.zohoToken || envStatus?.hasZohoToken)
      : (config.jiraUrl || envStatus?.jiraUrl) &&
        (config.jiraEmail || envStatus?.jiraEmail) &&
        (config.jiraToken || envStatus?.hasJiraToken);

  const providerKeyPresent = (() => {
    if (config.provider === 'anthropic') return config.anthropicKey || envStatus?.hasAnthropicKey;
    if (config.provider === 'copilot') return config.githubToken || envStatus?.hasGithubToken;
    return config.groqKey || envStatus?.hasGroqKey;
  })();

  const ready = mode === 'id' ? Boolean(hasTracker && providerKeyPresent) : Boolean(providerKeyPresent);
  const canSubmit = mode === 'id' ? Boolean(id.trim()) : Boolean(context.trim());
  const fileBase = () => (mode === 'id' ? id.trim() : 'requirement').replace(/[^A-Za-z0-9_-]/g, '_');

  function onFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setContext(String(reader.result || ''));
      setFileName(file.name);
    };
    reader.readAsText(file);
  }

  async function onGenerate(e) {
    e.preventDefault();
    setError('');
    setResult(null);
    setSavedPaths([]);
    setLoading(true);
    try {
      const data = await generateTestCases({
        id: mode === 'id' ? id.trim() : '',
        context: mode === 'context' ? context.trim() : '',
        config,
        idPrefix: config.idPrefix || '',
        priorityFocus: config.priorityFocus || 'all',
      });
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function downloadFile(content, ext, mime) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `test-cases-${fileBase()}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function saveServer() {
    setError('');
    try {
      const r = await saveTestCases(fileBase(), result.markdown, result.csv);
      setSavedPaths(r.paths || []);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="card">
      <div className="card-head">
        <span className="eyebrow">01 — B.L.A.S.T · Generator</span>
        <h2>Generate Test Cases</h2>
      </div>

      <div className="segmented">
        <button type="button" className={mode === 'id' ? 'seg active' : 'seg'} onClick={() => setMode('id')}>
          {trackerLabel} ID
        </button>
        <button type="button" className={mode === 'context' ? 'seg active' : 'seg'} onClick={() => setMode('context')}>
          Requirement / Context
        </button>
      </div>

      {!ready && (
        <div className="warn">
          {mode === 'id'
            ? `${trackerLabel} credentials + an AI provider key are required. `
            : 'An AI provider key is required. '}
          <button className="link" onClick={goSettings}>Open Settings →</button>
        </div>
      )}

      <form onSubmit={onGenerate} className="genform">
        {mode === 'id' ? (
          <div className="genrow">
            <input
              className="id-input"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder={config.tracker === 'zoho' ? 'I123' : 'TICKET-ID-101'}
              spellCheck="false"
            />
            <button type="submit" className="primary" disabled={loading || !canSubmit}>
              {loading ? 'Generating…' : 'Generate ▸'}
            </button>
          </div>
        ) : (
          <>
            <textarea
              className="ctx-input"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Paste the requirement, user story, or acceptance criteria here…"
              rows={9}
              spellCheck="false"
            />
            <div className="genrow ctx-actions">
              <label className="filepick">
                <input type="file" accept=".txt,.md,text/plain,text/markdown" onChange={onFile} />
                <span>📎 Attach .txt / .md</span>
              </label>
              {fileName && <span className="muted-inline">Loaded <code>{fileName}</code></span>}
              <span className="spacer" />
              <button type="submit" className="primary" disabled={loading || !canSubmit}>
                {loading ? 'Generating…' : 'Generate ▸'}
              </button>
            </div>
          </>
        )}
      </form>

      {loading && (
        <div className="loader">
          <span className="scan" />
          {mode === 'id' ? `Fetching ${trackerLabel} issue + generating cases…` : 'Generating test cases…'}
          <em>Token-safe: large requirements are auto-batched until complete.</em>
        </div>
      )}
      {error && <div className="error">⚠ {error}</div>}

      {result && (
        <>
          {result.payload?.warnings?.length > 0 && (
            <div className="warn soft">
              ⚠ {result.payload.warnings.length} small chunk(s) hit token limits and were skipped after retries.
            </div>
          )}
          <div className="actions">
            <button onClick={() => downloadFile(result.markdown, 'md', 'text/markdown')} className="ghost">⬇ .md</button>
            <button onClick={() => downloadFile(result.csv, 'csv', 'text/csv')} className="ghost">⬇ .csv</button>
            <button onClick={() => downloadFile(result.txt, 'txt', 'text/plain')} className="ghost">⬇ .txt</button>
            <span className="spacer" />
            <button onClick={saveServer} className="ghost">💾 Save to server</button>
            {savedPaths.map((p) => (
              <span key={p} className="ok">→ <code>{p}</code></span>
            ))}
          </div>
          <TestCasesView payload={result.payload} issue={result.issue} markdown={result.markdown} />
        </>
      )}
    </section>
  );
}
