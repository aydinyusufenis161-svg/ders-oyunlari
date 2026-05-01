import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Question } from '../../types/question';
import Button from '../common/Button';
import { useGameStore } from '../../store/useGameStore';
import { fireConfettiBurst } from '../../utils/confetti';
import { HiLightningBolt, HiOutlineClock } from 'react-icons/hi';

interface QuestionCardProps {
  question: Question;
  pendingPoints: number;
  onAnswer: (answer: string, isCorrect: boolean) => void;
}

export default function QuestionCard({ question, pendingPoints, onAnswer }: QuestionCardProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [shortAnswer, setShortAnswer] = useState('');
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const store = useGameStore();
  const currentTeam = store.teams[store.currentTeamTurn];
  const [eliminatedOptions, setEliminatedOptions] = useState<string[]>([]);

  const handleFiftyFifty = () => {
    if (question.type !== 'multiple_choice' || !question.options) return;
    store.useLifeline('fiftyFifty');
    const wrongOptions = question.options.filter(o => o !== question.correctAnswer);
    const optionsToRemove = wrongOptions.sort(() => Math.random() - 0.5).slice(0, 2);
    setEliminatedOptions(optionsToRemove);
  };

  const handleAddTime = () => {
    store.useLifeline('addTime');
  };
  const handleSubmit = () => {
    const userAnswer = question.type === 'short_answer' ? shortAnswer.trim() : selected;
    if (!userAnswer) return;

    const correct =
      question.type === 'short_answer'
        ? userAnswer.toLowerCase() === question.correctAnswer.toLowerCase()
        : userAnswer === question.correctAnswer;

    setIsCorrect(correct);
    setAnswered(true);
    if (correct) fireConfettiBurst();

    setTimeout(() => {
      onAnswer(userAnswer, correct);
      setSelected(null);
      setShortAnswer('');
      setAnswered(false);
    }, 2500);
  };

  const difficultyColor = {
    easy: 'bg-green-100 text-green-700',
    medium: 'bg-amber-100 text-amber-700',
    hard: 'bg-red-100 text-red-700',
  }[question.difficulty];

  const difficultyLabel = {
    easy: 'Kolay',
    medium: 'Orta',
    hard: 'Zor',
  }[question.difficulty];

  const typeLabel = {
    multiple_choice: 'Çoktan Seçmeli',
    true_false: 'Doğru / Yanlış',
    short_answer: 'Kısa Cevap',
  }[question.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-lg rounded-2xl bg-white border border-slate-100 shadow-card p-6 space-y-5"
    >
      {currentTeam?.lifelines && !answered && (
        <div className="flex gap-2 justify-end mb-4 border-b pb-4">
          {currentTeam.lifelines.fiftyFifty && question.type === 'multiple_choice' && (
            <Button size="sm" variant="secondary" onClick={handleFiftyFifty}>
              <HiLightningBolt className="w-4 h-4 mr-1 text-amber-500" /> %50-%50
            </Button>
          )}
          {currentTeam.lifelines.addTime && store.settings?.mode === 'time_attack' && (
            <Button size="sm" variant="secondary" onClick={handleAddTime}>
              <HiOutlineClock className="w-4 h-4 mr-1 text-blue-500" /> +15s
            </Button>
          )}
        </div>
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${difficultyColor}`}>
            {difficultyLabel}
          </span>
          <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-600">
            {typeLabel}
          </span>
        </div>
        <span className="text-sm font-bold text-indigo-600">{pendingPoints} puan</span>
      </div>

      <p className="text-base font-medium text-slate-800 leading-relaxed">{question.question}</p>

      {question.type === 'short_answer' ? (
        <input
          type="text"
          value={shortAnswer}
          onChange={(e) => setShortAnswer(e.target.value)}
          disabled={answered}
          placeholder="Cevabınızı yazın..."
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:opacity-50"
          onKeyDown={(e) => e.key === 'Enter' && !answered && handleSubmit()}
        />
      ) : (
        <div className="space-y-2">
          {question.options?.map((option) => (
            <button
              key={option}
              onClick={() => !answered && !eliminatedOptions.includes(option) && setSelected(option)}
              disabled={answered}
              className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all duration-200 ${
                answered
                  ? option === question.correctAnswer
                    ? 'bg-green-50 border-green-300 text-green-800'
                    : option === selected && !isCorrect
                      ? 'bg-red-50 border-red-300 text-red-800'
                      : 'border-slate-100 text-slate-400'
                  : eliminatedOptions.includes(option) ? 'opacity-20 pointer-events-none line-through' : selected === option
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-800'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {answered && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className={`rounded-xl p-4 text-sm ${
              isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}
          >
            <p className="font-semibold mb-1">
              {isCorrect ? 'Doğru!' : 'Yanlış!'}
              {!isCorrect && ` Doğru cevap: ${question.correctAnswer}`}
            </p>
            <p className="text-xs opacity-80">{question.explanation}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {!answered && (
        <Button
          onClick={handleSubmit}
          disabled={question.type === 'short_answer' ? !shortAnswer.trim() : !selected}
          className="w-full"
        >
          Cevapla
        </Button>
      )}
    </motion.div>
  );
}
