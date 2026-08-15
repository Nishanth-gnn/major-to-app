import { TrackBusResponse, BusLocationResponse } from '../types';

/**
 * Sends a tracking request to the backend Decision Engine via POST /api/bus-service/track/:driverId.
 */
export async function requestBusTracking(
  driverId: string,
  driverName?: string,
): Promise<TrackBusResponse> {
  const response = await fetch(
    `/api/bus-service/track/${driverId}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ driverName }),
    },
  );

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || `HTTP ${response.status}: Tracking request failed`);
  }

  return response.json();
}

/**
 * Fetches the latest persisted coordinates via GET /api/bus-service/location/:driverId.
 */
export async function getBusLocation(
  driverId: string,
): Promise<BusLocationResponse> {
  const response = await fetch(
    `/api/bus-service/location/${driverId}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    },
  );

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || `HTTP ${response.status}: Failed to fetch location`);
  }

  return response.json();
}
