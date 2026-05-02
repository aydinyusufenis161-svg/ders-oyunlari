import type { ProviderType } from '../types/provider.js';
import { BaseProvider } from './providers/base.js';
import { OpenAIProvider } from './providers/openai.js';
import { AnthropicProvider } from './providers/anthropic.js';
import { GeminiProvider } from './providers/gemini.js';
import { GroqProvider } from './providers/groq.js';
import { OpenRouterProvider } from './providers/openrouter.js';

const providers: Record<ProviderType, BaseProvider> = {
  openai: new OpenAIProvider(),
  anthropic: new AnthropicProvider(),
  gemini: new GeminiProvider(),
  groq: new GroqProvider(),
  openrouter: new OpenRouterProvider(),
};

export function getProvider(type: ProviderType): BaseProvider {
  const provider = providers[type];
  if (!provider) throw new Error(`Unknown provider: ${type}`);
  return provider;
}
