import { Router } from 'express';
import { investigateBusService } from '../controllers/airportBusController';

const router = Router();

// POST /api/airport-bus/investigate
router.post('/investigate', investigateBusService);

export default router;
