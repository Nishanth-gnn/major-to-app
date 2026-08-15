import { create } from 'zustand';
import { Flight, Baggage, PassengerProfile } from '../types';

interface AppState {
  // Passenger
  passengerId: string;
  profile: PassengerProfile | null;
  setProfile: (profile: PassengerProfile) => void;

  // Flights
  currentFlight: Flight | null;
  flights: Flight[];
  setFlights: (flights: Flight[]) => void;
  setCurrentFlight: (flight: Flight) => void;

  // Baggage
  baggage: Baggage[];
  setBaggage: (baggage: Baggage[]) => void;

  // UI
  showAIAssistant: boolean;
  setShowAIAssistant: (show: boolean) => void;

  // Offline
  isOffline: boolean;
  setIsOffline: (offline: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  passengerId: 'PAX-001',
  profile: null,
  setProfile: (profile) => set({ profile }),

  currentFlight: null,
  flights: [],
  setFlights: (flights) => set({ flights }),
  setCurrentFlight: (flight) => set({ currentFlight: flight }),

  baggage: [],
  setBaggage: (baggage) => set({ baggage }),

  showAIAssistant: false,
  setShowAIAssistant: (show) => set({ showAIAssistant: show }),

  isOffline: false,
  setIsOffline: (offline) => set({ isOffline: offline }),
}));
