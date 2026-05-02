import { useState } from 'react';
import axios from 'axios';
import { useSettingsStore } from '../../store/useSettingsStore';
import Button from '../common/Button';

export default function ConnectionTest() {
  const getActiveConfig = useSettingsStore(s => s.getActiveConfig);
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleTest = async () => {
    setStatus('testing');
    setMessage('Bağlantı test ediliyor...');

    try {
      const config = getActiveConfig();
      const { provider, baseUrl, apiKey, model } = config;
      
      if (!apiKey && provider !== 'ollama') {
        setStatus('error');
        setMessage('API Anahtarı eksik!');
        return;
      }

      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8045/api';
      const res = await axios.post(`${API_BASE_URL}/ai/test`, {
        provider,
        baseUrl,
        apiKey,
        model,
      });

      if (res.data.success) {
        setStatus('success');
        setMessage(res.data.message || 'Bağlantı başarılı!');
      } else {
        setStatus('error');
        setMessage(res.data.message || 'Hata oluştu.');
      }
    } catch (err: any) {
      setStatus('error');
      setMessage(err.response?.data?.message || err.message || 'Ağ hatası.');
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-700">Bağlantı Testi</p>
        <p className="text-xs text-slate-500">Mevcut yapılandırmayı (Model, API vb.) test et.</p>
        {status !== 'idle' && (
          <p className={`text-xs mt-1 font-semibold ${status === 'error' ? 'text-red-500' : status === 'success' ? 'text-green-500' : 'text-blue-500'}`}>
            {message}
          </p>
        )}
      </div>
      <Button 
        onClick={handleTest} 
        disabled={status === 'testing'}
        variant={status === 'success' ? 'primary' : status === 'error' ? 'danger' : 'outline'}
        size="sm"
      >
        {status === 'testing' ? 'Test Ediliyor...' : status === 'success' ? 'Bağlantı Başarılı' : 'Test Et'}
      </Button>
    </div>
  );
}
