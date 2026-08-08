import { Router } from 'express';
import { getTravelRules, getBagTags, getBagStatus } from '../controllers/baggageController';

const router = Router();

/**
 * GET /api/baggage/travel-rules/:airportCode
 * Returns airport-specific prohibited / carry-on / checked / allowed item rules.
 */
router.get('/travel-rules/:airportCode', getTravelRules);

/**
 * GET /api/baggage/tags
 * Returns all bag tags associated with the authenticated passenger.
 */
router.get('/tags', getBagTags);

/**
 * GET /api/baggage/status/:tagId
 * Returns full status report for a single bag tag.
 */
router.get('/status/:tagId', getBagStatus);

export default router;
