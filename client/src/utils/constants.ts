import type { WheelSegmentData } from '../types/game';
import type { ProviderConfig, ProviderType } from '../types/provider';

export const WHEEL_SEGMENTS: WheelSegmentData[] = [
  { label: '10', value: 10, type: 'points', color: '#818cf8' },
  { label: '20', value: 20, type: 'points', color: '#a78bfa' },
  { label: 'İFLAS', value: 0, type: 'bankrupt', color: '#fb7185' },
  { label: '30', value: 30, type: 'points', color: '#fbbf24' },
  { label: '40', value: 40, type: 'points', color: '#34d399' },
  { label: 'PAS', value: 0, type: 'pass', color: '#94a3b8' },
  { label: '50', value: 50, type: 'points', color: '#60a5fa' },
  { label: '60', value: 60, type: 'points', color: '#f472b6' },
  { label: '+2 SORU', value: 50, type: 'bonus_questions', color: '#2dd4bf' },
  { label: '70', value: 70, type: 'points', color: '#fb923c' },
  { label: '80', value: 80, type: 'points', color: '#c084fc' },
  { label: 'ÇİFT PUAN', value: 100, type: 'double_points', color: '#facc15' },
  { label: '90', value: 90, type: 'points', color: '#22d3ee' },
  { label: '100', value: 100, type: 'points', color: '#4ade80' },
];

export const PROVIDER_CONFIGS: Record<ProviderType, ProviderConfig> = {
  openai: {
    name: 'OpenAI',
    baseUrl: 'https://api.openai.com',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'],
    icon: 'openai',
  },
  anthropic: {
    name: 'Claude (Anthropic)',
    baseUrl: 'https://api.anthropic.com',
    models: ['claude-sonnet-4-20250514', 'claude-haiku-4-20250414', 'claude-3-5-sonnet-20241022'],
    icon: 'anthropic',
  },
  gemini: {
    name: 'Gemini (Google)',
    baseUrl: 'https://generativelanguage.googleapis.com',
    models: ['gemini-2.0-flash', 'gemini-2.0-flash-lite', 'gemini-1.5-pro'],
    icon: 'gemini',
  },
  groq: {
    name: 'Groq',
    baseUrl: 'https://api.groq.com/openai',
    models: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768'],
    icon: 'groq',
  },
  openrouter: {
    name: 'OpenRouter',
    baseUrl: 'https://openrouter.ai/api',
    models: ['anthropic/claude-3.5-sonnet', 'openai/gpt-4o', 'google/gemini-1.5-pro'],
    icon: 'openrouter',
  },
};

export const QUESTION_COUNTS = [10, 20, 50, 100] as const;

export const OPENROUTER_MODELS = [
  { value: 'anthropic/claude-3.5-sonnet', label: 'Claude 3.5 Sonnet' },
  { value: 'openai/gpt-4o', label: 'GPT-4o' },
  { value: 'google/gemini-pro-1.5', label: 'Gemini 1.5 Pro' },
];

export const OLLAMA_MODELS = [
  { value: 'llama3:latest', label: 'Llama 3' },
  { value: 'phi3:latest', label: 'Phi-3' },
  { value: 'gemma:latest', label: 'Gemma' },
  { value: 'mistral:latest', label: 'Mistral' }
];

export const GOOGLE_MODELS = [
  { value: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash' },
  { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' }
];
