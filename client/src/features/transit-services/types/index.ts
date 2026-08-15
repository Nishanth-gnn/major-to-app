export type AirportRegion = 'India' | 'Middle East' | 'Europe' | 'Asia' | 'North America' | 'Australia';

export interface Airport {
  id: string;
  code: string;
  name: string;
  city: string;
  country: string;
  region: AirportRegion;
  flag: string;
  defaultTerminal: string;
  defaultMetroStation: string;
  transitModes: TransitMode[];
  destinations: string[];
}

export type TransitMode = 'metro' | 'bus' | 'cab' | 'walking' | 'skytrain';

export interface TransitModeInfo {
  id: TransitMode;
  label: string;
  icon: string;
  description: string;
  tag?: string;
  badgeColor?: string;
}

export interface MetroService {
  id: string;
  lineName: string;
  lineCode: string;
  trainType: string;
  nextTrainMinutes: number;
  etaMinutes: number;
  fare: string;
  status: 'On Time' | 'Delayed' | 'Departing Soon';
  color: string;
  route: string[];
  frequency: string;
  speedKmh: number;
  totalStations: number;
  fromStation: string;
  toStation: string;
  coordinates?: [number, number][];
  airportCode?: string;
  airportName?: string;
  city?: string;
}

export interface BusInfo {
  id: string;
  name: string;
  departure: string;
  eta: string;
  seats: string;
}

export interface MultiModalOption {
  mode: TransitMode;
  title: string;
  fare: string;
  etaMinutes: number;
  distanceKm: number;
  icon: string;
  tag?: string;
  color: string;
  notes: string;
}

export interface AITransitRecommendation {
  recommendedMode: string;
  title: string;
  reason: string;
  nextDepartureInMins: number;
  expectedArrival: string;
  alternativeText: string;
}

export interface TerminalTransferGuidance {
  terminal: string;
  metroStation: string;
  distanceMeters: number;
  walkingTimeMins: number;
  level: string;
  elevatorAvailable: boolean;
  wheelchairAccessible: boolean;
}

export interface TransitNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'warning' | 'info' | 'success' | 'alert';
  read: boolean;
}

export interface TelemetryData {
  speed: number;
  heading: string;
  currentStation: string;
  nextStation: string;
  destinationStation: string;
  distanceRemainingKm: number;
  progressPercent: number;
  latitude: number;
  longitude: number;
  lastUpdated: string;
  fare: string;
  status: string;
}

export interface TrackBusResponse {
  status: 'active' | 'waiting';
  latitude?: number;
  longitude?: number;
  trackingExpiresAt?: string;
}

export interface BusLocationResponse {
  trackingActive: boolean;
  latitude?: number;
  longitude?: number;
  trackingExpiresAt?: string;
  lastUpdated?: string;
  message?: string;
}
