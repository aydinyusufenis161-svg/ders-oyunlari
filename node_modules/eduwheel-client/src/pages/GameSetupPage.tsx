import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettingsStore } from '../store/useSettingsStore';
import { useGameStore } from '../store/useGameStore';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import { QUESTION_COUNTS } from '../utils/constants';
import { HiSparkles, HiGlobeAlt, HiUserGroup } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import type { Difficulty, GameMode } from '../types/game';

export default function GameSetupPage() {
  const navigate = useNavigate();
  const { getActiveConfig } = useSettingsStore();
  const initGame = useGameStore((s) => s.initGame);

  const [topic, setTopic] = useState('');
  const [questionCount, setQuestionCount] = useState(10);
  const [teamMode, setTeamMode] = useState<'solo' | 'teams'>('solo');
  const [difficulty, setDifficulty] = useState<Difficulty>('mixed');
  const [mode, setMode] = useState<GameMode>('wheel');

  // Multiplayer setup state
  const [isMultiplayer, setIsMultiplayer] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const handleStart = () => {
    const config = getActiveConfig();
    if (!config.apiKey) {
      toast.error('Lütfen önce API ayarlarından API anahtarınızı girin.');
      navigate('/settings');
      return;
    }

    // If hosting multiplayer, topic is required to generate questions
    if (!isJoining && !topic.trim()) {
      toast.error('Lütfen bir konu girin.');
      return;
    }

    if (isJoining && !joinCode.trim()) {
      toast.error('Lütfen katılmak için bir oda kodu girin.');
      return;
    }

    const id = uuidv4();
    const roomCode = isMultiplayer
      ? (isJoining ? joinCode.trim() : Math.random().toString(36).substring(2, 8).toUpperCase())
      : null;

    if (isJoining) {
      // Misafir olarak katılıyorsa, soru üretmesine gerek yok; State sunucudan gelecek.
      initGame(
        {
          topic: 'Bağlanılıyor...', // Host'tan gelecek
          questionCount: 10,
          teamMode: 'teams',
          provider: config.provider,
          model: config.model,
          difficulty: 'mixed',
          mode: 'wheel',
        },
        id,
        { isMultiplayer: true, roomCode: roomCode!, isHost: false }
      );
      navigate('/game/play');
      return;
    }

    // Host olarak başlıyorsa veya lokal oynuyorsa
    initGame(
      {
        topic: topic.trim(),
        questionCount,
        teamMode,
        provider: config.provider,
        model: config.model,
        difficulty,
        mode,
      },
      id,
      isMultiplayer ? { isMultiplayer: true, roomCode: roomCode!, isHost: true } : undefined
    );
    navigate('/game/play');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Yeni Oyun Oluştur</h1>
        <p className="text-sm text-slate-500 mt-1">Lokal oynayın veya online oda kurun.</p>
      </div>

      <Card className="space-y-6">
        {/* Multiplayer Toggle / Info */}
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => { setIsMultiplayer(false); setIsJoining(false); setTeamMode('solo'); }}
            className={`flex-1 flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${!isMultiplayer ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'}`}
          >
            <HiUserGroup className={`w-8 h-8 mb-2 ${!isMultiplayer ? 'text-indigo-600' : 'text-slate-400'}`} />
            <span className={`font-semibold ${!isMultiplayer ? 'text-indigo-900' : 'text-slate-600'}`}>Lokal Oyun</span>
            <span className="text-xs text-slate-500">Aynı cihazdan oyna</span>
          </button>
          <button
            onClick={() => { setIsMultiplayer(true); setTeamMode('teams'); }}
            className={`flex-1 flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${isMultiplayer ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-slate-300'}`}
          >
            <HiGlobeAlt className={`w-8 h-8 mb-2 ${isMultiplayer ? 'text-emerald-600' : 'text-slate-400'}`} />
            <span className={`font-semibold ${isMultiplayer ? 'text-emerald-900' : 'text-slate-600'}`}>Online Oynayalım</span>
            <span className="text-xs text-slate-500">Kodu arkadaşına gönder</span>
          </button>
        </div>

        {isMultiplayer && (
          <div className="p-5 bg-emerald-50/80 border border-emerald-200 rounded-xl space-y-4">
             <div className="flex gap-3">
                <button
                  className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors ${!isJoining ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-700 hover:bg-emerald-100'}`}
                  onClick={() => setIsJoining(false)}
                >
                  Oda Kur (Host)
                </button>
                <button
                   className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors ${isJoining ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-700 hover:bg-emerald-100'}`}
                  onClick={() => setIsJoining(true)}
                >
                  Odaya Katıl
                </button>
             </div>

             {isJoining ? (
               <div className="space-y-2">
                 <label className="block text-xs font-semibold text-emerald-800 uppercase tracking-wider">Arkadaşının Gönderdiği Kod:</label>
                 <Input
                   label=""
                   value={joinCode}
                   onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                   placeholder="Örn: A7BN2"
                   className="mt-2 text-center text-2xl tracking-[0.5em] font-mono py-4 uppercase"
                 />
               </div>
             ) : (
                <div className="text-sm text-emerald-800 text-center py-2">
                  <p>Oyun başladığında otomatik olarak bir <strong className="font-bold">Oda Kodu</strong> üretilecek. Bu kodu diğer oyuncuya gönder.</p>
                </div>
             )}
          </div>
        )}

        {(!isJoining) && (
          <div className="space-y-6 pt-4 border-t border-slate-100">
            <Input
              label="Konu"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Örn: Osmanlı Tarihi, Fizik - Elektrik, İngilizce Present Perfect..."
            />

            <Select
              label="Soru Sayısı"
              value={String(questionCount)}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              options={QUESTION_COUNTS.map((c) => ({ value: String(c), label: `${c} Soru` }))}
            />

            <Select
              label="Zorluk"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              options={[
                { value: 'mixed', label: 'Karışık (Önerilen)' },
                { value: 'easy', label: 'Kolay' },
                { value: 'medium', label: 'Orta' },
                { value: 'hard', label: 'Zor' },
              ]}
            />

            <Select
              label="Oyun Tipi"
              value={mode}
              onChange={(e) => setMode(e.target.value as GameMode)}
              options={[
                { value: 'wheel', label: 'Çarkıfelek (Puanlı Çark)' },
                { value: 'true_false', label: 'Doğru / Yanlış (+10p)' },
                { value: 'classic', label: 'Klasik Quiz (+10p)' },
                { value: 'time_attack', label: 'Zamana Karşı (60 Saniye)' },
                { value: 'survival', label: 'Hayatta Kalma (Hata Elenme)' },
                { value: 'short_answer_rush', label: 'Hızlı Cevap (Sadece Kelime)' },
              ]}
            />

            {!isMultiplayer && (
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">Oyun Modu</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setTeamMode('solo')}
                    className={`rounded-xl border p-4 text-left transition-all duration-200 ${
                      teamMode === 'solo'
                        ? 'border-indigo-300 bg-indigo-50 ring-2 ring-indigo-200'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <p className="text-sm font-semibold text-slate-800">Tek Kişi</p>
                    <p className="text-xs text-slate-400 mt-1">Kendi başına oyna</p>
                  </button>
                  <button
                    onClick={() => setTeamMode('teams')}
                    className={`rounded-xl border p-4 text-left transition-all duration-200 ${
                      teamMode === 'teams'
                        ? 'border-indigo-300 bg-indigo-50 ring-2 ring-indigo-200'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <p className="text-sm font-semibold text-slate-800">2 Takım</p>
                    <p className="text-xs text-slate-400 mt-1">Takımlar halinde yarış</p>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      <Button onClick={handleStart} size="lg" className="w-full">
        {isJoining ? (
          <>
            <HiGlobeAlt className="h-5 w-5" />
            Odaya Bağlan
          </>
        ) : (
          <>
            <HiSparkles className="h-5 w-5" />
            {isMultiplayer ? 'Oda Kur ve Başla' : 'Soruları Üret ve Başla'}
          </>
        )}
      </Button>
    </div>
  );
}
