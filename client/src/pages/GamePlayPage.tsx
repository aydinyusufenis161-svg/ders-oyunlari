import { useEffect, useCallback, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/useGameStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { generateQuestions, loadGame, saveGame } from '../services/gameService';
import Wheel from '../components/wheel/Wheel';
import WheelControls from '../components/wheel/WheelControls';
import QuestionCard from '../components/game/QuestionCard';
import ScoreBoard from '../components/game/ScoreBoard';
import GameOverScreen from '../components/game/GameOverScreen';
import Spinner from '../components/common/Spinner';
import Button from '../components/common/Button';
import { WHEEL_SEGMENTS } from '../utils/constants';
import { generateSpinTarget } from '../utils/wheelMath';
import toast from 'react-hot-toast';
import { HiPause, HiArrowLeftOnRectangle } from 'react-icons/hi2';
import { motion, AnimatePresence } from 'framer-motion';
import { AudioEngine } from '../utils/audioEngine';

export default function GamePlayPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const store = useGameStore();
  const settings = useSettingsStore();
  const [segmentMessage, setSegmentMessage] = useState<string | null>(null);
  const didRequestQuestionsRef = useRef(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (store.status === 'playing' && store.settings?.mode === 'time_attack' && (store.timeLeft ?? 0) > 0) {
      interval = setInterval(() => {
        AudioEngine.playTimerTick();
        store.decrementTime();
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [store.status, store.settings?.mode, store.timeLeft]);

  useEffect(() => {
    if (id) {
      loadGame(id).then((game) => {
        store.resumeGame(game);
      }).catch(() => {
        toast.error('Oyun yüklenemedi.');
        navigate('/dashboard');
      });
      return;
    }

    if (store.status === 'generating' && store.settings) {
      if (didRequestQuestionsRef.current) return;
      didRequestQuestionsRef.current = true;

      const config = settings.getActiveConfig();
      generateQuestions({
        provider: config.provider,
        baseUrl: config.baseUrl,
        apiKey: config.apiKey,
        model: config.model,
        topic: store.settings.topic,
        questionCount: store.settings.questionCount,
        difficulty: store.settings.difficulty,
        mode: store.settings.mode,
      })
        .then((questions) => {
          store.setQuestions(questions);
          // If not wheel mode, auto-show the first question and set fixed points
          if (store.settings?.mode !== 'wheel') {
            store.setPendingPoints(10);
            store.setShowQuestion(true);
          }
          toast.success(`${questions.length} soru üretildi!`);
        })
        .catch((err) => {
          toast.error('Soru üretimi başarısız: ' + (err?.response?.data?.error || err.message));
          store.setStatus('setup');
          navigate('/game/setup');
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSpin = useCallback(() => {
    if (store.settings?.mode !== 'wheel') return;
    
    if (store.isMultiplayer && store.myTeamIndex !== store.currentTeamTurn) {
      toast.error('Sıra sizde değil! Diğer oyuncuyu bekleyin.');
      return;
    }

    if (store.isSpinning || store.showQuestion) return;

    // Clear previous segment explanation only when user spins again.
    setSegmentMessage(null);

    store.setIsSpinning(true);
    const { targetIndex, totalRotation } = generateSpinTarget(store.wheelRotation);

    const segment = WHEEL_SEGMENTS[targetIndex];
    store.setWheelResult({
      segmentIndex: targetIndex,
      segment,
      appliedPoints: segment.value,
    }, totalRotation);
  }, [store]);

  const handleSpinComplete = useCallback(() => {
    if (store.settings?.mode !== 'wheel') return;
    store.setIsSpinning(false);
    const result = store.wheelResult;
    if (!result) return;

    const segment = result.segment;

    switch (segment.type) {
      case 'bankrupt':
        setSegmentMessage('İFLAS! Puanlarınız sıfırlandı! Devam etmek için tekrar çevir.');
        AudioEngine.playBankrupt();
        store.applyBankrupt();
        store.nextTurn();
        break;

      case 'pass':
        AudioEngine.playPass();
        setSegmentMessage('PAS! Sıra diğer oyuncuda. Devam etmek için tekrar çevir.');
        store.nextTurn();
        break;

      case 'double_points':
        store.setPendingPoints(segment.value);
        setSegmentMessage('ÇİFT PUAN! Bu sorunun değeri 2 katı!');
        store.setShowQuestion(true);
        break;

      case 'bonus_questions':
        store.setPendingPoints(50);
        setSegmentMessage('+2 SORU! (Birazdan) 2 ekstra soru eklenecek.');
        store.setShowQuestion(true);
        break;

      case 'points':
      default:
        store.setPendingPoints(segment.value);
        setSegmentMessage(`${segment.value} PUAN! Soruyu cevapla, sonra tekrar çevir.`);
        store.setShowQuestion(true);
        break;
    }
  }, [store]);

  const handleAnswer = useCallback(
    (answer: string, isCorrect: boolean) => {
      if (store.isMultiplayer && store.myTeamIndex !== store.currentTeamTurn) {
        toast.error('Sırası olan oyuncuyu bekleyiniz.');
        return;
      }

      store.answerQuestion(answer, isCorrect);
      if (isCorrect) {
        AudioEngine.playCorrect();
      } else {
        AudioEngine.playWrong();
      }
      if (store.teams.length > 1) {
        store.nextTurn();
      }
    },
    [store]
  );

  const handlePause = async () => {
    try {
      store.setStatus('paused');
      const gameState = store.getSerializableState();
      await saveGame(gameState);
      toast.success('Oyun kaydedildi.');
      store.reset();
      navigate('/dashboard');
    } catch {
      toast.error('Oyun kaydedilemedi.');
      store.setStatus('playing');
    }
  };

  if (store.status === 'generating') {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 animate-fade-in">
        <Spinner size="lg" />
        <p className="text-sm text-slate-500">Sorular üretiliyor...</p>
        <p className="text-xs text-slate-400">{store.settings?.topic}</p>
      </div>
    );
  }

  if (store.status === 'finished') {
    return <GameOverScreen />;
  }

  if (store.status !== 'playing') {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 animate-fade-in">
        <p className="text-sm text-slate-500">Oyun bulunamadı.</p>
        <Button onClick={() => navigate('/game/setup')}>Yeni Oyun Oluştur</Button>
      </div>
    );
  }

  const currentQuestion = store.questions[store.currentQuestionIndex];
  const isWheelMode = store.settings?.mode === 'wheel';

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-800">{store.settings?.topic}</h1>
          <div className="flex items-center gap-3">
            <p className="text-xs font-semibold text-indigo-500 uppercase tracking-widest">{store.settings?.mode.replace(/_/g, ' ')}</p>
            {store.isMultiplayer && store.roomCode && (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs tracking-wider border border-emerald-200">
                Oda Kodu: {store.roomCode}
              </span>
            )}
            {store.settings?.mode === 'time_attack' && store.timeLeft !== null && (
              <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-600 font-bold text-xs animate-pulse">
                {store.timeLeft} Saniye Kaldı
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={handlePause}>
            <HiPause className="h-4 w-4" />
            Duraklat
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              store.reset();
              navigate('/dashboard');
            }}
          >
            <HiArrowLeftOnRectangle className="h-4 w-4" />
            Çık
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col items-center gap-6">


              {isWheelMode && (
                <Wheel
                  rotation={store.wheelRotation}
                  isSpinning={store.isSpinning}
                  onSpinComplete={handleSpinComplete}
                  isMyTurn={store.myTeamIndex === store.currentTeamTurn}
                />
              )}

              <AnimatePresence>
                {segmentMessage && isWheelMode && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="rounded-xl bg-slate-800 px-6 py-3 text-sm font-medium text-white shadow-lg"
                  >
                    {segmentMessage}
                  </motion.div>
                )}
              </AnimatePresence>

              {store.showQuestion && currentQuestion ? (
                <QuestionCard
                  question={currentQuestion}
                  pendingPoints={store.pendingPoints}
                  onAnswer={handleAnswer}
                />
              ) : (
                isWheelMode &&
                !store.isSpinning && (
                  <WheelControls 
                    onSpin={handleSpin} 
                    disabled={store.isSpinning || store.showQuestion || (store.isMultiplayer && store.myTeamIndex !== store.currentTeamTurn)} 
                  />
                )
              )}
        </div>

        <div className="lg:col-span-1">
          <ScoreBoard />
        </div>
      </div>
    </div>
  );
}
