import { useState } from 'react';
import { useSettingsStore } from '../../store/useSettingsStore';
import { OPENROUTER_MODELS, OLLAMA_MODELS, GOOGLE_MODELS } from '../../utils/constants';

export default function ModelSelector() {
  const { provider, selectedModels, setModel, saveModel, removeSavedModel, savedModels } = useSettingsStore();
  const [customModel, setCustomModel] = useState('');

  // Fallback to empty array if constants are missing
  const modelOptions = 
    provider === 'openai' ? [] :
    provider === 'anthropic' ? [] :
    provider === 'gemini' ? (GOOGLE_MODELS || []) :
    provider === 'groq' ? [] : [];

  const handleSaveCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (customModel.trim()) {
      saveModel(provider, customModel);
      setModel(provider, customModel);
      setCustomModel('');
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Model
        </label>
        <select
          value={selectedModels[provider] || ''}
          onChange={(e) => setModel(provider, e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-4 py-2.5 bg-slate-50 text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
        >
          {/* Custom saved models first */}
          {savedModels[provider]?.length > 0 && (
            <optgroup label="Kaydedilen Modeller">
              {savedModels[provider].map((model) => (
                <option key={model} value={model}>
                  {model} (Kayıtlı)
                </option>
              ))}
            </optgroup>
          )}

          {/* Fallback to standard models if available */}
          <optgroup label="Standart Modeller">
            {modelOptions.length > 0 ? (
              modelOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            ) : (
              <option value={selectedModels[provider]}>{selectedModels[provider]}</option>
            )}
          </optgroup>
        </select>
      </div>

      <form onSubmit={handleSaveCustom} className="flex gap-2">
        <input
          type="text"
          value={customModel}
          onChange={(e) => setCustomModel(e.target.value)}
          placeholder="Özel model (Örn: gpt-4, claude-3)"
          className="flex-1 rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        <button
          type="submit"
          disabled={!customModel.trim()}
          className="px-4 py-2 bg-indigo-500 text-white text-sm font-medium rounded-xl hover:bg-indigo-600 disabled:opacity-50"
        >
          Ekle
        </button>
      </form>

      {/* List custom models to allow removal */}
      {savedModels[provider]?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {savedModels[provider].map(model => (
            <span key={model} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-xs font-medium text-slate-600">
              {model}
              <button 
                type="button" 
                onClick={() => removeSavedModel(provider, model)}
                className="text-slate-400 hover:text-red-500"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
