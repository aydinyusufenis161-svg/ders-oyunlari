import { Router } from 'express';
import {
  handleListGames,
  handleLoadGame,
  handleSaveGame,
  handleUpdateGame,
  handleDeleteGame,
} from '../controllers/gameController.js';

const router = Router();

router.get('/', handleListGames);
router.get('/:id', handleLoadGame);
router.post('/', handleSaveGame);
router.put('/:id', handleUpdateGame);
router.delete('/:id', handleDeleteGame);

export default router;
