import { useState } from 'react';
import { useSettingsStore } from '../../store/useSettingsStore';
import { HiEye, HiEyeSlash } from 'react-icons/hi2';

export default function ApiKeyInput() {
  const { provider, apiKeys, setApiKey } = useSettingsStore();
  const [show, setShow] = useState(false);
  const currentKey = apiKeys[provider];

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-700">API Key</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={currentKey}
          onChange={(e) => setApiKey(provider, e.target.value)}
          placeholder="API anahtarınızı girin..."
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 pr-12 text-sm text-slate-900 placeholder-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          {show ? <HiEyeSlash className="h-5 w-5" /> : <HiEye className="h-5 w-5" />}
        </button>
      </div>
      <p className="text-xs text-slate-400">API anahtarınız tarayıcınızda yerel olarak saklanır.</p>
    </div>
  );
}
