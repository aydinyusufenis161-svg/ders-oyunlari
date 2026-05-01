import { motion } from 'framer-motion';
import { useGameStore } from '../../store/useGameStore';
import { formatScore } from '../../utils/formatters';
import Button from '../common/Button';
import { HiTrophy, HiArrowPath } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';

export default function GameOverScreen() {
  const { teams, settings, answeredQuestions } = useGameStore();
  const reset = useGameStore((s) => s.reset);
  const navigate = useNavigate();

  const correctCount = answeredQuestions.filter((a) => a.isCorrect).length;
  const totalAnswered = answeredQuestions.length;
  const winner = teams.length > 1
    ? teams.reduce((prev, curr) => (curr.score > prev.score ? curr : prev))
    : teams[0];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-8 py-8"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
          <HiTrophy className="h-10 w-10 text-amber-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Oyun Bitti!</h2>
        <div className="flex flex-col items-center">
          <p className="text-sm font-bold text-indigo-500 uppercase mb-1">{settings?.mode.replace(/_/g, ' ')}</p>
          <p className="text-sm text-slate-500">{settings?.topic}</p>
        </div>
      </div>

      {teams.length > 1 && (
        <div className="text-center">
          <p className="text-sm text-slate-500">Kazanan</p>
          <p className="text-xl font-bold text-indigo-600">{winner.name}</p>
        </div>
      )}

      <div className="flex gap-6">
        {teams.map((team, i) => (
          <div key={i} className="text-center rounded-2xl bg-white border border-slate-100 shadow-card px-8 py-6">
            <p className="text-sm text-slate-500 mb-1">{team.name}</p>
            <p className="text-3xl font-bold text-slate-800">{formatScore(team.score)}</p>
            <p className="text-xs text-slate-400 mt-1">puan</p>
          </div>
        ))}
      </div>

      <div className="flex gap-8 text-center">
        <div>
          <p className="text-2xl font-bold text-green-600">{correctCount}</p>
          <p className="text-xs text-slate-500">Doğru</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-red-500">{totalAnswered - correctCount}</p>
          <p className="text-xs text-slate-500">Yanlış</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-slate-600">{totalAnswered}</p>
          <p className="text-xs text-slate-500">Toplam</p>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="secondary" onClick={() => { reset(); navigate('/dashboard'); }}>
          Ana Sayfa
        </Button>
        <Button onClick={() => { reset(); navigate('/game/setup'); }}>
          <HiArrowPath className="h-4 w-4" />
          Yeni Oyun
        </Button>
      </div>
    </motion.div>
  );
}
