import { Router } from 'express';
import { sendEmergencyAlert, getActiveAlerts, updateAlertStatus } from '../controllers/emergencyController';

const router = Router();

// POST /api/emergency-alert
router.post('/', sendEmergencyAlert);

// GET /api/emergency-alert/active
router.get('/active', getActiveAlerts);

// PUT /api/emergency-alert/:id/status
router.put('/:id/status', updateAlertStatus);

export default router;
