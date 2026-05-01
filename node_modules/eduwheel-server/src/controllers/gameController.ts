import type { Request, Response, NextFunction } from 'express';
import * as storage from '../services/gameStorage.js';

export function handleListGames(_req: Request, res: Response) {
  const games = storage.listGames();
  res.json({ games });
}

export function handleLoadGame(req: Request, res: Response) {
  const game = storage.loadGame(req.params.id);
  if (!game) {
    res.status(404).json({ error: 'Oyun bulunamadı.' });
    return;
  }
  res.json({ game });
}

export function handleSaveGame(req: Request, res: Response, next: NextFunction) {
  try {
    const game = req.body;
    if (!game.id) {
      res.status(400).json({ error: 'Oyun ID eksik.' });
      return;
    }
    game.updatedAt = new Date().toISOString();
    storage.saveGame(game);
    res.json({ id: game.id });
  } catch (err) {
    next(err);
  }
}

export function handleUpdateGame(req: Request, res: Response, next: NextFunction) {
  try {
    const existing = storage.loadGame(req.params.id);
    if (!existing) {
      res.status(404).json({ error: 'Oyun bulunamadı.' });
      return;
    }
    const updated = { ...existing, ...req.body, updatedAt: new Date().toISOString() };
    storage.saveGame(updated);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

export function handleDeleteGame(req: Request, res: Response) {
  const deleted = storage.deleteGame(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: 'Oyun bulunamadı.' });
    return;
  }
  res.json({ success: true });
}
