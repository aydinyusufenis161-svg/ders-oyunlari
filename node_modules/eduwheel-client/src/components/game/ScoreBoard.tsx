import { useGameStore } from '../../store/useGameStore';
import { formatScore } from '../../utils/formatters';

export default function ScoreBoard() {
  const { teams, currentTeamTurn, currentQuestionIndex, questions, answeredQuestions } = useGameStore();
  const correctCount = answeredQuestions.filter((a) => a.isCorrect).length;

  return (
    <div className="rounded-2xl bg-white border border-slate-100 shadow-card p-5 space-y-4">
      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Skor Tablosu</h3>

      <div className="space-y-3">
        {teams.map((team, i) => (
          <div
            key={i}
            className={`flex items-center justify-between rounded-xl px-4 py-3 transition-all ${
              i === currentTeamTurn ? 'bg-indigo-50 ring-1 ring-indigo-200' : 'bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`h-3 w-3 rounded-full ${
                i === currentTeamTurn ? 'bg-indigo-500 animate-pulse-soft' : 'bg-slate-300'
              }`} />
              <span className="text-sm font-medium text-slate-700">{team.name}</span>
            </div>
            <span className="text-lg font-bold text-slate-800">{formatScore(team.score)}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-100 pt-3 space-y-2">
        <div className="flex justify-between text-xs text-slate-500">
          <span>İlerleme</span>
          <span>{Math.min(currentQuestionIndex, questions.length)} / {questions.length}</span>
        </div>
        <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-indigo-500 transition-all duration-500"
            style={{ width: `${(currentQuestionIndex / questions.length) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-400">
          <span>Doğru: {correctCount}</span>
          <span>Yanlış: {answeredQuestions.length - correctCount}</span>
        </div>
      </div>
    </div>
  );
}
