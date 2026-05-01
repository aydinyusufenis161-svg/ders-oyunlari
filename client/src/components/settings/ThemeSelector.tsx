import Card from '../common/Card';
import { useThemeStore, type ThemeId } from '../../store/useThemeStore';

const THEMES: { id: ThemeId; name: string; hint: string }[] = [
  { id: 'cloud', name: 'Cloud', hint: 'Minimal & açık' },
  { id: 'mint', name: 'Mint', hint: 'Yumuşak & ferah' },
  { id: 'midnight', name: 'Midnight', hint: 'Koyu & sakin' },
];

export default function ThemeSelector() {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-700">Tema</label>
      <div className="grid grid-cols-3 gap-3">
        {THEMES.map((t) => (
          <button key={t.id} type="button" onClick={() => setTheme(t.id)} className="text-left">
            <Card
              className={`p-4 transition-all ${
                theme === t.id ? 'ring-2 ring-primary/30 border-primary/30' : 'hover:shadow-card-hover'
              }`}
            >
              <div className="text-sm font-semibold text-slate-800">{t.name}</div>
              <div className="text-xs text-slate-500 mt-0.5">{t.hint}</div>
            </Card>
          </button>
        ))}
      </div>
    </div>
  );
}

