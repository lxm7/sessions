// lib/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Secure storage keys
export const AUTH_KEY_PREFIX = 'musichub_auth_';
export const ACCESS_TOKEN_KEY = `${AUTH_KEY_PREFIX}access_token`;
export const REFRESH_TOKEN_KEY = `${AUTH_KEY_PREFIX}refresh_token`;
export const USER_INFO_KEY = `${AUTH_KEY_PREFIX}user_info`;
export const AUTH_STATE_KEY = `${AUTH_KEY_PREFIX}auth_state`;
export const LAST_LOGIN_KEY = `${AUTH_KEY_PREFIX}last_login`;
export const LAST_SYNC_KEY = 'last_sync_timestamp';

// Cross-platform storage API
export const storage = {
  // Get item with type safety
  async getItem<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value === null) return null;
      return JSON.parse(value) as T;
    } catch (error) {
      console.error(`Error getting item from storage (${key}):`, error);
      return null;
    }
  },

  // Get string item
  async getString(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error(`Error getting string from storage (${key}):`, error);
      return null;
    }
  },

  // Set item
  async setItem(key: string, value: any): Promise<void> {
    try {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      await AsyncStorage.setItem(key, stringValue);
    } catch (error) {
      console.error(`Error setting item in storage (${key}):`, error);
    }
  },

  // Remove item
  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item from storage (${key}):`, error);
    }
  },

  // Clear all storage
  async clear(): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        const keys = await AsyncStorage.getAllKeys();
        const appKeys = keys.filter((key) => key.startsWith('musichub_'));
        await AsyncStorage.multiRemove(appKeys);
      } else {
        await AsyncStorage.clear();
      }
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
};

// Helper functions for auth and sync
export async function getAuthToken(): Promise<string | null> {
  return storage.getString(ACCESS_TOKEN_KEY);
}

export async function setAuthToken(token: string): Promise<void> {
  return storage.setItem(ACCESS_TOKEN_KEY, token);
}

export async function getLastSyncTimestamp(): Promise<number | null> {
  const timestamp = await storage.getString(LAST_SYNC_KEY);
  return timestamp ? parseInt(timestamp, 10) : null;
}

export async function setLastSyncTimestamp(timestamp: number): Promise<void> {
  return storage.setItem(LAST_SYNC_KEY, timestamp.toString());
}
