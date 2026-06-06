import React, { useEffect, useState } from 'react';
import Settings from './components/Settings.jsx';
import Generator from './components/Generator.jsx';
import { getConfigStatus } from './lib/api.js';

const STORAGE_KEY = 'blast.strategy.config';
const THEME_KEY = 'blast.strategy.theme';
const emptyConfig = { jiraUrl: '', jiraEmail: '', jiraToken: '', groqKey: '' };

function initialTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'light' || saved === 'dark') return saved;
  // Fall back to the OS preference, defaulting to dark.
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

  // Apply + persist the theme by setting data-theme on <html>.
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
      <header className="topbar">
        <div className="brand">
          <span className="logo">▦</span>
          <div>
            <h1>Test Strategy Buddy</h1>
            <p className="sub">B.L.A.S.T. · GROQ <code>openai/gpt-oss-120b</code></p>
          </div>
        </div>
        <div className="topbar-right">
          <nav className="tabs">
            <button className={tab === 'generate' ? 'active' : ''} onClick={() => setTab('generate')}>Generate</button>
            <button className={tab === 'settings' ? 'active' : ''} onClick={() => setTab('settings')}>Settings</button>
          </nav>
          <button
            className="theme-toggle"
            onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            aria-label="Toggle dark / light mode"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
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

      <footer className="foot">Lightweight React · Express proxy · credentials stay local</footer>
    </div>
  );
}
