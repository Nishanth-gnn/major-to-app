import apiClient from './client';
import { clearAuthToken, saveAuthToken } from './session';

export async function login(email: string, password: string) {
  const { data } = await apiClient.post<{ token: string }>('/auth/login', { email, password });
  await saveAuthToken(data.token);
  return data;
}

export async function register(name: string, email: string, password: string) {
  const { data } = await apiClient.post<{ token: string }>('/auth/register', { name, email, password });
  await saveAuthToken(data.token);
  return data;
}

export const logout = clearAuthToken;
