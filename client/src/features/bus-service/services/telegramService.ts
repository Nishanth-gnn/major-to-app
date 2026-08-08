/**
 * busService.ts (formerly telegramService.ts)
 *
 * Frontend bus service API client.
 *
 * ALL communication goes through the project's own backend.
 * This file NEVER calls api.telegram.org directly.
 * Telegram credentials must NOT exist in the frontend .env.
 */

import axios from 'axios';
import { TrackingResponse, LocationResponse } from '../types';

/**
 * Requests bus tracking from the backend.
 *
 * POST /api/bus-service/track/:driverId
 *
 * The backend Decision Engine will:
 *   - Return { status: "active", latitude, longitude, trackingExpiresAt }
 *     if a valid session already exists → no Telegram message sent to driver
 *   - Return { status: "waiting" }
 *     if no session exists or it expired → ONE Telegram message sent to driver
 *
 * @param driverId   The bus ID (e.g. "1" for Pushpak AJ)
 * @param driverName Human-readable bus name sent to the backend for Telegram messages
 */
export async function requestBusTracking(
  driverId: string,
  driverName: string,
): Promise<TrackingResponse> {
  const response = await axios.post<TrackingResponse>(
    `/api/bus-service/track/${driverId}`,
    { driverName },
  );
  return response.data;
}

/**
 * Fetches the latest persisted location for a driver from the backend.
 *
 * GET /api/bus-service/location/:driverId
 *
 * Used by the polling loop in BusServicePage while waiting for the driver
 * to share live location, and by LiveTrackingPage to receive location updates.
 *
 * Returns null if the driver location is unavailable or tracking has expired.
 */
export async function getBusLocation(driverId: string): Promise<LocationResponse | null> {
  try {
    const response = await axios.get<LocationResponse>(
      `/api/bus-service/location/${driverId}`,
    );
    return response.data;
  } catch (error) {
    console.error('[busService] Error fetching bus location:', error);
    return null;
  }
}
