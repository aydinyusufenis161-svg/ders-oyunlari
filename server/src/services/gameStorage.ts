import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { GameState, SavedGameSummary } from '../types/game.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, '../../data/games');

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function saveGame(game: GameState): void {
  ensureDir();
  const filePath = path.join(DATA_DIR, `${game.id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(game, null, 2), 'utf-8');
}

export function loadGame(id: string): GameState | null {
  const filePath = path.join(DATA_DIR, `${id}.json`);
  if (!fs.existsSync(filePath)) return null;
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

export function listGames(): SavedGameSummary[] {
  ensureDir();
  const files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith('.json'));

  return files
    .map((file) => {
      const data = fs.readFileSync(path.join(DATA_DIR, file), 'utf-8');
      const game: GameState = JSON.parse(data);
      return {
        id: game.id,
        topic: game.settings.topic,
        status: game.status,
        teamMode: game.settings.teamMode,
        scores: game.teams.map((t) => t.score),
        progress: `${game.currentQuestionIndex}/${game.questions.length} soru`,
        updatedAt: game.updatedAt,
      };
    })
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export function deleteGame(id: string): boolean {
  const filePath = path.join(DATA_DIR, `${id}.json`);
  if (!fs.existsSync(filePath)) return false;
  fs.unlinkSync(filePath);
  return true;
}
