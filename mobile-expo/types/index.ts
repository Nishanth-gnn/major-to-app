export interface Flight {
  id: string;
  flightNumber: string;
  airline: string;
  route: {
    from: string;
    to: string;
  };
  terminal: string;
  gate: string;
  seat: string;
  boardingGroup: string;
  status: 'scheduled' | 'boarding' | 'departed' | 'delayed';
  departureTime: string;
  arrivalTime: string;
  boardingStartsIn: number; // minutes
}

export interface Baggage {
  id: string;
  bagNumber: string;
  tagNumber: string;
  status: 'checked-in' | 'loaded' | 'in-transit' | 'delivered';
  currentLocation: string;
  beltNumber?: string;
  eta: string;
  lastUpdated: string;
}

export interface TransitOption {
  id: string;
  type: 'metro' | 'express' | 'bus' | 'cab' | 'walkway';
  line?: string;
  eta: number; // minutes
  fare?: number;
  crowdLevel: 'low' | 'medium' | 'high';
  platform?: string;
  pickupZone?: string;
  isRecommended?: boolean;
}

export interface PassengerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  frequentFlyer?: string;
  dietaryPreferences: string[];
  medicalProfile: {
    allergies: string[];
    conditions: string[];
    medications: string[];
  };
  emergencyContacts: Array<{
    name: string;
    phone: string;
    relationship: string;
  }>;
  preferences: {
    language: string;
    notifications: boolean;
    accessibility: {
      screenReader: boolean;
      fontScale: number;
      highContrast: boolean;
      reducedMotion: boolean;
    };
  };
}

export interface Meal {
  id: string;
  restaurantName: string;
  cuisine: string;
  rating: number;
  prepTime: number;
  image: string;
  items: MealItem[];
}

export interface MealItem {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
}

export interface MealOrder {
  id: string;
  orderId: string;
  flight: string;
  gate: string;
  seat: string;
  items: MealItem[];
  status: 'ordered' | 'preparing' | 'packed' | 'transferred' | 'loaded' | 'delivered';
  eta: string;
  deliveryMethod: 'seat' | 'gate';
}

export interface EmergencyContact {
  id: string;
  type: 'sos' | 'medical' | 'police' | 'security' | 'fire' | 'lost-found' | 'missing-person';
  status: 'idle' | 'dispatched' | 'arrived';
  dispatchTime?: string;
  eta?: number;
  assignedTeam?: string;
  gpsLocation?: { latitude: number; longitude: number };
}
