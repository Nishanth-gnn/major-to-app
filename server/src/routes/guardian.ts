import { Router, Response, NextFunction } from 'express';
import {
  saveGuardianEmailConfig,
  getGuardianEmailConfig,
  sendOtp,
  verifyOtp,
  getGuardianStatus,
  removeGuardian,
  notifySecurityComplete,
  notifyLuggageComplete,
} from '../controllers/guardianController';
import { requireAuth, AuthRequest, extractUserId } from '../middleware/auth';

const router = Router();

function optionalAuth(req: AuthRequest, _res: Response, next: NextFunction) {
  req.userId = extractUserId(req);
  next();
}

// Guardian SMTP Configuration Endpoints
router.post('/email-config', requireAuth, saveGuardianEmailConfig);
router.get('/email-config/:guardianEmail', requireAuth, getGuardianEmailConfig);

// OTP & Verification Endpoints
router.post('/send-otp', requireAuth, sendOtp);
router.post('/verify-otp', requireAuth, verifyOtp);
router.get('/status', requireAuth, getGuardianStatus);
router.delete('/:id', requireAuth, removeGuardian);

// Navigation checkpoint notification endpoints
router.post('/navigation/security-complete', optionalAuth, notifySecurityComplete);
router.post('/navigation/luggage-complete', optionalAuth, notifyLuggageComplete);

export default router;
