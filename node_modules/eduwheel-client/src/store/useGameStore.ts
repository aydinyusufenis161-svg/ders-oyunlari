import { create } from 'zustand';
import type { GameState, GameSettings, GameStatus, Team, WheelResult, AnsweredQuestion } from '../types/game';
import type { Question } from '../types/question';
import { socketService } from '../services/socketService';

interface GameStore {
  gameId: string | null;
  status: GameStatus;
  settings: GameSettings | null;
  questions: Question[];
  currentQuestionIndex: number;
  currentTeamTurn: number;
  teams: Team[];
  wheelResult: WheelResult | null;
  answeredQuestions: AnsweredQuestion[];
  wheelHistory: WheelResult[];
  isSpinning: boolean;
  wheelRotation: number;
  showQuestion: boolean;
  pendingPoints: number;
  timeLeft: number | null; // For time_attack mode

  // Multiplayer
  isMultiplayer: boolean;
  roomCode: string | null;
  isHost: boolean;

  initGame: (settings: GameSettings, id: string, multiplayerOptions?: { isMultiplayer: boolean; roomCode: string; isHost: boolean }) => void;
  setQuestions: (q: Question[]) => void;
  setStatus: (s: GameStatus) => void;
  setWheelResult: (r: WheelResult, rotationTarget: number) => void;
  setIsSpinning: (v: boolean) => void;
  setShowQuestion: (v: boolean) => void;
  setPendingPoints: (p: number) => void;
  answerQuestion: (answer: string, isCorrect: boolean) => void;
  applyBankrupt: () => void;
  nextTurn: () => void;
  addBonusQuestions: (questions: Question[]) => void;
  resumeGame: (state: GameState) => void;
  getSerializableState: () => GameState;
  reset: () => void;
  decrementTime: () => void;
  useLifeline: (type: 'fiftyFifty' | 'addTime') => void;
  increaseScore: (points: number) => void;

  // Internal multiplayer
  broadcastState: () => void;
  applyRemoteState: (state: any) => void;
}

