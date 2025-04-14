import { Stack, Redirect } from 'expo-router';
import { useAuth } from '~/lib/auth';

export default function AppLayout() {
  // const { isSignedIn, isLoaded } = useAuth();

  // // Wait for auth to load before redirecting
  // if (!isLoaded) return null;

  // // If not signed in, redirect to public section
  // if (!isSignedIn) {
  //   return <Redirect href="/(public)/intro" />;
  // }

  return <Stack screenOptions={{ headerShown: false }} />;
}
