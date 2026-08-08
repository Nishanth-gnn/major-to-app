/**
 * trackingDecisionEngine.ts
 *
 * Central business logic for bus tracking requests.
 * Has ZERO Express imports and ZERO raw Telegram imports.
 * Depends only on the repository and the TelemetryManager.
 *
 * The three cases implemented here match the architecture specification:
 *
 *   CASE 1 — No record exists
 *     → Send Telegram request → return { status: "waiting" }
 *
 *   CASE 2 — Record exists, session still valid AND location is fresh
 *     → Return stored coordinates immediately, do NOT disturb the driver
 *
 *   CASE 3 — Record exists but session expired OR location is stale
 *     → Send ONE Telegram request → update lastRequestSent → return { status: "waiting" }
 */

import * as trackingRepository from '../repositories/trackingRepository';
import { requestDriverLocation } from './telemetryManager';

// setPendingDriver is imported lazily to avoid a circular reference
// (index.ts also imports this file's exports via busController).
// We use a dynamic require at call-time instead of a top-level import.
function notifyPendingDriver(driverId: string, driverName: string): void {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { setPendingDriver } = require('../index') as { setPendingDriver: (id: string, name: string) => void };
    setPendingDriver(driverId, driverName);
  } catch {
    // index.ts may not yet be fully initialised during unit tests — safe to ignore
  }
}

// ── Configurable thresholds ────────────────────────────────────────────────────

/**
 * How long (in milliseconds) without a location update before we consider
 * the location "stale" and re-request from the driver.
 * Default: 15 minutes.
 */
const STALE_THRESHOLD_MS = 15 * 60 * 1000;

// ── Response types ─────────────────────────────────────────────────────────────

export interface ActiveTrackingResult {
  status: 'active';
  latitude: number;
  longitude: number;
  trackingExpiresAt: string; // ISO 8601
  lastUpdated: string;       // ISO 8601
}

export interface WaitingTrackingResult {
  status: 'waiting';
}

export interface ExpiredTrackingResult {
  status: 'expired';
}

export type TrackingDecision =
  | ActiveTrackingResult
  | WaitingTrackingResult
  | ExpiredTrackingResult;

// ── Decision logic ─────────────────────────────────────────────────────────────

/**
 * Evaluates the current tracking state for a given driver and
 * returns the appropriate status to send back to the passenger.
 *
 * This is the ONLY place the decision of "send Telegram vs. return cached data"
 * is made. No controller or route handler contains this logic.
 */
export async function resolveTrackingRequest(
  driverId: string,
  driverName: string,
): Promise<TrackingDecision> {
  const record = await trackingRepository.findByDriverId(driverId);
  const now = new Date();

  // ── CASE 1: No record — driver has never been asked ──────────────────────────
  if (!record) {
    notifyPendingDriver(driverId, driverName);
    await requestDriverLocation(driverName);
    await trackingRepository.updateLastRequestSent(driverId, driverName);
    return { status: 'waiting' };
  }

  // ── CASE 2: Record exists — check validity ────────────────────────────────────
  const sessionValid =
    record.trackingExpiresAt !== null && record.trackingExpiresAt > now;

  const locationFresh =
    record.lastUpdated !== null &&
    now.getTime() - record.lastUpdated.getTime() < STALE_THRESHOLD_MS;

  const hasCoordinates =
    record.latitude !== null && record.longitude !== null;

  if (sessionValid && locationFresh && hasCoordinates) {
    // Session is alive and location is recent — return immediately, do NOT ping driver
    return {
      status: 'active',
      latitude: record.latitude!,
      longitude: record.longitude!,
      trackingExpiresAt: record.trackingExpiresAt!.toISOString(),
      lastUpdated: record.lastUpdated!.toISOString(),
    };
  }

  // ── CASE 3: Session expired or location stale — send ONE request ──────────────
  notifyPendingDriver(driverId, driverName);
  await requestDriverLocation(driverName);
  await trackingRepository.updateLastRequestSent(driverId, driverName);
  return { status: 'waiting' };
}
