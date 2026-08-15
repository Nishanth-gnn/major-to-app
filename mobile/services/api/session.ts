import * as SecureStore from 'expo-secure-store';

const AUTH_TOKEN_KEY = 'airport-assistance.auth-token';

export const getAuthToken = () => SecureStore.getItemAsync(AUTH_TOKEN_KEY);
export const saveAuthToken = (token: string) => SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
export const clearAuthToken = () => SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
