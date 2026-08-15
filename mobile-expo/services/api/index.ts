import axios from 'axios';
import { Flight, Baggage, PassengerProfile, Meal, MealOrder } from '../../types';

// Replace with your actual backend URL
const API_BASE_URL = 'http://your-backend-server.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const flightService = {
  getFlights: async (passengerId: string): Promise<Flight[]> => {
    try {
      const response = await api.get(`/flights/${passengerId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching flights:', error);
      // Return mock data for demo
      return [
        {
          id: '1',
          flightNumber: '6E2412',
          airline: 'IndiGo',
          route: { from: 'HYD', to: 'DEL' },
          terminal: '1',
          gate: '14B',
          seat: '18A',
          boardingGroup: 'A',
          status: 'boarding',
          departureTime: '2024-08-12T14:30:00',
          arrivalTime: '2024-08-12T16:45:00',
          boardingStartsIn: 42,
        },
      ];
    }
  },

  updateFlightStatus: async (flightId: string): Promise<Flight> => {
    const response = await api.get(`/flights/${flightId}/status`);
    return response.data;
  },
};

export const baggageService = {
  getBaggage: async (passengerId: string): Promise<Baggage[]> => {
    try {
      const response = await api.get(`/baggage/${passengerId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching baggage:', error);
      // Return mock data
      return [
        {
          id: '1',
          bagNumber: 'BAG-001',
          tagNumber: 'TAG-ABC123',
          status: 'in-transit',
          currentLocation: 'Loading Area',
          beltNumber: '5',
          eta: '2024-08-12T16:45:00',
          lastUpdated: new Date().toISOString(),
        },
      ];
    }
  },

  trackBaggage: async (bagId: string) => {
    const response = await api.get(`/baggage/${bagId}/location`);
    return response.data;
  },
};

export const transitService = {
  getTransitOptions: async (from: string, to: string) => {
    try {
      const response = await api.get(`/transit`, {
        params: { from, to },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching transit:', error);
      return [];
    }
  },

  getMetroTracking: async (lineId: string) => {
    const response = await api.get(`/transit/metro/${lineId}`);
    return response.data;
  },
};

export const profileService = {
  getProfile: async (passengerId: string): Promise<PassengerProfile> => {
    try {
      const response = await api.get(`/profile/${passengerId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return {} as PassengerProfile;
    }
  },

  updateProfile: async (passengerId: string, updates: Partial<PassengerProfile>) => {
    const response = await api.patch(`/profile/${passengerId}`, updates);
    return response.data;
  },
};

export const mealService = {
  getRestaurants: async (terminalId: string): Promise<Meal[]> => {
    try {
      const response = await api.get(`/meals/restaurants`, {
        params: { terminal: terminalId },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      return [];
    }
  },

  placeOrder: async (order: MealOrder) => {
    const response = await api.post(`/meals/order`, order);
    return response.data;
  },

  getOrderStatus: async (orderId: string): Promise<MealOrder> => {
    const response = await api.get(`/meals/order/${orderId}`);
    return response.data;
  },
};

export const emergencyService = {
  dispatchEmergency: async (type: string, location: { latitude: number; longitude: number }) => {
    const response = await api.post(`/emergency/dispatch`, {
      type,
      location,
      timestamp: new Date().toISOString(),
    });
    return response.data;
  },

  getEmergencyStatus: async (emergencyId: string) => {
    const response = await api.get(`/emergency/${emergencyId}`);
    return response.data;
  },
};

export default api;
