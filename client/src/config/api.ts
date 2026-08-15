import axios from 'axios';

const RAILWAY_API_URL = 'https://major-to-app-production.up.railway.app';
const configuredApiUrl = import.meta.env.VITE_API_URL;

export const API_BASE_URL = (configuredApiUrl ||
  (import.meta.env.DEV ? 'http://localhost:4000' : RAILWAY_API_URL)).replace(/\/+$/, '');

export function apiUrl(path: string): string {
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  return fetch(apiUrl(path), init);
}

// Existing Axios calls use relative API paths. Configure them once so they use
// the same backend URL as fetch and Socket.IO without changing request logic.
axios.defaults.baseURL = API_BASE_URL;
