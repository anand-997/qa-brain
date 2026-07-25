// Vercel serverless function: POST /api/generate
// tracker fetch (jira/zoho) or pasted context -> generateTestCases(aiClient) -> md/csv/txt.
import { fetchIssue } from '../tools/jiraClient.js';
import { fetchItem } from '../tools/zohoClient.js';
import { issueFromContext } from '../tools/contextSource.js';
import { generateTestCases, renderMarkdown, renderCsv, renderTxt } from '../tools/testCases.js';

function mergeConfig(body = {}) {
  const c = body.config || {};
  const pick = (a, b) => (typeof a === 'string' && a.trim() ? a.trim() : b);
  return {
    tracker: pick(c.tracker, (process.env.TRACKER || 'jira').toLowerCase()),
    jiraUrl: pick(c.jiraUrl, process.env.JIRA_URL || ''),
    jiraEmail: pick(c.jiraEmail, process.env.JIRA_EMAIL || ''),
    jiraToken: pick(c.jiraToken, process.env.JIRA_API_TOKEN || process.env.JIRA_TOKEN || ''),
    zohoUrl: pick(c.zohoUrl, process.env.ZOHO_URL || ''),
    zohoToken: pick(c.zohoToken, process.env.ZOHO_TOKEN || ''),
    provider: pick(c.provider, (process.env.AI_PROVIDER || 'groq').toLowerCase()),
    model: pick(c.model, process.env.AI_MODEL || ''),
    groqKey: pick(c.groqKey, process.env.GROQ_KEY || ''),
    anthropicKey: pick(c.anthropicKey, process.env.ANTHROPIC_KEY || ''),
    githubToken: pick(c.githubToken, process.env.GITHUB_TOKEN || ''),
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    const id = (body.id || '').trim();
    const context = (body.context || '').trim();
    const options = {
      idPrefix: (body.idPrefix || '').trim(),
      priorityFocus: (body.priorityFocus || 'all').trim(),
    };

    const config = mergeConfig(body);

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

    res.status(200).json({ issue, payload, markdown, csv, txt });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
