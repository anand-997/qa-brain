import React, { useEffect, useState } from 'react';
import Settings from './components/Settings.jsx';
import Generator from './components/Generator.jsx';
import { getConfigStatus } from './lib/api.js';

const STORAGE_KEY = 'blast.testcases.config';
const THEME_KEY = 'blast.testcases.theme';

const emptyConfig = {
  tracker: 'jira',
  jiraUrl: '', jiraEmail: '', jiraToken: '',
  zohoUrl: '', zohoToken: '',
  provider: 'groq',
  model: 'openai/gpt-oss-120b',
  groqKey: '', anthropicKey: '', githubToken: '',
  idPrefix: '', priorityFocus: 'all',
};

function initialTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

export default function App() {
  const [tab, setTab] = useState('generate');
  const [theme, setTheme] = useState(initialTheme);
  const [config, setConfig] = useState(() => {
    try {
      return { ...emptyConfig, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') };
    } catch {
      return emptyConfig;
    }
  });
  const [envStatus, setEnvStatus] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    getConfigStatus().then(setEnvStatus).catch(() => setEnvStatus(null));
  }, []);

  function saveConfig(next) {
    setConfig(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  return (
    <div className="app">
      <div className="grid-bg" aria-hidden="true" />

      <header className="topbar">
        <div className="brand">
          <span className="blast-mark" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <div className="brand-text">
            <h1>TEST&nbsp;CASES<span className="slash">//</span>BUDDY</h1>
            <p className="sub">
              B.L.A.S.T. PROTOCOL <span className="dot">·</span> AUTO TOKEN-SAFE GENERATION
            </p>
          </div>
        </div>

        <div className="topbar-right">
          <nav className="tabs" role="tablist">
            <button
              role="tab"
              className={tab === 'generate' ? 'active' : ''}
              onClick={() => setTab('generate')}
            >
              <span className="tab-idx">01</span> Generate
            </button>
            <button
              role="tab"
              className={tab === 'settings' ? 'active' : ''}
              onClick={() => setTab('settings')}
            >
              <span className="tab-idx">02</span> Settings
            </button>
          </nav>
          <button
            className="theme-toggle"
            onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            aria-label="Toggle dark / light mode"
          >
            {theme === 'dark' ? 'LIGHT' : 'DARK'}
          </button>
        </div>
      </header>

      <main className="content">
        {tab === 'generate' ? (
          <Generator config={config} envStatus={envStatus} goSettings={() => setTab('settings')} />
        ) : (
          <Settings config={config} onSave={saveConfig} envStatus={envStatus} />
        )}
      </main>

      <footer className="foot">
        <span>LIGHTWEIGHT REACT</span>
        <span className="sep">×</span>
        <span>EXPRESS PROXY</span>
        <span className="sep">×</span>
        <span>CREDENTIALS STAY LOCAL</span>
      </footer>
    </div>
  );
}
