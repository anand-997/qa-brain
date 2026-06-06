// Vercel serverless function: GET /api/config — non-secret env presence for UI prefill.
function envConfig() {
  return {
    tracker: (process.env.TRACKER || 'jira').toLowerCase(),
    provider: (process.env.AI_PROVIDER || 'groq').toLowerCase(),
    model: process.env.AI_MODEL || '',
    jiraUrl: process.env.JIRA_URL || '',
    jiraEmail: process.env.JIRA_EMAIL || '',
    jiraToken: process.env.JIRA_API_TOKEN || process.env.JIRA_TOKEN || '',
    zohoUrl: process.env.ZOHO_URL || '',
    zohoToken: process.env.ZOHO_TOKEN || '',
    groqKey: process.env.GROQ_KEY || '',
    anthropicKey: process.env.ANTHROPIC_KEY || '',
    githubToken: process.env.GITHUB_TOKEN || '',
  };
}

export default function handler(_req, res) {
  const env = envConfig();
  res.status(200).json({
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
}
