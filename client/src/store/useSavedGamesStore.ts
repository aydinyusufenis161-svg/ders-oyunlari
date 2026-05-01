import { create } from 'zustand';
import type { SavedGameSummary } from '../types/game';
import * as gameService from '../services/gameService';

interface SavedGamesState {
  games: SavedGameSummary[];
  loading: boolean;
  fetchGames: () => Promise<void>;
  removeGame: (id: string) => Promise<void>;
}

export const useSavedGamesStore = create<SavedGamesState>()((set) => ({
  games: [],
  loading: false,

  fetchGames: async () => {
    set({ loading: true });
    try {
      const games = await gameService.listGames();
      set({ games, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  removeGame: async (id) => {
    await gameService.deleteGame(id);
    set((state) => ({ games: state.games.filter((g) => g.id !== id) }));
  },
}));
