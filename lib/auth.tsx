import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import { User } from '../models/User';
import { useDatabase } from './database';
import NetInfo from '@react-native-community/netinfo';

// Configure native web browser redirect
WebBrowser.maybeCompleteAuthSession();

// Constants for auth
const AUTH_KEY_PREFIX = 'musichub_auth_';
const ACCESS_TOKEN_KEY = `${AUTH_KEY_PREFIX}access_token`;
const REFRESH_TOKEN_KEY = `${AUTH_KEY_PREFIX}refresh_token`;
const USER_INFO_KEY = `${AUTH_KEY_PREFIX}user_info`;
const AUTH_STATE_KEY = `${AUTH_KEY_PREFIX}auth_state`;
const LAST_LOGIN_KEY = `${AUTH_KEY_PREFIX}last_login`;

// API config
const API_URL = Constants.expoConfig?.extra?.apiUrl || 'https://api.musichub.app';

// Auth types
export type AuthUser = {
  id: string;
  email: string;
  name: string;
  username?: string;
  role: 'musician' | 'venue' | 'fan';
  avatarUrl?: string;
  createdAt: string;
  hasCompletedOnboarding: boolean;
};

type AuthContextType = {
  isSignedIn: boolean;
  isLoaded: boolean;
  user: AuthUser | null;
  hasCompletedOnboarding: boolean;
  isOfflineAuthenticated: boolean;
  lastSyncedAuthAt: Date | null;

  // Auth methods
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  completeOnboarding: () => Promise<void>;

  // Auth utilities
  getAccessToken: () => Promise<string | null>;
};

