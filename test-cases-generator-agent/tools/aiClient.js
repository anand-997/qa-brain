// Layer 3 Tool — AI provider router. Atomic. Routes to groq | anthropic | copilot.
// Boundary rule (B.L.A.S.T.): this returns parsed JSON CONTENT; rendering is deterministic elsewhere.
//
// Token utilization is handled automatically and the loop never gives up silently:
//  - Transient errors (429 rate limit, 5xx) are retried with exponential backoff,
//    honoring the `retry-after` header when present.
//  - Token-limit errors (max tokens / context length / request too large / truncated JSON)
//    are surfaced as a typed TokenLimitError so the caller (testCases.js) can shrink the
//    batch and continue until ALL cases are generated.

export const DEFAULT_MODELS = {
  groq: 'openai/gpt-oss-120b',
  anthropic: 'claude-opus-4-8',
  copilot: 'openai/gpt-4o',
};

const ENDPOINTS = {
  groq: 'https://api.groq.com/openai/v1/chat/completions',
  anthropic: 'https://api.anthropic.com/v1/messages',
  copilot: 'https://models.github.ai/inference/chat/completions',
};

// Typed error so callers can react specifically to token pressure.
export class TokenLimitError extends Error {
  constructor(message) {
    super(message);
    this.name = 'TokenLimitError';
    this.isTokenLimit = true;
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function looksLikeTokenLimit(status, text) {
  const t = (text || '').toLowerCase();
  if (status === 413) return true;
  return (
    t.includes('context_length') ||
    t.includes('context length') ||
    t.includes('maximum context') ||
    t.includes('too many tokens') ||
    t.includes('reduce the length') ||
    t.includes('request too large') ||
    t.includes('max_tokens') ||
    t.includes('string too long') ||
    t.includes('tokens per minute') // TPM rate limit — shrinking the batch also helps
  );
}

function retryAfterMs(headers, attempt) {
  const ra = headers?.get?.('retry-after');
  if (ra) {
    const secs = Number(ra);
    if (!Number.isNaN(secs)) return Math.min(secs * 1000, 30000);
  }
  // Exponential backoff with jitter: 1s, 2s, 4s, 8s … capped at 30s.
  return Math.min(1000 * 2 ** attempt + Math.random() * 500, 30000);
}

function resolveKey(config) {
  switch (config.provider) {
    case 'anthropic':
      return config.anthropicKey;
    case 'copilot':
      return config.githubToken;
    case 'groq':
    default:
      return config.groqKey;
  }
}

// Build the provider-specific request body. Groq/Copilot are OpenAI-compatible;
// Anthropic uses its own Messages shape (system separated from messages).
function buildRequest(provider, model, messages, { json, temperature, maxTokens }) {
  if (provider === 'anthropic') {
    const system = messages.filter((m) => m.role === 'system').map((m) => m.content).join('\n\n');
    const rest = messages.filter((m) => m.role !== 'system').map((m) => ({ role: m.role, content: m.content }));
    return {
      url: ENDPOINTS.anthropic,
      headers: { 'anthropic-version': '2023-06-01', 'Content-Type': 'application/json' },
      body: { model, system, messages: rest, max_tokens: maxTokens, temperature },
    };
  }
  // OpenAI-compatible (groq, copilot)
  const body = { model, messages, temperature, max_tokens: maxTokens };
  if (json) body.response_format = { type: 'json_object' };
  return { url: ENDPOINTS[provider], headers: { 'Content-Type': 'application/json' }, body };
}

function extractContent(provider, data) {
  if (provider === 'anthropic') {
    const blocks = data?.content || [];
    return blocks.map((b) => (typeof b?.text === 'string' ? b.text : '')).join('');
  }
  return data?.choices?.[0]?.message?.content || '';
}

// Anthropic signals output truncation via stop_reason; treat as token pressure.
function isTruncated(provider, data) {
  if (provider === 'anthropic') return data?.stop_reason === 'max_tokens';
  return data?.choices?.[0]?.finish_reason === 'length';
}

/**
 * aiChat — one resilient chat completion.
 * @returns parsed JSON when opts.json (default), else raw string.
 * @throws TokenLimitError on token pressure; Error otherwise (after retries exhausted).
 */
export async function aiChat(config, messages, opts = {}) {
  const { json = true, temperature = 0.3, maxTokens = 8000, maxRetries = 5 } = opts;
  const provider = config.provider || 'groq';
  const model = (config.model || '').trim() || DEFAULT_MODELS[provider] || DEFAULT_MODELS.groq;
  const key = resolveKey(config);
  if (!key) throw new Error(`Missing ${provider} API key`);

  const req = buildRequest(provider, model, messages, { json, temperature, maxTokens });
  // Inject the real auth header now that we have the key.
  if (provider === 'anthropic') req.headers['x-api-key'] = key;
  else req.headers.Authorization = `Bearer ${key}`;

  let lastErr;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    let res;
    try {
      res = await fetch(req.url, {
        method: 'POST',
        headers: req.headers,
        body: JSON.stringify(req.body),
      });
    } catch (netErr) {
      // Network blip — retry with backoff.
      lastErr = netErr;
      await sleep(retryAfterMs(null, attempt));
      continue;
    }

    if (res.ok) {
      const data = await res.json().catch(() => null);
      if (!data) throw new Error(`${provider}: response was not JSON`);

      const content = extractContent(provider, data);
      if (isTruncated(provider, data)) {
        throw new TokenLimitError(`${provider}: output truncated at max tokens`);
      }
      if (!json) return content;
      try {
        return JSON.parse(content);
      } catch {
        // Truncated/over-long JSON is almost always token pressure.
        throw new TokenLimitError(`${provider}: returned invalid/truncated JSON`);
      }
    }

    const text = await res.text();

    // Token pressure → let the caller shrink the batch.
    if (looksLikeTokenLimit(res.status, text)) {
      throw new TokenLimitError(`${provider} ${res.status}: ${text.slice(0, 200)}`);
    }

    // Rate limit / server error → wait and retry.
    if (res.status === 429 || res.status >= 500) {
      lastErr = new Error(`${provider} ${res.status}: ${text.slice(0, 200)}`);
      if (attempt < maxRetries) {
        await sleep(retryAfterMs(res.headers, attempt));
        continue;
      }
    }

    // Other client errors are not retryable.
    throw new Error(`${provider} ${res.status}: ${text.slice(0, 300)}`);
  }

  throw lastErr || new Error(`${provider}: request failed after ${maxRetries} retries`);
}
