import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSavedGamesStore } from '../store/useSavedGamesStore';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import { formatDate, formatScore } from '../utils/formatters';
import { HiPlus, HiTrash, HiPlayCircle } from 'react-icons/hi2';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { games, loading, fetchGames, removeGame } = useSavedGamesStore();

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Hoş Geldiniz</h1>
          <p className="text-sm text-slate-500 mt-1">Eğlenerek öğrenmeye hazır mısınız?</p>
        </div>
        <Button onClick={() => navigate('/game/setup')} size="lg">
          <HiPlus className="h-5 w-5" />
          Yeni Oyun
        </Button>
      </div>

      <Card
        hover
        onClick={() => navigate('/game/setup')}
        className="border-dashed border-2 border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center py-12 hover:border-indigo-300 hover:bg-indigo-50/30 group"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 group-hover:bg-indigo-200 transition-colors">
          <HiPlayCircle className="h-7 w-7" />
        </div>
        <p className="mt-4 text-sm font-semibold text-slate-700">Çarkıfelek Oyunu</p>
        <p className="text-xs text-slate-400 mt-1">Konu seç, soruları üret, çarkı çevir!</p>
      </Card>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-800">Kayıtlı Oyunlar</h2>

        {loading ? (
          <div className="py-12"><Spinner /></div>
        ) : !games || games.length === 0 ? (
          <Card className="text-center py-10">
            <p className="text-sm text-slate-400">Henüz kayıtlı oyun yok.</p>
            <p className="text-xs text-slate-300 mt-1">Yeni bir oyun başlatarak ilk oyununuzu oluşturun.</p>
          </Card>
        ) : (
          <div className="grid gap-3">
            {games.map((game) => (
              <Card key={game.id} hover className="flex items-center justify-between">
                <div className="flex-1 cursor-pointer" onClick={() => navigate(`/game/play/${game.id}`)}>
                  <div className="flex items-center gap-3">
                    <h3 className="text-sm font-semibold text-slate-800">{game.topic}</h3>
                    <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                      game.status === 'finished'
                        ? 'bg-green-100 text-green-700'
                        : game.status === 'paused'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-indigo-100 text-indigo-700'
                    }`}>
                      {game.status === 'finished' ? 'Tamamlandı' : game.status === 'paused' ? 'Duraklatıldı' : 'Devam' }
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1.5 text-xs text-slate-400">
                    <span>{game.progress}</span>
                    <span>Skor: {game.scores.map(formatScore).join(' - ')}</span>
                    <span>{formatDate(game.updatedAt)}</span>
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); removeGame(game.id); }}
                  className="rounded-lg p-2 text-slate-300 hover:bg-red-50 hover:text-red-500 transition-colors"
                >
                  <HiTrash className="h-4 w-4" />
                </button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
