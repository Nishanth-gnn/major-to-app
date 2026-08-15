export interface BoardingData {
  passenger_name?: string;
  ticket_id?: string;
  flight_id?: string;
  from?: string;
  to?: string;
  terminal?: string;
  seat?: string;
  gate?: string;
  date?: string;
  airline?: string;
  boarding_group?: string;
  departure_time?: string;
  arrival_time?: string;
}

export interface Airport {
  id: string;
  code: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  metroAvailable: boolean;
  metroLine?: string;
  metroFare?: string;
  busService?: boolean;
}

export interface BusInfo {
  id: string;
  name: string;
  route: string;
  eta: string;
  fare: string;
  crowdLevel: 'Low' | 'Medium' | 'High';
  platform: string;
  status: 'On Time' | 'Delayed' | 'Cancelled';
}

export interface MetroInfo {
  lineName: string;
  fromStation: string;
  toStation: string;
  route: string[];
  coordinates: [number, number][];
  fare: string;
  speedKmh: number;
  status: string;
}

export interface TrackingSession {
  bus?: BusInfo;
  metro?: MetroInfo;
  location?: {
    latitude: number;
    longitude: number;
    timestamp: number;
  };
  destination?: string;
  isReversed?: boolean;
  driverId?: string;
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

export type AgencyType = 'police' | 'medical' | 'fire' | 'security' | 'lost_found';

export interface EmergencyReasonItem {
  id: string;
  label: string;
  category: 'Police' | 'Medical' | 'Fire' | 'Security' | 'General';
  primaryAgency: AgencyType;
  additionalAgencies: AgencyType[];
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  icon: string;
  color: string;
  description: string;
}

export interface EmergencyAlertData {
  reason: EmergencyReasonItem;
  latitude: number;
  longitude: number;
  passengerName: string;
  ticketId: string;
  terminal: string;
}

export interface MedicationItem {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  instruction: 'With Food' | 'Empty Stomach' | 'After Meal' | 'Before Bed';
  reminderEnabled: boolean;
}

export interface HealthProfile {
  passengerName: string;
  age: number;
  bloodGroup: string;
  medicalConditions: string[];
  allergies: string[];
  dietaryPreferences: string[];
  emergencyContact: string;
  emergencyContactPhone: string;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  prepTime: number;
  seatDelivery: boolean;
  imageUrl?: string;
  priceRange: string;
  location: string;
  isVeg: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
}

export type FlightStatusType = 'boarding_soon' | 'delayed' | 'on_time' | 'gate_changed';
export type TransitMode = 'metro' | 'bus' | 'cab' | 'walk';
export type TrackingState = 'idle' | 'waiting' | 'active' | 'expired' | 'error';
