// Vercel serverless function: POST /api/generate — Jira fetch -> GROQ -> Markdown.
import { fetchIssue } from '../tools/jiraClient.js';
import { issueFromContext } from '../tools/contextSource.js';
import { generateStrategy, renderMarkdown } from '../tools/testStrategy.js';

function mergeConfig(body = {}) {
  const c = body.config || {};
  return {
    jiraUrl: (c.jiraUrl || '').trim() || process.env.JIRA_URL || '',
    jiraEmail: (c.jiraEmail || '').trim() || process.env.JIRA_EMAIL || '',
    jiraToken: (c.jiraToken || '').trim() || process.env.JIRA_API_TOKEN || process.env.JIRA_TOKEN || '',
    groqKey: (c.groqKey || '').trim() || process.env.GROQ_KEY || '',
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    const jiraId = (body.jiraId || '').trim();
    const context = (body.context || '').trim();

    const config = mergeConfig(body);
    // Context path needs only a GROQ key; Jira path needs full Jira creds.
    let issue;
    if (context) {
      issue = issueFromContext(context);
    } else if (jiraId) {
      issue = await fetchIssue(config, jiraId);
    } else {
      return res.status(400).json({ error: 'Provide a Jira ID or requirement context' });
    }
    const strategy = await generateStrategy(config, issue);
    const markdown = renderMarkdown(strategy, issue);

    res.status(200).json({ issue, strategy, markdown });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
