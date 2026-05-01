export type BaseUrlFlavor = 'openai-compatible' | 'anthropic' | 'gemini';

function stripTrailingOnce(url: string, suffix: string): string {
  return url.endsWith(suffix) ? url.slice(0, -suffix.length) : url;
}

export function normalizeBaseUrl(input: string, flavor: BaseUrlFlavor): string {
  let url = (input || '').trim();
  url = url.replace(/\/+$/, ''); // remove trailing slashes

  if (!url) return url;

  // Common user mistake: entering base URL that already includes version path.
  // We keep baseUrl as the "host + optional prefix" and add endpoint paths in providers.
  if (flavor === 'gemini') {
    url = stripTrailingOnce(url, '/v1beta');
    url = stripTrailingOnce(url, '/v1');
    return url;
  }

  // OpenAI/Groq-compatible + Anthropic: strip trailing /v1 if provided.
  url = stripTrailingOnce(url, '/v1');
  return url;
}

