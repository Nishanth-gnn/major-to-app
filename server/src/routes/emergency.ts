import { Router } from 'express';
import { sendEmergencyAlert } from '../controllers/emergencyController';

const router = Router();

// POST /api/emergency-alert
// No auth required — emergency alerts must be accessible without login
router.post('/', sendEmergencyAlert);

export default router;
