import axios from 'axios';
import type { Question } from '../types/question';
import type { ProviderType } from '../types/provider';
import type { GameState } from '../types/game';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8045/api';

export async function generateQuestions(params: {
  provider: ProviderType;
  baseUrl: string;
  apiKey: string;
  model: string;
  topic: string;
  questionCount: number;
  difficulty?: 'easy' | 'medium' | 'hard' | 'mixed';
  mode?: string;
}): Promise<Question[]> {
  const response = await axios.post(`${API_BASE_URL}/ai/generate`, params);
  return response.data.questions;
}

export async function saveGame(gameState: GameState): Promise<string> {
  const response = await axios.post(`${API_BASE_URL}/games`, gameState);
  return response.data.id;
}

export async function loadGame(id: string): Promise<GameState> {
  const response = await axios.get(`${API_BASE_URL}/games/${id}`);
  return response.data.game;
}

export async function updateGame(id: string, gameState: Partial<GameState>): Promise<void> {
  await axios.put(`${API_BASE_URL}/games/${id}`, gameState);
}

export async function listGames(): Promise<GameState[]> {
  try {
    const response = await axios.get(`${API_BASE_URL}/games`);
    return response.data.games || [];
  } catch {
    return [];
  }
}

export async function deleteGame(id: string): Promise<void> {
  await axios.delete(`${API_BASE_URL}/games/${id}`);
}
