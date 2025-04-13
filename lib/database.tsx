import { Database } from '@nozbe/watermelondb';
import { synchronize } from '@nozbe/watermelondb/sync';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import NetInfo from '@react-native-community/netinfo';
import SecureStore from 'expo-secure-store';

import { createAdapter } from './adapter'; // <---- imports from adapter.web.ts on web
import { schema } from '~/models/schema';
// import { migrations } from '~/models/migrations';
import { modelClasses } from '~/models';
import { API_URL } from '~/constants';

// Create a database adapter
// const adapter =
//   Platform.OS === 'web'
//     ? new LokiJSAdapter({
//         schema,
//         migrations,
//         useWebWorker: true,
//         useIncrementalIndexedDB: true,
//       })
//     : new SQLiteAdapter({
//         schema,
//         migrations,
//         dbName: 'musichub',
//         // Don't use JSI for Expo Go - set true only for dev builds or production
//         jsi: process.env.APP_VARIANT !== 'development',
//       });

// Create the database
export const database = new Database({
  adapter: createAdapter({ schema }),
  modelClasses,
});

// Database context
type DatabaseContextType = {
  database: Database;
  isSyncing: boolean;
  lastSyncedAt: Date | null;
  syncDatabase: () => Promise<void>;
};

const DatabaseContext = createContext<DatabaseContextType | null>(null);

// Provider component
export function DatabaseProvider({ children }: { children: ReactNode }) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  // Sync with server
  const syncDatabase = async () => {
    if (isSyncing) return;

    try {
      setIsSyncing(true);

      // Get authentication token
      const token = await getAuthToken();
      if (!token) {
        console.error('Not authenticated, cannot sync');
        return;
      }

      // Synchronize database with server
      await synchronize({
        database,
        pullChanges: async ({ lastPulledAt }) => {
          // Pull changes from server
          const response = await fetch(`${API_URL}/sync`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ lastPulledAt }),
          });

          if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
          }

          const { changes, timestamp } = await response.json();
          return { changes, timestamp };
        },
        pushChanges: async ({ changes }) => {
          // Push local changes to server
          await fetch(`${API_URL}/sync`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ changes }),
          });
        },
        migrationsEnabledAtVersion: 1,
      });

      // Update last synced time
      setLastSyncedAt(new Date());
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  // Initial sync when the app starts
  useEffect(() => {
    const initialSync = async () => {
      await syncDatabase();
    };

    // Check if we're online before syncing
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        initialSync();
      }
    });

    // Set up periodic syncing
    const syncIntervalId = setInterval(
      () => {
        NetInfo.fetch().then((state) => {
          if (state.isConnected) {
            syncDatabase();
          }
        });
      },
      15 * 60 * 1000
    ); // Sync every 15 minutes

    return () => clearInterval(syncIntervalId);
  }, []);

  // Provide database and sync functions to children
  return (
    <DatabaseContext.Provider
      value={{
        database,
        isSyncing,
        lastSyncedAt,
        syncDatabase,
      }}>
      {children}
    </DatabaseContext.Provider>
  );
}

// Hook to use the database context
export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
}

// Helper to get auth token
async function getAuthToken() {
  // Implementation depends on your auth library
  // This is just a placeholder
  try {
    // Get token from secure storage
    return await SecureStore.getItemAsync('authToken');
  } catch (error) {
    return null;
  }
}
