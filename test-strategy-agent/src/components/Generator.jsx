import React, { useState } from 'react';
import { generateStrategy, generateFromContext, saveStrategy } from '../lib/api.js';
import TestStrategyView from './TestStrategyView.jsx';

export default function Generator({ config, envStatus, goSettings }) {
  const [mode, setMode] = useState('jira'); // 'jira' | 'context'
  const [jiraId, setJiraId] = useState('TICKET-ID-101');
  const [context, setContext] = useState('');
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [savedPath, setSavedPath] = useState('');

  const hasJira =
    (config.jiraUrl || envStatus?.jiraUrl) &&
    (config.jiraEmail || envStatus?.jiraEmail) &&
    (config.jiraToken || envStatus?.hasJiraToken);
  const hasGroq = config.groqKey || envStatus?.hasGroqKey;
  // Jira mode needs full Jira creds + GROQ; Context mode needs only GROQ.
  const ready = mode === 'jira' ? Boolean(hasJira && hasGroq) : Boolean(hasGroq);

  const canSubmit = mode === 'jira' ? Boolean(jiraId.trim()) : Boolean(context.trim());
  // Filename base: Jira id, or a derived label for requirement mode.
  const fileBase = () =>
    (mode === 'jira' ? jiraId.trim() : 'requirement').replace(/[^A-Za-z0-9_-]/g, '_');

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
    setSavedPath('');
    setLoading(true);
    try {
      const data =
        mode === 'jira'
          ? await generateStrategy(jiraId.trim(), config)
          : await generateFromContext(context.trim(), config);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function download() {
    const blob = new Blob([result.markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `test-strategy-${fileBase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function saveServer() {
    setError('');
    try {
      const r = await saveStrategy(fileBase(), result.markdown);
      setSavedPath(r.path);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="card">
      <span className="eyebrow">B.L.A.S.T · Generator</span>
      <h2>Generate Test Strategy</h2>

      <div className="modes">
        <button
          type="button"
          className={mode === 'jira' ? 'active' : ''}
          onClick={() => setMode('jira')}
        >
          Jira ID
        </button>
        <button
          type="button"
          className={mode === 'context' ? 'active' : ''}
          onClick={() => setMode('context')}
        >
          Requirement / Context
        </button>
      </div>

      {!ready && (
        <div className="warn">
          {mode === 'jira'
            ? 'Jira credentials + GROQ key required. '
            : 'GROQ key required. '}
          <button className="link" onClick={goSettings}>Open Settings</button> or fill the
          server <code>.env</code>.
        </div>
      )}

      <form onSubmit={onGenerate} className="genform">
        {mode === 'jira' ? (
          <div className="genrow">
            <input
              className="jira-input"
              value={jiraId}
              onChange={(e) => setJiraId(e.target.value)}
              placeholder="TICKET-ID-101"
              spellCheck="false"
            />
            <button type="submit" className="primary" disabled={loading || !canSubmit}>
              {loading ? 'Generating…' : 'Generate'}
            </button>
          </div>
        ) : (
          <>
            <textarea
              className="ctx-input"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Paste the requirement, user story, or acceptance criteria here…"
              rows={8}
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
                {loading ? 'Generating…' : 'Generate'}
              </button>
            </div>
          </>
        )}
      </form>

      {loading && (
        <div className="loader">
          {mode === 'jira' ? 'Fetching issue + asking GROQ…' : 'Asking GROQ…'}
        </div>
      )}
      {error && <div className="error">⚠ {error}</div>}

      {result && (
        <>
          <div className="actions">
            <button onClick={download} className="ghost">⬇ Download .md</button>
            <button onClick={saveServer} className="ghost">💾 Save to server</button>
            {savedPath && (
              <span className="ok">
                Saved → <code>{savedPath}</code>
              </span>
            )}
          </div>
          <TestStrategyView strategy={result.strategy} issue={result.issue} markdown={result.markdown} />
        </>
      )}
    </section>
  );
}
