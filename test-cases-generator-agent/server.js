// Layer 2 — Navigation. Express proxy: routes request -> tracker fetch (jira/zoho) or
// pasted context -> generateTestCases(aiClient) -> deterministic md/csv/txt -> response.
// Keeps API tokens server-side and fixes browser CORS to Jira/Zoho.
import express from 'express';
import dotenv from 'dotenv';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { fetchIssue } from './tools/jiraClient.js';
import { fetchItem } from './tools/zohoClient.js';
import { issueFromContext } from './tools/contextSource.js';
import { generateTestCases, renderMarkdown, renderCsv, renderTxt } from './tools/testCases.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const PORT = process.env.PORT || 8787;
const app = express();
app.use(express.json({ limit: '2mb' }));

function envConfig() {
  return {
    tracker: (process.env.TRACKER || 'jira').toLowerCase(),
    jiraUrl: process.env.JIRA_URL || '',
    jiraEmail: process.env.JIRA_EMAIL || '',
    jiraToken: process.env.JIRA_API_TOKEN || process.env.JIRA_TOKEN || '',
    zohoUrl: process.env.ZOHO_URL || '',
    zohoToken: process.env.ZOHO_TOKEN || '',
    provider: (process.env.AI_PROVIDER || 'groq').toLowerCase(),
    model: process.env.AI_MODEL || '',
    groqKey: process.env.GROQ_KEY || '',
    anthropicKey: process.env.ANTHROPIC_KEY || '',
    githubToken: process.env.GITHUB_TOKEN || '',
  };
}

// UI-provided non-empty values override .env defaults.
function mergeConfig(body = {}) {
  const env = envConfig();
  const c = body.config || {};
  const pick = (a, b) => (typeof a === 'string' && a.trim() ? a.trim() : b);
  return {
    tracker: pick(c.tracker, env.tracker),
    jiraUrl: pick(c.jiraUrl, env.jiraUrl),
    jiraEmail: pick(c.jiraEmail, env.jiraEmail),
    jiraToken: pick(c.jiraToken, env.jiraToken),
    zohoUrl: pick(c.zohoUrl, env.zohoUrl),
    zohoToken: pick(c.zohoToken, env.zohoToken),
    provider: pick(c.provider, env.provider),
    model: pick(c.model, env.model),
    groqKey: pick(c.groqKey, env.groqKey),
    anthropicKey: pick(c.anthropicKey, env.anthropicKey),
    githubToken: pick(c.githubToken, env.githubToken),
  };
}

// Non-secret config presence, so the UI can prefill + warn.
app.get('/api/config', (_req, res) => {
  const env = envConfig();
  res.json({
    tracker: env.tracker,
    provider: env.provider,
    model: env.model,
    jiraUrl: env.jiraUrl,
    jiraEmail: env.jiraEmail,
    hasJiraToken: Boolean(env.jiraToken),
    zohoUrl: env.zohoUrl,
    hasZohoToken: Boolean(env.zohoToken),
    hasGroqKey: Boolean(env.groqKey),
    hasAnthropicKey: Boolean(env.anthropicKey),
    hasGithubToken: Boolean(env.githubToken),
  });
});

app.post('/api/generate', async (req, res) => {
  try {
    const id = (req.body?.id || '').trim();
    const context = (req.body?.context || '').trim();
    const options = {
      idPrefix: (req.body?.idPrefix || '').trim(),
      priorityFocus: (req.body?.priorityFocus || 'all').trim(),
    };

    const config = mergeConfig(req.body);

    // Context path needs only an AI key; tracker path needs full tracker creds.
    let issue;
    if (context) {
      issue = issueFromContext(context);
    } else if (id) {
      issue = config.tracker === 'zoho'
        ? await fetchItem(config, id)
        : await fetchIssue(config, id);
    } else {
      return res.status(400).json({ error: 'Provide a Jira/Zoho ID or requirement context' });
    }

    const payload = await generateTestCases(config, issue, options);
    const markdown = renderMarkdown(payload, issue);
    const csv = renderCsv(payload);
    const txt = renderTxt(payload, issue);

    res.json({ issue, payload, markdown, csv, txt });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/save', (req, res) => {
  try {
    const id = (req.body?.id || 'testcases').trim().replace(/[^A-Za-z0-9_-]/g, '_');
    const dir = path.join(__dirname, 'output');
    fs.mkdirSync(dir, { recursive: true });
    const written = [];
    if (req.body?.markdown) {
      fs.writeFileSync(path.join(dir, `test-cases-${id}.md`), req.body.markdown, 'utf8');
      written.push(`output/test-cases-${id}.md`);
    }
    if (req.body?.csv) {
      fs.writeFileSync(path.join(dir, `test-cases-${id}.csv`), req.body.csv, 'utf8');
      written.push(`output/test-cases-${id}.csv`);
    }
    res.json({ paths: written });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve the built frontend in production (after `npm run build`).
const dist = path.join(__dirname, 'dist');
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get(/^(?!\/api).*/, (_req, res) => res.sendFile(path.join(dist, 'index.html')));
}

app.listen(PORT, () => console.log(`[server] proxy listening on http://localhost:${PORT}`));
