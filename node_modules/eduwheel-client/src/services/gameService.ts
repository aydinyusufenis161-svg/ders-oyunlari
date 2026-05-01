import api from './api';
import type { AIRequestPayload, AITestPayload } from '../types/provider';
import type { Question } from '../types/question';
import type { GameState, SavedGameSummary } from '../types/game';

export async function generateQuestions(payload: AIRequestPayload): Promise<Question[]> {
  const { data } = await api.post<{ questions: Question[] }>('/ai/generate', payload);
  return data.questions;
}

export async function testConnection(payload: AITestPayload): Promise<{ success: boolean; message: string }> {
  const { data } = await api.post<{ success: boolean; message: string }>('/ai/test', payload);
  return data;
}

export async function listGames(): Promise<SavedGameSummary[]> {
  const { data } = await api.get<{ games: SavedGameSummary[] }>('/games');
  return data.games;
}

export async function loadGame(id: string): Promise<GameState> {
  const { data } = await api.get<{ game: GameState }>(`/games/${id}`);
  return data.game;
}

export async function saveGame(game: GameState): Promise<string> {
  const { data } = await api.post<{ id: string }>('/games', game);
  return data.id;
}

export async function updateGame(id: string, game: Partial<GameState>): Promise<void> {
  await api.put(`/games/${id}`, game);
}

export async function deleteGame(id: string): Promise<void> {
  await api.delete(`/games/${id}`);
}
