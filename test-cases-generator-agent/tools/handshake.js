// Phase 2 (L - Link) verification. Run: npm run handshake [ID]
// Confirms .env creds reach the selected tracker + AI provider before any full logic runs.
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fetchIssue } from './jiraClient.js';
import { fetchItem } from './zohoClient.js';
import { aiChat } from './aiClient.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const config = {
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

const id = process.argv[2] || 'TICKET-ID-101';

async function main() {
  let ok = true;

  console.log(`— Tracker handshake (${config.tracker}) —`);
  try {
    const issue = config.tracker === 'zoho'
      ? await fetchItem(config, id)
      : await fetchIssue(config, id);
    console.log(`  PASS: ${issue.key} — "${issue.summary}"`);
  } catch (e) {
    ok = false;
    console.log(`  FAIL: ${e.message}`);
  }

  console.log(`— AI handshake (${config.provider}) —`);
  try {
    const r = await aiChat(
      config,
      [{ role: 'user', content: 'Reply with the JSON {"ok":true} and nothing else.' }],
      { json: true, temperature: 0, maxTokens: 100, maxRetries: 2 },
    );
    console.log(`  PASS: ${JSON.stringify(r)}`);
  } catch (e) {
    ok = false;
    console.log(`  FAIL: ${e.message}`);
  }

  console.log(ok ? '\nLINK OK ✅' : '\nLINK BROKEN ❌ (fill .env or check credentials)');
  process.exit(ok ? 0 : 1);
}

main();
