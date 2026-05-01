import type { ProviderType } from './provider';
import type { Question } from './question';

export type GameStatus = 'setup' | 'generating' | 'playing' | 'paused' | 'finished';
export type TeamMode = 'solo' | 'teams';
export type Difficulty = 'easy' | 'medium' | 'hard' | 'mixed';
export type GameMode = 'wheel' | 'true_false' | 'classic' | 'time_attack' | 'survival' | 'short_answer_rush' ;

export interface GameSettings {
  topic: string;
  questionCount: number;
  teamMode: TeamMode;
  provider: ProviderType;
  model: string;
  difficulty: Difficulty;
  mode: GameMode;
}

export interface Team {
  name: string;
  score: number;
  color: string;
}

export interface WheelResult {
  segmentIndex: number;
  segment: {
    label: string;
    value: number;
    type: string;
    color: string;
  };
  appliedPoints: number;
}

export interface AnsweredQuestion {
  questionId: string;
  teamIndex: number;
  userAnswer: string;
  isCorrect: boolean;
  pointsAwarded: number;
  segmentResult: WheelResult;
}

export interface GameState {
  id: string;
  settings: GameSettings;
  status: GameStatus;
  teams: Team[];
  questions: Question[];
  currentQuestionIndex: number;
  currentTeamTurn: number;
  wheelHistory: WheelResult[];
  answeredQuestions: AnsweredQuestion[];
  createdAt: string;
  updatedAt: string;
}

export interface SavedGameSummary {
  id: string;
  topic: string;
  status: GameStatus;
  teamMode: TeamMode;
  scores: number[];
  progress: string;
  updatedAt: string;
}