// Create the context
const AuthContext = createContext<AuthContextType | null>(null);

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const { database } = useDatabase();

  // Auth state
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isOfflineAuthenticated, setIsOfflineAuthenticated] = useState(false);
  const [lastSyncedAuthAt, setLastSyncedAuthAt] = useState<Date | null>(null);

  // Computed property
  const hasCompletedOnboarding = user?.hasCompletedOnboarding || false;

  // Load auth state
  useEffect(() => {
    const loadAuthState = async () => {
      try {
        // Try to load auth state from secure storage
        const storedToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
        const storedUser = await SecureStore.getItemAsync(USER_INFO_KEY);
        const storedRefreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
        const lastLoginTimeStr = await SecureStore.getItemAsync(LAST_LOGIN_KEY);

        // Check for stored credentials
        if (storedToken && storedUser) {
          const userInfo = JSON.parse(storedUser) as AuthUser;

          // Check our network status
          const networkState = await NetInfo.fetch();

          if (networkState.isConnected) {
            // We're online - verify token with server
            try {
              const verifyResult = await validateToken(storedToken);
              if (verifyResult.valid) {
                // Token is valid
                setIsSignedIn(true);
                setUser(userInfo);
                setAccessToken(storedToken);
                setRefreshToken(storedRefreshToken);
                setIsOfflineAuthenticated(false);
                setLastSyncedAuthAt(new Date());
                // Store last successful authentication time
                await SecureStore.setItemAsync(LAST_LOGIN_KEY, new Date().toISOString());
              } else if (storedRefreshToken) {
                // Try to refresh the token
                const newTokens = await refreshAccessToken(storedRefreshToken);
                if (newTokens) {
                  setIsSignedIn(true);
                  setUser(userInfo);
                  setAccessToken(newTokens.accessToken);
                  setRefreshToken(newTokens.refreshToken);
                  setIsOfflineAuthenticated(false);
                  setLastSyncedAuthAt(new Date());
                  // Update stored tokens
                  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, newTokens.accessToken);
                  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, newTokens.refreshToken);
                  await SecureStore.setItemAsync(LAST_LOGIN_KEY, new Date().toISOString());
                } else {
                  // Refresh failed, user needs to login again
                  await clearAuthData();
                }
              } else {
                // Token invalid and no refresh token
                await clearAuthData();
              }
            } catch (error) {
              console.error('Error verifying token:', error);
              // Handle server unreachable but we have stored credentials
              if (lastLoginTimeStr) {
                const lastLoginTime = new Date(lastLoginTimeStr);
                const now = new Date();
                // If last successful login was within the last 30 days, allow offline auth
                const maxOfflineAuthDays = 30;
                const daysSinceLastLogin =
                  (now.getTime() - lastLoginTime.getTime()) / (1000 * 60 * 60 * 24);

                if (daysSinceLastLogin <= maxOfflineAuthDays) {
                  setIsSignedIn(true);
                  setUser(userInfo);
                  setAccessToken(storedToken);
                  setRefreshToken(storedRefreshToken);
                  setIsOfflineAuthenticated(true);
                  setLastSyncedAuthAt(lastLoginTime);
                } else {
                  // Offline auth expired
                  await clearAuthData();
                }
              } else {
                await clearAuthData();
              }
            }
          } else {
            // We're offline - check when we last authenticated successfully
            if (lastLoginTimeStr) {
              const lastLoginTime = new Date(lastLoginTimeStr);
              const now = new Date();
              // If last successful login was within the last 30 days, allow offline auth
              const maxOfflineAuthDays = 30;
              const daysSinceLastLogin =
                (now.getTime() - lastLoginTime.getTime()) / (1000 * 60 * 60 * 24);

              if (daysSinceLastLogin <= maxOfflineAuthDays) {
                setIsSignedIn(true);
                setUser(userInfo);
                setAccessToken(storedToken);
                setRefreshToken(storedRefreshToken);
                setIsOfflineAuthenticated(true);
                setLastSyncedAuthAt(lastLoginTime);
              } else {
                // Offline auth expired
                await clearAuthData();
              }
            } else {
              // No last login time recorded
              await clearAuthData();
            }
          }
        } else {
          // No stored credentials
          await clearAuthData();
        }
      } catch (error) {
        console.error('Failed to load auth state:', error);
        await clearAuthData();
      } finally {
        setIsLoaded(true);
      }
    };

    loadAuthState();
  }, []);

  // Clear all auth data
  const clearAuthData = async () => {
    try {
      await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_INFO_KEY);
      await SecureStore.deleteItemAsync(AUTH_STATE_KEY);
      // Don't clear LAST_LOGIN_KEY to remember last successful login

      setIsSignedIn(false);
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      setIsOfflineAuthenticated(false);
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  };

  // Get access token (for API calls)
  const getAccessToken = async (): Promise<string | null> => {
    // First check our state
    if (accessToken) {
      return accessToken;
    }

    // Try to get from storage
    try {
      const storedToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
      if (storedToken) {
        setAccessToken(storedToken);
        return storedToken;
      }
    } catch (error) {
      console.error('Error retrieving access token:', error);
    }

    return null;
  };

  // Validate token with server
  const validateToken = async (token: string): Promise<{ valid: boolean }> => {
    try {
      const response = await fetch(`${API_URL}/auth/validate`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return { valid: response.ok };
    } catch (error) {
      console.error('Token validation error:', error);
      throw error;
    }
  };

  // Refresh access token
  const refreshAccessToken = async (
    token: string
  ): Promise<{ accessToken: string; refreshToken: string } | null> => {
    try {
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: token }),
      });

      if (response.ok) {
        const data = await response.json();
        return {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        };
      }

      return null;
    } catch (error) {
      console.error('Token refresh error:', error);
      return null;
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string): Promise<void> => {
    // First check if we're online
    const networkState = await NetInfo.fetch();

    if (!networkState.isConnected) {
      // We're offline - try to authenticate with stored credentials
      try {
        const storedUser = await SecureStore.getItemAsync(USER_INFO_KEY);
        if (storedUser) {
          const userInfo = JSON.parse(storedUser) as AuthUser;

          // If the email matches, we'll perform offline authentication
          // In a real app, you'd want to verify the password hash locally
          // This is a simplified example
          if (userInfo.email === email) {
            // Here you would verify the password against a locally stored hash
            // For demo purposes, we're skipping actual password verification

            const storedToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
            const storedRefreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
            const lastLoginTimeStr = await SecureStore.getItemAsync(LAST_LOGIN_KEY);

            if (storedToken && lastLoginTimeStr) {
              const lastLoginTime = new Date(lastLoginTimeStr);
              const now = new Date();
              // If last successful login was within the last 30 days, allow offline auth
              const maxOfflineAuthDays = 30;
              const daysSinceLastLogin =
                (now.getTime() - lastLoginTime.getTime()) / (1000 * 60 * 60 * 24);

              if (daysSinceLastLogin <= maxOfflineAuthDays) {
                setIsSignedIn(true);
                setUser(userInfo);
                setAccessToken(storedToken);
                setRefreshToken(storedRefreshToken);
                setIsOfflineAuthenticated(true);
                setLastSyncedAuthAt(lastLoginTime);
                return;
              }
            }
          }
        }

        throw new Error('Cannot sign in while offline');
      } catch (error) {
        throw new Error('Cannot sign in while offline');
      }
    }

    // We're online - authenticate with server
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Invalid email or password');
      }

      const data = await response.json();

      // Save auth data
      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, data.accessToken);
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, data.refreshToken);
      await SecureStore.setItemAsync(USER_INFO_KEY, JSON.stringify(data.user));
      await SecureStore.setItemAsync(LAST_LOGIN_KEY, new Date().toISOString());

      // Update state
      setIsSignedIn(true);
      setUser(data.user);
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      setIsOfflineAuthenticated(false);
      setLastSyncedAuthAt(new Date());
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, name: string): Promise<void> => {
    // Check if we're online
    const networkState = await NetInfo.fetch();
    if (!networkState.isConnected) {
      throw new Error('Internet connection required for signup');
    }

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();

      // Save auth data
      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, data.accessToken);
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, data.refreshToken);
      await SecureStore.setItemAsync(USER_INFO_KEY, JSON.stringify(data.user));
      await SecureStore.setItemAsync(LAST_LOGIN_KEY, new Date().toISOString());

      // Update state
      setIsSignedIn(true);
      setUser(data.user);
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      setIsOfflineAuthenticated(false);
      setLastSyncedAuthAt(new Date());
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  // Sign in with Google
  const signInWithGoogle = async (): Promise<void> => {
    try {
      const networkState = await NetInfo.fetch();
      if (!networkState.isConnected) {
        throw new Error('Internet connection required for Google Sign-In');
      }

      // Configure Expo OAuth request
      const redirectUri = AuthSession.makeRedirectUri({
        preferLocalhost: true,
        scheme: 'musichub',
      });

      // Google OAuth credentials
      const clientId = Platform.select({
        ios: Constants.expoConfig?.extra?.googleIosClientId || '',
        android: Constants.expoConfig?.extra?.googleAndroidClientId || '',
        web: Constants.expoConfig?.extra?.googleWebClientId || '',
      }) as string;

      // Configure Expo auth request
      const discovery = {
        authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
        tokenEndpoint: 'https://oauth2.googleapis.com/token',
      };

      const authRequest = new AuthSession.AuthRequest({
        clientId,
        scopes: ['openid', 'profile', 'email'],
        redirectUri,
      });

      // Start the auth flow
      const result = await authRequest.promptAsync(discovery);

      if (result.type === 'success') {
        // Exchange the authorization code for access token with your server
        const exchangeResponse = await fetch(`${API_URL}/auth/google`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code: result.params.code,
            redirectUri,
          }),
        });

        if (!exchangeResponse.ok) {
          throw new Error('Failed to authenticate with Google');
        }

        const authData = await exchangeResponse.json();

        // Save auth data
        await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, authData.accessToken);
        await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, authData.refreshToken);
        await SecureStore.setItemAsync(USER_INFO_KEY, JSON.stringify(authData.user));
        await SecureStore.setItemAsync(LAST_LOGIN_KEY, new Date().toISOString());

        // Update state
        setIsSignedIn(true);
        setUser(authData.user);
        setAccessToken(authData.accessToken);
        setRefreshToken(authData.refreshToken);
        setIsOfflineAuthenticated(false);
        setLastSyncedAuthAt(new Date());
      } else if (result.type === 'error') {
        throw new Error(result.error?.message || 'Google sign in failed');
      }
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  };

  // Sign in with Apple
  const signInWithApple = async (): Promise<void> => {
    try {
      const networkState = await NetInfo.fetch();
      if (!networkState.isConnected) {
        throw new Error('Internet connection required for Apple Sign-In');
      }

      // Configure Expo OAuth request
      const redirectUri = AuthSession.makeRedirectUri({
        preferLocalhost: true,
        scheme: 'musichub',
      });

      // Configure Apple provider
      const clientId = Constants.expoConfig?.extra?.appleClientId || '';

      // Start the auth flow
      const result = await AuthSession.startAsync({
        authUrl: `https://appleid.apple.com/auth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code id_token&scope=name email&response_mode=form_post`,
      });

      if (result.type === 'success') {
        // Exchange the authorization code for access token with your server
        const exchangeResponse = await fetch(`${API_URL}/auth/apple`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code: result.params.code,
            id_token: result.params.id_token,
            redirectUri,
          }),
        });

        if (!exchangeResponse.ok) {
          throw new Error('Failed to authenticate with Apple');
        }

        const authData = await exchangeResponse.json();

        // Save auth data
        await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, authData.accessToken);
        await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, authData.refreshToken);
        await SecureStore.setItemAsync(USER_INFO_KEY, JSON.stringify(authData.user));
        await SecureStore.setItemAsync(LAST_LOGIN_KEY, new Date().toISOString());

        // Update state
        setIsSignedIn(true);
        setUser(authData.user);
        setAccessToken(authData.accessToken);
        setRefreshToken(authData.refreshToken);
        setIsOfflineAuthenticated(false);
        setLastSyncedAuthAt(new Date());
      } else if (result.type === 'error') {
        throw new Error(result.error?.message || 'Apple sign in failed');
      }
    } catch (error) {
      console.error('Apple sign in error:', error);
      throw error;
    }
  };

  // Sign out
  const signOut = async (): Promise<void> => {
    try {
      // Call server to invalidate token (if online)
      const token = await getAccessToken();
      const networkState = await NetInfo.fetch();

      if (networkState.isConnected && token) {
        try {
          await fetch(`${API_URL}/auth/logout`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } catch (error) {
          // If server is unreachable, continue with local sign out
          console.warn('Could not contact server for logout:', error);
        }
      }

      // Clear local auth data
      await clearAuthData();

      // Redirect to login
      router.replace('/(public)/intro');
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  // Reset password
  const resetPassword = async (email: string): Promise<void> => {
    try {
      const networkState = await NetInfo.fetch();
      if (!networkState.isConnected) {
        throw new Error('Internet connection required to reset password');
      }

      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  };

  // Complete onboarding
  const completeOnboarding = async (): Promise<void> => {
    try {
      // Get current user and token
      if (!user || !accessToken) {
        throw new Error('Not authenticated');
      }

      // First update local state
      const updatedUser: AuthUser = {
        ...user,
        hasCompletedOnboarding: true,
      };

      // Update stored user
      await SecureStore.setItemAsync(USER_INFO_KEY, JSON.stringify(updatedUser));

      // Update state
      setUser(updatedUser);

      // Try to update server if online
      const networkState = await NetInfo.fetch();
      if (networkState.isConnected) {
        await fetch(`${API_URL}/users/complete-onboarding`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
      }

      // Navigate to main app
      router.replace('/(app)/(drawer)/(tabs)/discover');
    } catch (error) {
      console.error('Complete onboarding error:', error);
      throw error;
    }
  };

  // Provide the auth context to children
  return (
    <AuthContext.Provider
      value={{
        isSignedIn,
        isLoaded,
        user,
        hasCompletedOnboarding,
        isOfflineAuthenticated,
        lastSyncedAuthAt,
        signIn,
        signUp,
        signInWithGoogle,
        signInWithApple,
        signOut,
        resetPassword,
        completeOnboarding,
        getAccessToken,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
