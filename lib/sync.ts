import { Database } from '@nozbe/watermelondb';
import { synchronize } from '@nozbe/watermelondb/sync';
import NetInfo from '@react-native-community/netinfo';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { API_URL } from '~/constants';

// Types
export type SyncResult = {
  success: boolean;
  error?: Error | string;
  timestamp?: Date;
  pullCount?: number;
  pushCount?: number;
};

export type SyncState = {
  lastSyncedAt: Date | null;
  isSyncing: boolean;
  lastSyncResult: SyncResult | null;
  error: Error | null;
};

export type SyncOptions = {
  force?: boolean;
  syncRelations?: string[];
  onProgress?: (progress: number) => void;
};

const LAST_SYNC_KEY = 'last_sync_timestamp';

/**
 * Checks if the device is online
 */
export const isOnline = async (): Promise<boolean> => {
  const netInfo = await NetInfo.fetch();
  return netInfo.isConnected === true;
};

/**
 * Gets the last sync timestamp from secure storage
 */
export const getLastSyncTimestamp = async (): Promise<number | null> => {
  try {
    const timestamp = await SecureStore.getItemAsync(LAST_SYNC_KEY);
    return timestamp ? parseInt(timestamp, 10) : null;
  } catch (error) {
    console.error('Error getting last sync timestamp:', error);
    return null;
  }
};

/**
 * Sets the last sync timestamp in secure storage
 */
export const setLastSyncTimestamp = async (timestamp: number): Promise<void> => {
  try {
    await SecureStore.setItemAsync(LAST_SYNC_KEY, timestamp.toString());
  } catch (error) {
    console.error('Error setting last sync timestamp:', error);
  }
};

/**
 * Gets an auth token for API calls
 */
export const getAuthToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync('authToken');
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

/**
 * Syncs the database with the server
 */
export const syncDatabase = async (
  database: Database,
  options: SyncOptions = {}
): Promise<SyncResult> => {
  // Check if we're online
  const online = await isOnline();
  if (!online) {
    return {
      success: false,
      error: new Error('Device is offline'),
    };
  }

  // Get authentication token
  const token = await getAuthToken();
  if (!token) {
    return {
      success: false,
      error: new Error('Not authenticated'),
    };
  }

  let pullCount = 0;
  let pushCount = 0;

  try {
    // Synchronize database with server
    const syncResult = await synchronize({
      database,
      pullChanges: async ({ lastPulledAt }) => {
        // Pull changes from server
        const response = await fetch(`${API_URL}/sync`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            'X-Client-Platform': Platform.OS,
          },
          body: JSON.stringify({
            lastPulledAt,
            relations: options.syncRelations || [],
          }),
        });

        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
        }

        const { changes, timestamp } = await response.json();

        // Calculate pull count for tracking
        pullCount = Object.values(changes).reduce((sum: number, table: any) => {
          return sum + (table.created?.length || 0) + (table.updated?.length || 0);
        }, 0);

        return { changes, timestamp };
      },
      pushChanges: async ({ changes, lastPulledAt }) => {
        // Push local changes to server
        const response = await fetch(`${API_URL}/sync`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            'X-Client-Platform': Platform.OS,
          },
          body: JSON.stringify({ changes, lastPulledAt }),
        });

        if (!response.ok) {
          throw new Error(`Failed to push changes: ${response.status}`);
        }

        // Calculate push count for tracking
        pushCount = Object.values(changes).reduce((sum: number, table: any) => {
          return (
            sum +
            (table.created?.length || 0) +
            (table.updated?.length || 0) +
            (table.deleted?.length || 0)
          );
        }, 0);
      },
      migrationsEnabledAtVersion: 1,
      log: __DEV__ ? console.log : undefined,
      // Pass progress callback if provided in options
      onProgress: options.onProgress,
    });

    // Save the sync timestamp
    if (syncResult.timestamp) {
      await setLastSyncTimestamp(syncResult.timestamp);
    }

    // Return success result
    return {
      success: true,
      timestamp: new Date(),
      pullCount,
      pushCount,
    };
  } catch (error) {
    console.error('Sync failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
};
