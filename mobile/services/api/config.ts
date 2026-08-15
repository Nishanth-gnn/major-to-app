/** Public configuration only. Override per build with EXPO_PUBLIC_API_URL. */
const DEFAULT_API_URL = 'https://major-to-app-production.up.railway.app';

export const API_ORIGIN = (process.env.EXPO_PUBLIC_API_URL || DEFAULT_API_URL).replace(/\/+$/, '');
export const API_BASE_URL = `${API_ORIGIN}/api`;

export const apiUrl = (path: string) =>
  `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
