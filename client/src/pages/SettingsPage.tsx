import Card from '../components/common/Card';
import ProviderSelector from '../components/settings/ProviderSelector';
import BaseUrlInput from '../components/settings/BaseUrlInput';
import ApiKeyInput from '../components/settings/ApiKeyInput';
import ModelSelector from '../components/settings/ModelSelector';
import ConnectionTest from '../components/settings/ConnectionTest';
import ThemeSelector from '../components/settings/ThemeSelector';

export default function SettingsPage() {
  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">API Ayarları</h1>
        <p className="text-sm text-slate-500 mt-1">
          Soru üretmek için kullanılacak AI sağlayıcısını yapılandırın.
        </p>
      </div>

      <Card className="space-y-6">
        <ThemeSelector />
        <div className="border-t border-border pt-6" />
        <ProviderSelector />
        <BaseUrlInput />
        <ApiKeyInput />
        <ModelSelector />
        <div className="border-t border-border pt-4">
          <ConnectionTest />
        </div>
      </Card>
    </div>
  );
}
