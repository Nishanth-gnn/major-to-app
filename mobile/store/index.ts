import { create } from 'zustand';
import { BoardingData, Airport, EmergencyAlertData, MedicationItem, HealthProfile } from '../types';

export const AIRPORTS: Airport[] = [
  {
    id: 'hyd',
    code: 'HYD',
    name: 'Rajiv Gandhi International Airport',
    city: 'Hyderabad',
    country: 'India',
    lat: 17.2403,
    lng: 78.4294,
    metroAvailable: true,
    metroLine: 'HMRL Airport Line',
    metroFare: '₹60',
    busService: true,
  },
  {
    id: 'del',
    code: 'DEL',
    name: 'Indira Gandhi International Airport',
    city: 'New Delhi',
    country: 'India',
    lat: 28.5562,
    lng: 77.1000,
    metroAvailable: true,
    metroLine: 'Delhi Airport Express Line',
    metroFare: '₹100',
    busService: true,
  },
  {
    id: 'bom',
    code: 'BOM',
    name: 'Chhatrapati Shivaji Maharaj International Airport',
    city: 'Mumbai',
    country: 'India',
    lat: 19.0896,
    lng: 72.8656,
    metroAvailable: false,
    busService: true,
  },
  {
    id: 'blr',
    code: 'BLR',
    name: 'Kempegowda International Airport',
    city: 'Bengaluru',
    country: 'India',
    lat: 13.1979,
    lng: 77.7063,
    metroAvailable: false,
    busService: true,
  },
];

interface PassengerState {
  boardingData: BoardingData | null;
  selectedAirport: Airport;
  isAuthenticated: boolean;
  userName: string;

  setBoardingData: (data: BoardingData | null) => void;
  setSelectedAirport: (airport: Airport) => void;
  setAuthenticated: (val: boolean, name?: string) => void;
}

export const usePassengerStore = create<PassengerState>((set) => ({
  boardingData: {
    passenger_name: 'Sai Venkat',
    ticket_id: '3409967503',
    flight_id: '6E2412',
    from: 'HYD',
    to: 'DEL',
    terminal: 'Terminal 2',
    seat: '18A',
    gate: '14B',
    date: new Date().toLocaleDateString('en-IN'),
    airline: 'IndiGo',
    boarding_group: 'Group B (Zone 2)',
    departure_time: '14:30',
    arrival_time: '16:45',
  },
  selectedAirport: AIRPORTS[0],
  isAuthenticated: true,
  userName: 'Sai Venkat',

  setBoardingData: (data) => set({ boardingData: data }),
  setSelectedAirport: (airport) => set({ selectedAirport: airport }),
  setAuthenticated: (val, name) => set({ isAuthenticated: val, userName: name ?? '' }),
}));

interface EmergencyState {
  alertSent: boolean;
  alertData: EmergencyAlertData | null;
  setAlertSent: (sent: boolean, data?: EmergencyAlertData) => void;
  resetAlert: () => void;
}

export const useEmergencyStore = create<EmergencyState>((set) => ({
  alertSent: false,
  alertData: null,
  setAlertSent: (sent, data) => set({ alertSent: sent, alertData: data ?? null }),
  resetAlert: () => set({ alertSent: false, alertData: null }),
}));

interface HealthState {
  profile: HealthProfile;
  medications: MedicationItem[];
  updateProfile: (profile: HealthProfile) => void;
  addMedication: (med: MedicationItem) => void;
  removeMedication: (id: string) => void;
  toggleReminder: (id: string) => void;
}

const DEFAULT_PROFILE: HealthProfile = {
  passengerName: 'Sai Venkat',
  age: 34,
  bloodGroup: 'B+',
  medicalConditions: ['Type 2 Diabetes', 'Mild Hypertension'],
  allergies: ['Lactose Intolerance', 'Penicillin'],
  dietaryPreferences: ['Vegetarian', 'Low Sugar', 'Low Sodium'],
  emergencyContact: 'Priya Venkat',
  emergencyContactPhone: '+91 98765 43210',
};

const DEFAULT_MEDICATIONS: MedicationItem[] = [
  {
    id: 'med-1',
    name: 'Metformin',
    dosage: '500 mg',
    frequency: 'Twice Daily',
    time: '08:00 AM',
    instruction: 'With Food',
    reminderEnabled: true,
  },
  {
    id: 'med-2',
    name: 'Amlodipine',
    dosage: '5 mg',
    frequency: 'Once Daily',
    time: '06:30 PM',
    instruction: 'After Meal',
    reminderEnabled: true,
  },
];

export const useHealthStore = create<HealthState>((set) => ({
  profile: DEFAULT_PROFILE,
  medications: DEFAULT_MEDICATIONS,
  updateProfile: (profile) => set({ profile }),
  addMedication: (med) => set((s) => ({ medications: [med, ...s.medications] })),
  removeMedication: (id) => set((s) => ({ medications: s.medications.filter((m) => m.id !== id) })),
  toggleReminder: (id) =>
    set((s) => ({
      medications: s.medications.map((m) =>
        m.id === id ? { ...m, reminderEnabled: !m.reminderEnabled } : m
      ),
    })),
}));

type FlightStatus = 'boarding_soon' | 'delayed' | 'on_time' | 'gate_changed';

interface FlightState {
  status: FlightStatus;
  setStatus: (s: FlightStatus) => void;
}

export const useFlightStore = create<FlightState>((set) => ({
  status: 'boarding_soon',
  setStatus: (status) => set({ status }),
}));

interface AIMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface AIStore {
  isOpen: boolean;
  messages: AIMessage[];
  setOpen: (open: boolean) => void;
  addMessage: (msg: AIMessage) => void;
  clearMessages: () => void;
}

export const useAIStore = create<AIStore>((set) => ({
  isOpen: false,
  messages: [
    {
      id: 'welcome',
      sender: 'assistant',
      text: '👋 Hello! I\'m AURA, your AI airport concierge. I can help you track baggage, navigate to your gate, find transit routes, order food, or handle emergencies. How can I assist you today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ],
  setOpen: (open) => set({ isOpen: open }),
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  clearMessages: () => set({ messages: [] }),
}));
