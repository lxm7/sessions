import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { AppState, AppStateStatus } from 'react-native';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { useDatabase } from './database';
import { useAuth } from './auth';
import { syncDatabase, SyncState, SyncOptions, SyncResult, isOnline } from '~/lib/sync';
import { getLastSyncTimestamp } from '~/lib/storage';

// Default sync interval in ms (15 minutes)
const DEFAULT_SYNC_INTERVAL = 15 * 60 * 1000;

// Context type
type SyncContextType = {
  state: SyncState;
  sync: (options?: SyncOptions) => Promise<SyncResult>;
  setSyncInterval: (intervalMs: number) => void;
  resetSyncInterval: () => void;
};

// Create context
const SyncContext = createContext<SyncContextType | null>(null);

// Provider props
type SyncProviderProps = {
  children: ReactNode;
  initialSyncInterval?: number;
  syncOnAppForeground?: boolean;
  syncOnConnectionRestored?: boolean;
  minBackgroundTime?: number;
};

export function SyncProvider({
  children,
  initialSyncInterval = DEFAULT_SYNC_INTERVAL,
  syncOnAppForeground = true,
  syncOnConnectionRestored = true,
  minBackgroundTime = 60 * 1000, // 1 minute
}: SyncProviderProps) {
  // Get database and auth
  const { database } = useDatabase();
  const { isSignedIn } = useAuth();

  // Sync state
  const [state, setState] = useState<SyncState>({
    lastSyncedAt: null,
    isSyncing: false,
    lastSyncResult: null,
    error: null,
  });

  // Sync interval
  const [syncInterval, setSyncInterval] = useState<number>(initialSyncInterval);
  const [syncIntervalId, setSyncIntervalId] = useState<NodeJS.Timeout | null>(null);

  // Track app state for background/foreground transitions
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);
  const [lastBackgroundedAt, setLastBackgroundedAt] = useState<number | null>(null);

  // Sync function
  const sync = useCallback(
    async (options: SyncOptions = {}): Promise<SyncResult> => {
      // Don't sync if already syncing or not signed in
      if (state.isSyncing || !isSignedIn) {
        return {
          success: false,
          error: state.isSyncing ? 'Sync already in progress' : 'Not signed in',
        };
      }

      // Check if forced or if we're online
      const online = await isOnline();
      if (!online && !options.force) {
        return {
          success: false,
          error: 'Device is offline',
        };
      }

      // Set syncing state
      setState((prev) => ({ ...prev, isSyncing: true, error: null }));

      try {
        // Sync database
        const result = await syncDatabase(database, options);

        // Update state with result
        setState((prev) => ({
          ...prev,
          isSyncing: false,
          lastSyncResult: result,
          lastSyncedAt: result.success ? new Date() : prev.lastSyncedAt,
          error: result.success
            ? null
            : result.error instanceof Error
              ? result.error
              : new Error(String(result.error)),
        }));

        return result;
      } catch (error) {
        // Update state with error
        setState((prev) => ({
          ...prev,
          isSyncing: false,
          error: error instanceof Error ? error : new Error(String(error)),
          lastSyncResult: {
            success: false,
            error: error instanceof Error ? error : String(error),
          },
        }));

        return {
          success: false,
          error,
        };
      }
    },
    [database, isSignedIn, state.isSyncing]
  );

  // Initialize sync interval
  const initializeSyncInterval = useCallback(() => {
    // Clear any existing interval
    if (syncIntervalId) {
      clearInterval(syncIntervalId);
      setSyncIntervalId(null);
    }

    // Only set interval if signed in
    if (isSignedIn) {
      const id = setInterval(() => {
        // Only sync if we're online and not currently syncing
        isOnline().then((online) => {
          if (online && !state.isSyncing) {
            sync();
          }
        });
      }, syncInterval);

      setSyncIntervalId(id);
    }

    return () => {
      if (syncIntervalId) clearInterval(syncIntervalId);
    };
  }, [isSignedIn, syncInterval, state.isSyncing, sync]);

  // Reset sync interval to default
  const resetSyncInterval = useCallback(() => {
    setSyncInterval(DEFAULT_SYNC_INTERVAL);
  }, []);

  // Initialize last sync time
  useEffect(() => {
    const initializeLastSyncTime = async () => {
      try {
        const timestamp = await getLastSyncTimestamp();
        if (timestamp) {
          setState((prev) => ({
            ...prev,
            lastSyncedAt: new Date(timestamp),
          }));
        }
      } catch (error) {
        console.error('Error initializing last sync time:', error);
      }
    };

    initializeLastSyncTime();
  }, []);

  // Handle app state changes (background/foreground)
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      // Detect when app comes to foreground
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        // If we have a record of when the app went to background
        if (lastBackgroundedAt && syncOnAppForeground) {
          // Check if the app was in background for long enough to justify a sync
          const timeInBackground = Date.now() - lastBackgroundedAt;
          if (timeInBackground >= minBackgroundTime) {
            sync();
          }
        }
      }
      // Detect when app goes to background
      else if (appState === 'active' && nextAppState.match(/inactive|background/)) {
        setLastBackgroundedAt(Date.now());
      }

      setAppState(nextAppState);
    };

    // Subscribe to app state changes
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [appState, lastBackgroundedAt, sync, syncOnAppForeground, minBackgroundTime]);

  // Handle connection state changes
  useEffect(() => {
    const handleConnectionChange = (state: NetInfoState) => {
      // If connection was restored and we want to sync in this case
      if (state.isConnected && syncOnConnectionRestored) {
        sync();
      }
    };

    // Subscribe to connection state changes
    const unsubscribe = NetInfo.addEventListener(handleConnectionChange);

    return () => {
      unsubscribe();
    };
  }, [sync, syncOnConnectionRestored]);

  // Initialize sync interval when auth state changes
  useEffect(() => {
    initializeSyncInterval();

    // Try to sync immediately when signed in
    if (isSignedIn) {
      sync();
    }

    return () => {
      if (syncIntervalId) clearInterval(syncIntervalId);
    };
  }, [isSignedIn, initializeSyncInterval, sync]);

  // Reinitialize sync interval when interval time changes
  useEffect(() => {
    initializeSyncInterval();

    return () => {
      if (syncIntervalId) clearInterval(syncIntervalId);
    };
  }, [syncInterval, initializeSyncInterval]);

  // Context value
  const contextValue: SyncContextType = {
    state,
    sync,
    setSyncInterval,
    resetSyncInterval,
  };

  return <SyncContext.Provider value={contextValue}>{children}</SyncContext.Provider>;
}

// Hook to use the sync context
export function useSync() {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error('useSync must be used within a SyncProvider');
  }
  return context;
}
