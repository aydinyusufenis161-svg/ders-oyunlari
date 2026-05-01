export type ProviderType = 'openai' | 'anthropic' | 'gemini' | 'groq';

export interface ProviderConfig {
  name: string;
  baseUrl: string;
  models: string[];
  icon: string;
}

export interface AIRequestPayload {
  provider: ProviderType;
  baseUrl?: string;
  apiKey: string;
  model: string;
  topic: string;
  questionCount: number;
  difficulty?: 'easy' | 'medium' | 'hard' | 'mixed';
  mode?: 'wheel' | 'true_false' | 'classic' | 'time_attack' | 'survival' | 'short_answer_rush';
}

export interface AITestPayload {
  provider: ProviderType;
  baseUrl?: string;
  apiKey: string;
  model: string;
}
