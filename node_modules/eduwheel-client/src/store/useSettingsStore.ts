import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ProviderType } from '../types/provider';
import { PROVIDER_CONFIGS } from '../utils/constants';

interface SettingsState {
  provider: ProviderType;
  apiKeys: Record<ProviderType, string>;
  selectedModels: Record<ProviderType, string>;
  baseUrls: Record<ProviderType, string>;
  savedModels: Record<ProviderType, string[]>;
  setProvider: (p: ProviderType) => void;
  setApiKey: (provider: ProviderType, key: string) => void;
  setModel: (provider: ProviderType, model: string) => void;
  setBaseUrl: (provider: ProviderType, baseUrl: string) => void;
  saveModel: (provider: ProviderType, model: string) => void;
  removeSavedModel: (provider: ProviderType, model: string) => void;
  getActiveConfig: () => { provider: ProviderType; baseUrl: string; apiKey: string; model: string };
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      provider: 'openai',
      apiKeys: { openai: '', anthropic: '', gemini: '', groq: '', openrouter: '' },
      selectedModels: {
        openai: 'gpt-4o-mini',
        anthropic: 'claude-sonnet-4-20250514',
        gemini: 'gemini-2.0-flash',
        groq: 'llama-3.3-70b-versatile',
        openrouter: 'openai/gpt-4o',
      },
      baseUrls: {
        openai: PROVIDER_CONFIGS.openai.baseUrl,
        anthropic: PROVIDER_CONFIGS.anthropic.baseUrl,
        gemini: PROVIDER_CONFIGS.gemini.baseUrl,
        groq: PROVIDER_CONFIGS.groq.baseUrl,
        openrouter: PROVIDER_CONFIGS.openrouter.baseUrl,
      },
      savedModels: { openai: [], anthropic: [], gemini: [], groq: [], openrouter: [] },
      setProvider: (p) => set({ provider: p }),
      setApiKey: (provider, key) =>
        set((state) => ({ apiKeys: { ...state.apiKeys, [provider]: key } })),
      setModel: (provider, model) =>
        set((state) => ({ selectedModels: { ...state.selectedModels, [provider]: model } })),
      setBaseUrl: (provider, baseUrl) =>
        set((state) => ({ baseUrls: { ...state.baseUrls, [provider]: baseUrl } })),
      saveModel: (provider, model) =>
        set((state) => {
          const m = model.trim();
          if (!m) return state as any;
          const existing = state.savedModels[provider] || [];
          if (existing.includes(m)) return state as any;
          return { savedModels: { ...state.savedModels, [provider]: [m, ...existing] } };
        }),
      removeSavedModel: (provider, model) =>
        set((state) => ({
          savedModels: {
            ...state.savedModels,
            [provider]: (state.savedModels[provider] || []).filter((m) => m !== model),
          },
        })),
      getActiveConfig: () => {
        const state = get();
        return {
          provider: state.provider,
          baseUrl: state.baseUrls[state.provider],
          apiKey: state.apiKeys[state.provider],
          model: state.selectedModels[state.provider],
        };
      },
    }),
    { name: 'eduwheel-settings' }
  )
);
