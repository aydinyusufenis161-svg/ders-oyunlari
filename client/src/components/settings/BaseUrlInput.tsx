import { useSettingsStore } from '../../store/useSettingsStore';

export default function BaseUrlInput() {
  const { provider, baseUrls, setBaseUrl } = useSettingsStore();
  const value = baseUrls[provider] ?? '';

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-700">API Base URL</label>
      <input
        type="url"
        value={value}
        onChange={(e) => setBaseUrl(provider, e.target.value)}
        placeholder="Örn: https://api.openai.com"
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
      />
      <p className="text-xs text-slate-400">
        İsteğe bağlı. Boş bırakırsan sağlayıcının varsayılan URL’i kullanılır.
      </p>
    </div>
  );
}

