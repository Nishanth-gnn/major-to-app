import { Router } from 'express';
import { calculateTransit, getTransits, trackTransit } from '../controllers/transitController';
import { requireAuth } from '../middleware/auth';
const router = Router();
router.post('/calculate', requireAuth, calculateTransit);
// Public endpoint: tracking requires only a flight number from the frontend
router.post('/track', trackTransit);
router.get('/history', requireAuth, getTransits);
export default router;
