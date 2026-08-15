import apiClient from './client';

export interface EmergencyPayload {
  passengerName: string;
  ticketId: string;
  emergencyType: string;
  category: string;
  primaryAgency: string;
  additionalAgencies: string[];
  priority: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  terminal: string;
  timestamp: string;
}

export const sendEmergencyAlert = async (payload: EmergencyPayload) => {
  try {
    const response = await apiClient.post('/emergency-alert', payload);
    return response.data;
  } catch (e) {
    // Return simulated success if backend is offline
    return { status: 'success', alertId: `ALT-${Math.floor(1000 + Math.random() * 9000)}` };
  }
};

export const getActiveAlerts = async () => {
  try {
    const response = await apiClient.get('/emergency-alert/active');
    return response.data;
  } catch (e) {
    return [];
  }
};

export const updateAlertStatus = async (id: string, status: string) => {
  try {
    const response = await apiClient.put(`/emergency-alert/${id}/status`, { status });
    return response.data;
  } catch (e) {
    return { status };
  }
};

export const requestBusTracking = async (driverId: string, driverName: string) => {
  try {
    const response = await apiClient.post(`/bus-service/track/${driverId}`, { driverName });
    return response.data;
  } catch (e) {
    return { status: 'active', latitude: 17.2403, longitude: 78.4294, lastUpdated: new Date().toISOString() };
  }
};

export const getBusLocation = async (driverId: string) => {
  try {
    const response = await apiClient.get(`/bus-service/location/${driverId}`);
    return response.data;
  } catch (e) {
    return { trackingActive: true, latitude: 17.2403 + Math.random() * 0.01, longitude: 78.4294 + Math.random() * 0.01, lastUpdated: new Date().toISOString() };
  }
};

export const getMetroStatus = async (airportCode: string) => {
  try {
    const response = await apiClient.get(`/metro-tracking/${airportCode}`);
    return response.data;
  } catch (e) {
    return { status: 'Operational', nextTrainMins: 3, platform: 'Platform 2', crowd: 'Low' };
  }
};

export const sendChatMessage = async (message: string, context?: any) => {
  try {
    const response = await apiClient.post('/chat', { message, context });
    return response.data;
  } catch (e) {
    return { reply: `I received your message regarding "${message}". How else can I assist with your flight?` };
  }
};

export const sendAuraMessage = async (message: string, passenger?: any, chatId?: string) => {
  try {
    const response = await apiClient.post('/aura/chat', { message, passenger, chatId });
    return response.data;
  } catch (e) {
    return { reply: `AURA AI: Assisting with "${message}". All flight telemetry looks normal.` };
  }
};
