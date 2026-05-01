import Button from '../common/Button';
import { useGameStore } from '../../store/useGameStore';
import { formatScore } from '../../utils/formatters';

interface WheelControlsProps {
  onSpin: () => void;
  disabled: boolean;
}

export default function WheelControls({ onSpin, disabled }: WheelControlsProps) {
  const { teams, currentTeamTurn, isSpinning, currentQuestionIndex, questions } = useGameStore();
  const currentTeam = teams[currentTeamTurn];

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-center">
        <p className="text-sm text-slate-500">Sıra</p>
        <p className="text-lg font-bold text-slate-800">{currentTeam?.name}</p>
      </div>

      <Button
        size="lg"
        onClick={onSpin}
        disabled={disabled || isSpinning}
        loading={isSpinning}
        className="min-w-[160px] text-base font-bold"
      >
        {isSpinning ? 'Dönüyor...' : 'ÇARK ÇEVİR'}
      </Button>

      <div className="flex gap-6">
        {teams.map((team, i) => (
          <div
            key={i}
            className={`text-center px-4 py-2 rounded-xl transition-all ${
              i === currentTeamTurn ? 'bg-indigo-50 ring-2 ring-indigo-200' : 'bg-slate-50'
            }`}
          >
            <p className="text-xs text-slate-500">{team.name}</p>
            <p className="text-xl font-bold text-slate-800">{formatScore(team.score)}</p>
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-400">
        Soru {Math.min(currentQuestionIndex + 1, questions.length)} / {questions.length}
      </p>
    </div>
  );
}
