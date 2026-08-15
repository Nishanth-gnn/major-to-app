import { Router } from 'express';
import {
  getAirports,
  getTransitOptions,
  getMetroRoutes,
  getLiveMetro,
  getCabEstimate,
  getTerminalNavigation,
} from '../controllers/transitServicesController';

const router = Router();

router.get('/airports', getAirports);
router.get('/airports/:id/options', getTransitOptions);
router.get('/metro/routes', getMetroRoutes);
router.get('/metro/live/:route', getLiveMetro);
router.get('/cab/estimate', getCabEstimate);
router.get('/terminal/navigation', getTerminalNavigation);

export default router;
