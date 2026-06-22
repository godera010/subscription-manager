import { Platform } from 'react-native';

function getSecureStorage() {
  if (Platform.OS === 'web') {
    return {
      getItem: async (key: string) => localStorage.getItem(key),
      setItem: async (key: string, value: string) => localStorage.setItem(key, value),
      removeItem: async (key: string) => localStorage.removeItem(key),
    };
  }
  try {
    const SecureStore = require('expo-secure-store');
    return {
      getItem: (key: string) => SecureStore.getItemAsync(key),
      setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
      removeItem: (key: string) => SecureStore.deleteItemAsync(key),
    };
  } catch {
    return {
      getItem: async () => null,
      setItem: async () => {},
      removeItem: async () => {},
    };
  }
}

export const storage = getSecureStorage();

const STORE_KEY = 'subsmanager-state';

export async function persistState(state: unknown): Promise<void> {
  try {
    await storage.setItem(STORE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to persist state:', e);
  }
}

export async function loadPersistedState<T>(): Promise<T | null> {
  try {
    const data = await storage.getItem(STORE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.warn('Failed to load persisted state:', e);
    return null;
  }
}
