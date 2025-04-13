import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { View, Text, TextInput, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { z } from 'zod';
import { GoogleIcon, AppleIcon, FacebookIcon } from '../../../components/ui/IconsSocial';
import { useAuth } from '../../../lib/auth';

// Define Zod schema
const signInSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Invalid email format' }),
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .min(6, { message: 'Password must be at least 6 characters' }),
});

type SignInFormData = z.infer<typeof signInSchema>;

export default function SignInScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn, signInWithGoogle } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(signInSchema),
  });

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await signIn(email, password);
      // Navigation is handled by the auth provider
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to log in');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: SignInFormData) => {
    console.log('Sign in submitted with:', data);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Add your authentication logic here
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <View className="mx-auto w-full max-w-[500px] flex-1 items-center justify-center p-4">
      <View className="mb-4 w-full space-y-2">
        <Text className="text-center text-2xl font-bold">Sign In</Text>
        <Text className="text-center text-base text-gray-500">
          Hi! Welcome back, you've been missed
        </Text>
      </View>

      <View className="w-full space-y-4">
        {/* Email field */}
        <View>
          <Text className="mb-2 text-base font-medium">Email</Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className={`h-12 rounded-xl border px-4 ${
                  errors.email ? 'border-red-500' : 'border-gray-400'
                }`}
                placeholder="example@gmail.com"
                placeholderTextColor="#B2B7C2"
                keyboardType="email-address"
                autoCapitalize="none"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
          {errors.email && (
            <Text className="mt-1 text-xs text-red-500">{errors.email.message}</Text>
          )}
        </View>

        {/* Password field */}
        <View>
          <Text className="mb-2 text-base font-medium">Password</Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <View className="relative">
                <TextInput
                  className={`h-12 w-full rounded-xl border px-4 ${
                    errors.password ? 'border-red-500' : 'border-gray-400'
                  }`}
                  placeholder="Enter your password"
                  placeholderTextColor="#B2B7C2"
                  secureTextEntry={!showPassword}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
                <Pressable
                  className="absolute right-3 top-0 h-full justify-center"
                  onPress={togglePasswordVisibility}>
                  <Feather name={showPassword ? 'eye-off' : 'eye'} size={20} color="gray" />
                </Pressable>
              </View>
            )}
          />
          {errors.password && (
            <Text className="mt-1 text-xs text-red-500">{errors.password.message}</Text>
          )}
        </View>

        {/* Forgot password */}
        <View className="items-end">
          <Pressable onPress={() => router.push('/forgot-password')}>
            <Text className="text-sm text-blue-500">Forgot Password?</Text>
          </Pressable>
        </View>

        {/* Sign in button */}
        <Pressable
          className={`mt-2 h-14 items-center justify-center rounded-full ${
            isSubmitting ? 'bg-blue-400' : 'bg-gradient-to-r from-purple-500 to-purple-900'
          }`}
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}>
          <Text className="text-base font-bold text-white">
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </Text>
        </Pressable>

        {/* Social sign in section */}
        <View className="my-4 items-center">
          <View className="w-full flex-row items-center space-x-2 py-4">
            <View className="h-[1px] flex-1 bg-gray-300" />
            <Text className="text-gray-500">Or sign in with</Text>
            <View className="h-[1px] flex-1 bg-gray-300" />
          </View>

          <View className="mt-4 flex-row space-x-6">
            <Pressable
              className="h-[90px] w-[90px] items-center justify-center rounded-full border border-gray-300"
              onPress={() => console.log('Sign in with Apple')}>
              <AppleIcon fill="#000000" showLabel={true} />
            </Pressable>

            <Pressable
              className="h-[90px] w-[90px] items-center justify-center rounded-full border border-gray-300"
              onPress={signInWithGoogle}>
              <GoogleIcon fill="#4285F4" showLabel={true} />
            </Pressable>

            <Pressable
              className="h-[90px] w-[90px] items-center justify-center rounded-full border border-gray-300"
              onPress={() => console.log('Sign in with Facebook')}>
              <FacebookIcon fill="#1877F2" showLabel={true} />
            </Pressable>
          </View>
        </View>

        {/* Sign up link */}
        <View className="flex-row items-center justify-center">
          <Text className="text-gray-600">Don't have an account?</Text>
          {/* <Link href="/(public)/(auth)/signup" asChild>
            <TouchableOpacity>
              <Text className="text-blue-500 font-medium">Sign Up</Text>
            </TouchableOpacity>
          </Link> */}
          <Pressable onPress={() => router.push('/sign-up')}>
            <Text className="ml-1 font-bold text-blue-500">Sign Up</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
