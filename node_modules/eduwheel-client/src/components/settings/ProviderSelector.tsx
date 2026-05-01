import { PROVIDER_CONFIGS } from '../../utils/constants';
import { useSettingsStore } from '../../store/useSettingsStore';
import type { ProviderType } from '../../types/provider';
import { HiCheck } from 'react-icons/hi2';

export default function ProviderSelector() {
  const { provider, setProvider } = useSettingsStore();

  const providers = Object.entries(PROVIDER_CONFIGS) as [ProviderType, typeof PROVIDER_CONFIGS[ProviderType]][];

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-700">AI Sağlayıcı</label>
      <div className="grid grid-cols-2 gap-3">
        {providers.map(([key, config]) => (
          <button
            key={key}
            onClick={() => setProvider(key)}
            className={`relative flex flex-col items-start gap-1 rounded-xl border p-4 text-left transition-all duration-200 ${
              provider === key
                ? 'border-indigo-300 bg-indigo-50 ring-2 ring-indigo-200'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            {provider === key && (
              <div className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600">
                <HiCheck className="h-3 w-3 text-white" />
              </div>
            )}
            <span className="text-sm font-semibold text-slate-800">{config.name}</span>
            <span className="text-xs text-slate-400 truncate w-full">{config.baseUrl}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
