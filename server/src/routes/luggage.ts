import { Router } from 'express';
import { getDomestic, getInternational } from '../controllers/luggageController';
const router = Router();
router.get('/domestic', getDomestic);
router.get('/international', getInternational);
export default router;