export const useGameStore = create<GameStore>()((set, get) => ({
  gameId: null,
  status: 'setup',
  settings: null,
  questions: [],
  currentQuestionIndex: 0,
  currentTeamTurn: 0,
  teams: [],
  wheelResult: null,
  answeredQuestions: [],
  wheelHistory: [],
  isSpinning: false,
  wheelRotation: 0,
  showQuestion: false,
  pendingPoints: 0,
  timeLeft: null,

  isMultiplayer: false,
  roomCode: null,
  isHost: false,

  broadcastState: () => {
    const s = get();
    if (s.isMultiplayer && s.isHost && s.roomCode) {
      socketService.syncState(s.roomCode, s.getSerializableState());
    }
  },

  applyRemoteState: (state) => {
    if (!get().isHost) {
      set({
        gameId: state.id,
        settings: state.settings,
        status: state.status,
        teams: state.teams,
        questions: state.questions,
        currentQuestionIndex: state.currentQuestionIndex,
        currentTeamTurn: state.currentTeamTurn,
        wheelHistory: state.wheelHistory,
        answeredQuestions: state.answeredQuestions,
        wheelRotation: state.wheelRotation,
        isSpinning: state.isSpinning,
        showQuestion: state.showQuestion,
        pendingPoints: state.pendingPoints,
        timeLeft: state.timeLeft,
      });
    }
  },

  initGame: (settings, id, multiplayerOptions) => {
    const teams: Team[] =
      settings.teamMode === 'solo'
        ? [{ name: 'Oyuncu', score: 0, color: 'indigo', lifelines: { fiftyFifty: true, addTime: true } }]
        : [
            { name: 'Takım 1', score: 0, color: 'indigo', lifelines: { fiftyFifty: true, addTime: true } },
            { name: 'Takım 2', score: 0, color: 'emerald', lifelines: { fiftyFifty: true, addTime: true } },
          ];

    const isTimeAttack = settings.mode === 'time_attack';

    set({
      gameId: id,
      settings,
      teams,
      status: 'generating',
      currentQuestionIndex: 0,
      currentTeamTurn: 0,
      wheelResult: null,
      answeredQuestions: [],
      wheelHistory: [],
      questions: [],
      isSpinning: false,
      wheelRotation: 0,
      showQuestion: false,
      pendingPoints: 0,
      timeLeft: isTimeAttack ? 60 : null,

      isMultiplayer: multiplayerOptions?.isMultiplayer || false,
      roomCode: multiplayerOptions?.roomCode || null,
      isHost: multiplayerOptions?.isHost ?? true,
    });

    if (multiplayerOptions?.isMultiplayer && multiplayerOptions.roomCode) {
      socketService.joinRoom(multiplayerOptions.roomCode);
      get().broadcastState();
    }
  },

  setQuestions: (q) => { set({ questions: q, status: 'playing' }); get().broadcastState(); },
  setStatus: (s) => { set({ status: s }); get().broadcastState(); },
  setWheelResult: (r, rotationTarget) => { 
    set({ wheelResult: r, wheelHistory: [...get().wheelHistory, r], wheelRotation: rotationTarget }); 
    get().broadcastState(); 
  },
  setIsSpinning: (v) => { set({ isSpinning: v }); get().broadcastState(); },
  setShowQuestion: (v) => { set({ showQuestion: v }); get().broadcastState(); },
  setPendingPoints: (p) => { set({ pendingPoints: p }); get().broadcastState(); },

  decrementTime: () => {
    const state = get();
    if (state.timeLeft && state.timeLeft > 0 && state.status === 'playing') {
      const newTime = state.timeLeft - 1;
      set({
        timeLeft: newTime,
        status: newTime === 0 ? 'finished' : 'playing'
      });
      if (get().isHost) get().broadcastState();
    }
  },

  useLifeline: (type) => {
    const state = get();
    if (!state.teams[state.currentTeamTurn].lifelines[type]) return;

    const newTeams = state.teams.map((t, i) => {
      if (i === state.currentTeamTurn) {
        return {
          ...t,
          lifelines: { ...t.lifelines, [type]: false }
        };
      }
      return t;
    });

    let newTimeLeft = state.timeLeft;
    if (type === 'addTime' && state.settings?.mode === 'time_attack' && newTimeLeft !== null) {
      newTimeLeft += 15;
    }

    set({ teams: newTeams, timeLeft: newTimeLeft });
    get().broadcastState();
  },

  increaseScore: (points) => {
    const state = get();
    const newTeams = state.teams.map((t, i) =>
      i === state.currentTeamTurn ? { ...t, score: t.score + points } : t
    );
    set({ teams: newTeams });
    get().broadcastState();
  },

  answerQuestion: (answer, isCorrect) => {
    const state = get();
    const question = state.questions[state.currentQuestionIndex];
    if (!question) return;

    const isWheelMode = state.settings?.mode === 'wheel';
    if (isWheelMode && !state.wheelResult) return;

    const pointsAwarded = isCorrect ? state.pendingPoints : 0;
    const answered: AnsweredQuestion = {
      questionId: question.id,
      teamIndex: state.currentTeamTurn,
      userAnswer: answer,
      isCorrect,
      pointsAwarded,
      segmentResult: state.wheelResult,
    };

    const newTeams = state.teams.map((t, i) =>
      i === state.currentTeamTurn ? { ...t, score: t.score + pointsAwarded } : t
    );

    const nextIndex = state.currentQuestionIndex + 1;
    let isFinished = nextIndex >= state.questions.length;

    if (state.settings?.mode === 'survival' && !isCorrect) {
      isFinished = true;
    }

    let updatedTimeLeft = state.timeLeft;
    if (state.settings?.mode === 'time_attack') {
      if (isCorrect && updatedTimeLeft !== null) {
        updatedTimeLeft += 5;
      }
      if (updatedTimeLeft === 0) {
        isFinished = true;
      }
    }

    set({
      answeredQuestions: [...state.answeredQuestions, answered],
      teams: newTeams,
      currentQuestionIndex: nextIndex,
      showQuestion: !isWheelMode && (!isFinished),
      wheelResult: null,
      pendingPoints: !isWheelMode ? 10 : 0,
      timeLeft: updatedTimeLeft,
      status: isFinished ? 'finished' : state.status,
    });
    get().broadcastState();
  },

  applyBankrupt: () => {
    const state = get();
    const newTeams = state.teams.map((t, i) =>
      i === state.currentTeamTurn ? { ...t, score: 0 } : t
    );
    set({ teams: newTeams, wheelResult: null });
    get().broadcastState();
  },

  nextTurn: () => {
    const state = get();
    if (state.teams.length <= 1) return;
    set({ currentTeamTurn: (state.currentTeamTurn + 1) % state.teams.length });
    get().broadcastState();
  },

  addBonusQuestions: (questions) => {
    set((state) => ({ questions: [...state.questions, ...questions] }));
    get().broadcastState();
  },

  resumeGame: (saved) => {
    const isWheelMode = saved.settings?.mode === 'wheel';
    set({
      gameId: saved.id,
      settings: saved.settings,
      status: 'playing',
      teams: saved.teams,
      questions: saved.questions,
      currentQuestionIndex: saved.currentQuestionIndex,
      currentTeamTurn: saved.currentTeamTurn,
      wheelResult: null,
      answeredQuestions: saved.answeredQuestions,
      wheelHistory: saved.wheelHistory,
      isSpinning: false,
      wheelRotation: 0,
      showQuestion: !isWheelMode,
      pendingPoints: !isWheelMode ? 10 : 0,
      timeLeft: saved.settings.mode === 'time_attack' ? 60 : null,
    });
    get().broadcastState();
  },

  getSerializableState: () => {
    const s = get();
    return {
      id: s.gameId!,
      settings: s.settings!,
      status: s.status,
      teams: s.teams,
      questions: s.questions,
      currentQuestionIndex: s.currentQuestionIndex,
      currentTeamTurn: s.currentTeamTurn,
      wheelHistory: s.wheelHistory,
      answeredQuestions: s.answeredQuestions,
      wheelRotation: s.wheelRotation,
      isSpinning: s.isSpinning,
      showQuestion: s.showQuestion,
      pendingPoints: s.pendingPoints,
      timeLeft: s.timeLeft,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  reset: () => {
    set({
      gameId: null,
      status: 'setup',
      settings: null,
      questions: [],
      currentQuestionIndex: 0,
      currentTeamTurn: 0,
      teams: [],
      wheelResult: null,
      answeredQuestions: [],
      wheelHistory: [],
      isSpinning: false,
      wheelRotation: 0,
      showQuestion: false,
      pendingPoints: 0,
      timeLeft: null,
      isMultiplayer: false,
      roomCode: null,
      isHost: false
    });
    socketService.disconnect();
  }
}));

// Listener
socketService.onStateUpdated((state) => {
  useGameStore.getState().applyRemoteState(state);
});

socketService.onStateRequested(() => {
  const store = useGameStore.getState();
  if (store.isMultiplayer && store.isHost) {
    store.broadcastState();
  }
});
