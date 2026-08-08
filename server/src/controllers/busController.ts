/**
 * busController.ts
 *
 * Handles HTTP request/response for bus tracking endpoints.
 * Contains ZERO business logic — delegates entirely to the Decision Engine
 * and the Tracking Repository.
 */

import { Request, Response } from 'express';
import { resolveTrackingRequest } from '../services/trackingDecisionEngine';
import { findByDriverId } from '../repositories/trackingRepository';

/**
 * POST /api/bus-service/track/:driverId
 *
 * Body (optional): { driverName?: string }
 *
 * The Decision Engine handles all three cases:
 *   → { status: "active",   latitude, longitude, trackingExpiresAt }
 *   → { status: "waiting" }
 *   → { status: "expired" }  (returned only by getLocation; track always yields active or waiting)
 */
export async function trackBus(req: Request, res: Response): Promise<void> {
  try {
    const { driverId } = req.params;
    // Cast to string — Express params are typed as string | string[] but are always string at runtime
    const driverIdStr = String(driverId);
    // driverName can come from the request body; fall back to driverId as a label
    const driverName: string = (req.body?.driverName as string) || `Bus ${driverIdStr}`;

    if (!driverIdStr) {
      res.status(400).json({ error: 'driverId is required' });
      return;
    }

    const decision = await resolveTrackingRequest(driverIdStr, driverName);
    res.status(200).json(decision);
  } catch (error: any) {
    console.error('[busController] trackBus error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

/**
 * GET /api/bus-service/location/:driverId
 *
 * Returns the latest persisted coordinates for a driver.
 *
 * Response when active:
 *   { trackingActive: true, latitude, longitude, trackingExpiresAt, lastUpdated }
 *
 * Response when expired / no data:
 *   { trackingActive: false, message: "Driver location unavailable." }
 */
export async function getLocation(req: Request, res: Response): Promise<void> {
  try {
    const { driverId } = req.params;
    const driverIdStr = String(driverId);

    if (!driverIdStr) {
      res.status(400).json({ error: 'driverId is required' });
      return;
    }

    const record = await findByDriverId(driverIdStr);
    const now = new Date();

    if (
      !record ||
      record.latitude === null ||
      record.longitude === null ||
      record.trackingExpiresAt === null ||
      record.trackingExpiresAt <= now
    ) {
      res.status(200).json({
        trackingActive: false,
        message: 'Driver location unavailable.',
      });
      return;
    }

    res.status(200).json({
      trackingActive: true,
      latitude: record.latitude,
      longitude: record.longitude,
      trackingExpiresAt: record.trackingExpiresAt.toISOString(),
      lastUpdated: record.lastUpdated?.toISOString() ?? null,
    });
  } catch (error: any) {
    console.error('[busController] getLocation error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
