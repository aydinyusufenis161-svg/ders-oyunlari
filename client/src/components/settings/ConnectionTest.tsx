import { useState } from 'react';
import { useSettingsStore } from '../../store/useSettingsStore';
import { testConnection } from '../../services/gameService';
import Button from '../common/Button';
import { HiCheck, HiXMark } from 'react-icons/hi2';

export default function ConnectionTest() {
  const { provider, apiKeys, selectedModels, baseUrls } = useSettingsStore();
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleTest = async () => {
    const apiKey = apiKeys[provider];
    const model = selectedModels[provider];
    const baseUrl = baseUrls[provider];

    if (!apiKey) {
      setStatus('error');
      setMessage('Lütfen önce API anahtarınızı girin.');
      return;
    }

    setStatus('testing');
    try {
      const result = await testConnection({ provider, baseUrl, apiKey, model });
      setStatus(result.success ? 'success' : 'error');
      setMessage(result.message);
    } catch (err: unknown) {
      setStatus('error');
      const msg = err instanceof Error ? err.message : 'Bağlantı testi başarısız.';
      setMessage(msg);
    }
  };

  return (
    <div className="space-y-3">
      <Button
        variant="secondary"
        onClick={handleTest}
        loading={status === 'testing'}
        className="w-full"
      >
        {status === 'testing' ? 'Test ediliyor...' : 'Bağlantıyı Test Et'}
      </Button>

      {status === 'success' && (
        <div className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
          <HiCheck className="h-5 w-5 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {status === 'error' && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          <HiXMark className="h-5 w-5 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}
    </div>
  );
}
