import { Router } from 'express';
import { investigateMetro } from '../controllers/metroTrackingController';

const router = Router();

// POST /api/metro-tracking/investigate
router.post('/investigate', investigateMetro);

export default router;
