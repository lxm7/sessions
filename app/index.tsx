import { Redirect } from 'expo-router';
import { useAuth } from '~/lib/auth';

export default function Index() {
  const { isSignedIn, hasCompletedOnboarding } = useAuth();

  // Routing logic
  // if (!isSignedIn) {
  //   // Not logged in - show intro
  //   return <Redirect href="/(public)/intro" />;
  // }

  // // Logged in but hasn't completed onboarding
  // if (!hasCompletedOnboarding) {
  //   return <Redirect href="/(app)/onboarding" />;
  // }

  // Fully authenticated and onboarded - go to main app
  return <Redirect href="/(app)/(drawer)/(tabs)/discover" />;
}
