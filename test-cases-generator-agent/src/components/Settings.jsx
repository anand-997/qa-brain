import React, { useState } from 'react';

const TRACKERS = [
  { key: 'jira', label: 'Jira Cloud' },
  { key: 'zoho', label: 'Zoho Sprints' },
];

const PROVIDERS = [
  {
    key: 'groq', label: 'Groq', tag: 'FREE',
    keyField: 'groqKey', keyLabel: 'Groq API Key', ph: 'gsk_...',
    models: ['openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'qwen/qwen3-32b'],
  },
  {
    key: 'anthropic', label: 'Claude', tag: 'ANTHROPIC',
    keyField: 'anthropicKey', keyLabel: 'Anthropic API Key', ph: 'sk-ant-...',
    models: ['claude-opus-4-8', 'claude-sonnet-4-6', 'claude-haiku-4-5-20251001'],
  },
  {
    key: 'copilot', label: 'GitHub Copilot', tag: 'BEST-EFFORT',
    keyField: 'githubToken', keyLabel: 'GitHub Token (models)', ph: 'ghp_...',
    models: ['openai/gpt-4o', 'openai/gpt-4o-mini', 'openai/o3-mini'],
  },
];

const PRIORITY_FOCUS = [
  { key: 'all', label: 'All (P0–P3)' },
  { key: 'p0p1', label: 'P0 + P1' },
  { key: 'p0', label: 'P0 only' },
];

export default function Settings({ config, onSave, envStatus }) {
  const [form, setForm] = useState(config);
  const [saved, setSaved] = useState(false);

  function update(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
    setSaved(false);
  }

  function selectProvider(p) {
    // Switch provider and prefill the default model for that provider.
    setForm((f) => ({ ...f, provider: p.key, model: p.models[0] }));
    setSaved(false);
  }

  function submit(e) {
    e.preventDefault();
    onSave(form);
    setSaved(true);
  }

  const activeProvider = PROVIDERS.find((p) => p.key === form.provider) || PROVIDERS[0];
  // Keep the dropdown value valid even if a model from another provider is stored.
  const selectedModel = activeProvider.models.includes(form.model) ? form.model : activeProvider.models[0];

  return (
    <section className="card">
      <div className="card-head">
        <span className="eyebrow">02 — Configuration</span>
        <h2>Settings</h2>
      </div>
      <p className="muted">
        Stored locally in your browser. Blank fields fall back to the server <code>.env</code>.
        The <strong>AI provider key is always required</strong>; tracker fields are only needed for ID mode.
      </p>

      <form onSubmit={submit} className="form">
        {/* ── Tracker ── */}
        <fieldset className="block">
          <legend>Test Management Tool</legend>
          <div className="segmented">
            {TRACKERS.map((t) => (
              <button
                type="button"
                key={t.key}
                className={form.tracker === t.key ? 'seg active' : 'seg'}
                onClick={() => update('tracker', t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {form.tracker === 'jira' ? (
            <div className="fieldgrid">
              <Field label="Jira Base URL" v={form.jiraUrl} ph="https://your-domain.atlassian.net" on={(v) => update('jiraUrl', v)} />
              <Field label="Jira Email" v={form.jiraEmail} ph="you@example.com" on={(v) => update('jiraEmail', v)} />
              <Field label="Jira API Token" type="password" v={form.jiraToken} ph="ATATT..." on={(v) => update('jiraToken', v)} />
            </div>
          ) : (
            <div className="fieldgrid">
              <Field label="Zoho Base URL" v={form.zohoUrl} ph="https://sprints.zoho.com/api/v3/team/<id>" on={(v) => update('zohoUrl', v)} />
              <Field label="Zoho Token / API Key" type="password" v={form.zohoToken} ph="oauth / api token" on={(v) => update('zohoToken', v)} />
            </div>
          )}
        </fieldset>

        {/* ── AI provider ── */}
        <fieldset className="block">
          <legend>AI Provider</legend>
          <div className="segmented">
            {PROVIDERS.map((p) => (
              <button
                type="button"
                key={p.key}
                className={form.provider === p.key ? 'seg active' : 'seg'}
                onClick={() => selectProvider(p)}
              >
                {p.label}
                <span className="seg-tag">{p.tag}</span>
              </button>
            ))}
          </div>

          <div className="fieldgrid">
            <label className="field">
              <span>Model</span>
              <select
                className="select"
                value={selectedModel}
                onChange={(e) => update('model', e.target.value)}
              >
                {activeProvider.models.map((m, i) => (
                  <option key={m} value={m}>
                    {m}{i === 0 ? ' (default)' : ''}
                  </option>
                ))}
              </select>
            </label>
            <Field
              label={activeProvider.keyLabel}
              type="password"
              v={form[activeProvider.keyField]}
              ph={activeProvider.ph}
              on={(v) => update(activeProvider.keyField, v)}
            />
          </div>
        </fieldset>

        {/* ── Defaults ── */}
        <fieldset className="block">
          <legend>Test-Case Defaults</legend>
          <div className="fieldgrid">
            <label className="field">
              <span>ID Prefix <em className="hint">optional</em></span>
              <input
                value={form.idPrefix || ''}
                placeholder="e.g. TC_AUTH"
                onChange={(e) => update('idPrefix', e.target.value)}
                autoComplete="off" spellCheck="false"
              />
            </label>
            <label className="field">
              <span>Priority Focus</span>
              <div className="segmented small">
                {PRIORITY_FOCUS.map((p) => (
                  <button
                    type="button"
                    key={p.key}
                    className={(form.priorityFocus || 'all') === p.key ? 'seg active' : 'seg'}
                    onClick={() => update('priorityFocus', p.key)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </label>
          </div>
        </fieldset>

        <div className="row">
          <button type="submit" className="primary">Save settings</button>
          {saved && <span className="ok">Saved ✓</span>}
        </div>
      </form>

      {envStatus && (
        <div className="envbox">
          <h3>Server <code>.env</code> status</h3>
          <ul className="env-grid">
            <li><span>Tracker</span> <code>{envStatus.tracker || '—'}</code></li>
            <li><span>Provider</span> <code>{envStatus.provider || '—'}</code></li>
            <li><span>Jira URL</span> {envStatus.jiraUrl ? <code>{envStatus.jiraUrl}</code> : <em>not set</em>}</li>
            <li><span>Jira Token</span> {envStatus.hasJiraToken ? <b className="set">set</b> : <em>not set</em>}</li>
            <li><span>Zoho URL</span> {envStatus.zohoUrl ? <code>{envStatus.zohoUrl}</code> : <em>not set</em>}</li>
            <li><span>Zoho Token</span> {envStatus.hasZohoToken ? <b className="set">set</b> : <em>not set</em>}</li>
            <li><span>Groq Key</span> {envStatus.hasGroqKey ? <b className="set">set</b> : <em>not set</em>}</li>
            <li><span>Anthropic Key</span> {envStatus.hasAnthropicKey ? <b className="set">set</b> : <em>not set</em>}</li>
            <li><span>GitHub Token</span> {envStatus.hasGithubToken ? <b className="set">set</b> : <em>not set</em>}</li>
          </ul>
        </div>
      )}
    </section>
  );
}

function Field({ label, v, ph, on, type = 'text' }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        type={type}
        value={v || ''}
        placeholder={ph}
        onChange={(e) => on(e.target.value)}
        autoComplete="off"
        spellCheck="false"
      />
    </label>
  );
}
