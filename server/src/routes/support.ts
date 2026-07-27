import { Router } from 'express';
import { sendSupportMessage } from '../controllers/supportController';

const router = Router();

router.post('/send', sendSupportMessage);

export default router;
