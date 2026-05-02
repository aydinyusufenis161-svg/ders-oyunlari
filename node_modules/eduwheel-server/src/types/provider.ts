export type ProviderType = 'openai' | 'anthropic' | 'gemini' | 'groq' | 'openrouter';

export interface ChatParams {
  apiKey: string;
  model: string;
  systemPrompt: string;
  userPrompt: string;
  baseUrl?: string;
  temperature?: number;
  maxTokens?: number;
}
