import type { Request, Response, NextFunction } from 'express';
import * as storage from '../services/gameStorage.js';

export function handleListGames(_req: Request, res: Response) {
  const games = storage.listGames();
  res.json({ games });
}

export function handleLoadGame(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const game = storage.loadGame(id as string);
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
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const existing = storage.loadGame(id as string);
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
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const deleted = storage.deleteGame(id as string);
  if (!deleted) {
    res.status(404).json({ error: 'Oyun bulunamadı.' });
    return;
  }
  res.json({ success: true });
}
