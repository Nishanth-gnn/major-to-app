export interface BusRoute {
  from: string;
  to: string;
}

export interface BusInfo {
  id: string;
  name: string;
  departure: string;
  eta: string;
  seats: 'Available' | 'Filling Fast' | 'Housefull';
}

export interface TrackingLocation {
  latitude: number;
  longitude: number;
  timestamp: number;
}

/**
 * Response shape from POST /api/bus-service/track/:driverId
 * and GET /api/bus-service/location/:driverId.
 *
 * status:
 *   "active"  — tracking session exists and is valid; lat/lng are present
 *   "waiting" — request sent to driver; poll /location/:driverId until active
 *   "expired" — prior session exists but has expired; new request has been sent
 */
export interface TrackingResponse {
  status?: 'active' | 'waiting' | 'expired';
  /** Present when status === "active" */
  latitude?: number;
  longitude?: number;
  trackingExpiresAt?: string;   // ISO 8601
  lastUpdated?: string;         // ISO 8601
  message?: string;
}

/**
 * Response shape from GET /api/bus-service/location/:driverId
 * (used for polling while waiting for the driver to share location).
 */
export interface LocationResponse {
  trackingActive: boolean;
  latitude?: number;
  longitude?: number;
  trackingExpiresAt?: string;
  lastUpdated?: string;
  message?: string;
}
