import { Router } from 'express';
import { trackBus, getLocation } from '../controllers/busController';

const router = Router();

/**
 * POST /api/bus-service/track/:driverId
 *
 * Central tracking request endpoint.
 * The backend Decision Engine decides whether to ping the driver via Telegram.
 *
 * Request body (optional):
 *   { driverName?: string }
 *
 * Responses:
 *   { status: "active",  latitude, longitude, trackingExpiresAt }
 *   { status: "waiting" }
 */
router.post('/track/:driverId', trackBus);

/**
 * GET /api/bus-service/location/:driverId
 *
 * Returns the latest persisted coordinates for the given driver.
 * Used by the frontend to poll for location updates while waiting.
 *
 * Responses:
 *   { trackingActive: true,  latitude, longitude, trackingExpiresAt, lastUpdated }
 *   { trackingActive: false, message: "Driver location unavailable." }
 */
router.get('/location/:driverId', getLocation);

export default router;
