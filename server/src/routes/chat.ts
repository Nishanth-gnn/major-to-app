import { Router } from 'express';
import { handleChat, getHistory } from '../controllers/chatController';
import { requireAuth } from '../middleware/auth';
const router = Router();
router.post('/', requireAuth, handleChat);
router.get('/history', requireAuth, getHistory);
export default router;
