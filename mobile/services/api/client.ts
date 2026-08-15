import axios from 'axios';
import { Platform } from 'react-native';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || Platform.select({
  android: 'http://10.0.2.2:4000/api',
  ios: 'http://localhost:4000/api',
  default: 'http://localhost:4000/api',
});

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const msg = error.response?.data?.message || error.message;
      return Promise.reject(new Error(msg));
    }
    if (error.request) {
      return Promise.reject(new Error('Network error — check your connection'));
    }
    return Promise.reject(error);
  }
);

export default apiClient;
