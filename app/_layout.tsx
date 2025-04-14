import '../global.css';
import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { View, Text } from 'react-native';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import NetInfo from '@react-native-community/netinfo';

// Local imports
import { AuthProvider, useAuth } from '~/lib/auth';
import { DatabaseProvider } from '~/lib/database';
import { SyncProvider } from '~/lib/SyncProvider';
import OfflineBanner from '~/components/sync/OfflineBanner';

// Prevent auto hiding splash screen
SplashScreen.preventAutoHideAsync();

// Main Layout wrapper to check authentication
function MainLayout() {
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  const [isConnected, setIsConnected] = useState(true);

  // Monitor network status
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected || false);
    });

    return () => unsubscribe();
  }, []);

  const [fontsLoaded] = useFonts({
    'JetBrainsMonoNL-Light': require('../assets/fonts/JetBrainsMonoNL-Light.ttf'),
    'JetBrainsMonoNL-Regular': require('../assets/fonts/JetBrainsMonoNL-Regular.ttf'),
    'JetBrainsMonoNL-Medium': require('../assets/fonts/JetBrainsMonoNL-Medium.ttf'),
    'JetBrainsMonoNL-SemiBold': require('../assets/fonts/JetBrainsMonoNL-SemiBold.ttf'),
    'JetBrainsMonoNL-Thin': require('../assets/fonts/JetBrainsMonoNL-Thin.ttf'),
  });

  // Hide splash screen once everything is loaded
  useEffect(() => {
    if (fontsLoaded && authLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, authLoaded]);

  // Don't render until we have finished loading
  if (!fontsLoaded || !authLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {!isConnected && <OfflineBanner />}

      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}></Stack>
    </GestureHandlerRootView>
  );
}

// Root layout with all providers
export default function RootLayout() {
  return (
    <DatabaseProvider>
      {/* Initialize WatermelonDB or other local DB */}
      <AuthProvider>
        {/* Authentication provider */}
        <SyncProvider>
          {/* Sync service provider */}
          <MainLayout />
        </SyncProvider>
      </AuthProvider>
    </DatabaseProvider>
  );
}
