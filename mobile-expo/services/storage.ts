import * as SecureStore from 'expo-secure-store';

// Simple in-memory storage for demo purposes
const memoryStorage: Record<string, string> = {};

const AsyncStorage = {
  setItem: async (key: string, value: string) => {
    memoryStorage[key] = value;
  },
  getItem: async (key: string) => {
    return memoryStorage[key] || null;
  },
  removeItem: async (key: string) => {
    delete memoryStorage[key];
  },
  clear: async () => {
    Object.keys(memoryStorage).forEach(key => delete memoryStorage[key]);
  },
};

export const storageService = {
  // Secure storage (for sensitive data)
  setSecure: async (key: string, value: string) => {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error('Error saving secure data:', error);
    }
  },

  getSecure: async (key: string): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error('Error retrieving secure data:', error);
      return null;
    }
  },

  removeSecure: async (key: string) => {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error('Error removing secure data:', error);
    }
  },

  // General storage (for non-sensitive data)
  setItem: async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  },

  getItem: async (key: string): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error('Error retrieving data:', error);
      return null;
    }
  },

  removeItem: async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing data:', error);
    }
  },

  // JSON helpers
  setJSON: async (key: string, value: any) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving JSON:', error);
    }
  },

  getJSON: async (key: string): Promise<any | null> => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Error retrieving JSON:', error);
      return null;
    }
  },

  clear: async () => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
};
