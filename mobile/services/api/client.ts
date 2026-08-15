import axios from 'axios';
import { API_BASE_URL } from './config';
import { getAuthToken } from './session';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use(async (config) => {
  const token = await getAuthToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
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
