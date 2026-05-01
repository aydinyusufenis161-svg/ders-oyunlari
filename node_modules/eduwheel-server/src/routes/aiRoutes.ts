import { Router } from 'express';
import { handleGenerateQuestions, handleTestConnection } from '../controllers/aiController.js';

const router = Router();

router.post('/generate', handleGenerateQuestions);
router.post('/test', handleTestConnection);

export default router;
