import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather, FontAwesome, AntDesign, MaterialIcons } from '@expo/vector-icons';
import { z } from 'zod';

// Define Zod schema for account creation
const createAccountSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[A-Z]/, { message: 'Must contain an uppercase letter' })
    .regex(/[0-9]/, { message: 'Must contain a number' }),
  agreeToTerms: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to the terms and conditions' }),
  }),
});

type CreateAccountFormData = z.infer<typeof createAccountSchema>;

export default function CreateAccountScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    agreeToTerms?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleAgreeToTerms = () => {
    setAgreeToTerms(!agreeToTerms);
    if (errors.agreeToTerms) {
      setErrors((prev) => ({ ...prev, agreeToTerms: undefined }));
    }
  };

  const validateForm = (): boolean => {
    try {
      createAccountSchema.parse({
        name,
        email,
        password,
        agreeToTerms,
      });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSignUp = async () => {
    if (!validateForm() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      console.log('Sign up with:', { name, email, password, agreeToTerms });
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Navigate to complete profile on successful sign up
      router.push('/complete-profile');
    } catch (err) {
      setErrors({ email: 'An account with this email already exists.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialSignUp = (provider: string) => {
    console.log(`Sign up with ${provider}`);
    // Implement social sign up logic here
  };

  return (
    <View className="flex-1 p-6">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="mb-6 mt-8 items-center">
        <Text className="text-3xl font-bold text-gray-800">Create Account</Text>
        <Text className="mt-2 text-center text-base text-gray-500">
          Fill your information below or register with your social account.
        </Text>
      </View>

      {/* Form */}
      <View className="space-y-4">
        {/* Name input */}
        <View>
          <Text className="mb-2 text-base font-medium text-gray-700">Name</Text>
          <TextInput
            className={`h-14 w-full rounded-xl border px-4 text-base ${
              errors.name ? 'border-red-500' : 'border-gray-400'
            }`}
            placeholder="John Doe"
            placeholderTextColor="#D1D5DB"
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
            }}
          />
          {errors.name && (
            <View className="mt-1 flex-row items-center">
              <MaterialIcons name="error-outline" size={16} color="#EF4444" />
              <Text className="ml-1 text-xs text-red-500">{errors.name}</Text>
            </View>
          )}
        </View>

        {/* Email input */}
        <View>
          <Text className="mb-2 text-base font-medium text-gray-700">Email</Text>
          <TextInput
            className={`h-14 w-full rounded-xl border px-4 text-base ${
              errors.email ? 'border-red-500' : 'border-gray-400'
            }`}
            placeholder="example@gmail.com"
            placeholderTextColor="#D1D5DB"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
            }}
          />
          {errors.email && (
            <View className="mt-1 flex-row items-center">
              <MaterialIcons name="error-outline" size={16} color="#EF4444" />
              <Text className="ml-1 text-xs text-red-500">{errors.email}</Text>
            </View>
          )}
        </View>

        {/* Password input */}
        <View>
          <Text className="mb-2 text-base font-medium text-gray-700">Password</Text>
          <View className="relative">
            <TextInput
              className={`h-14 w-full rounded-xl border px-4 text-base ${
                errors.password ? 'border-red-500' : 'border-gray-400'
              }`}
              placeholder="••••••••••••••"
              placeholderTextColor="#D1D5DB"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
              }}
            />
            <Pressable
              onPress={togglePasswordVisibility}
              className="absolute right-3 top-0 h-full justify-center">
              <Feather name={showPassword ? 'eye-off' : 'eye'} size={20} color="gray" />
            </Pressable>
          </View>
          {errors.password && (
            <View className="mt-1 flex-row items-center">
              <MaterialIcons name="error-outline" size={16} color="#EF4444" />
              <Text className="ml-1 text-xs text-red-500">{errors.password}</Text>
            </View>
          )}
          {password && !errors.password && (
            <Text className="mt-1 text-xs text-gray-500">
              Strong password! Mix of uppercase, lowercase, and numbers.
            </Text>
          )}
        </View>

        {/* Terms and conditions */}
        <Pressable onPress={toggleAgreeToTerms} className="mt-2 flex-row items-center">
          <View
            className={`h-6 w-6 items-center justify-center rounded ${
              errors.agreeToTerms
                ? 'border border-red-500'
                : agreeToTerms
                  ? 'bg-blue-500'
                  : 'border border-gray-400'
            }`}>
            {agreeToTerms && <AntDesign name="check" size={16} color="white" />}
          </View>
          <Text className="ml-2 text-base text-gray-700">
            Agree with{' '}
            <Text className="text-blue-500" onPress={() => console.log('Terms and conditions')}>
              Terms & Condition
            </Text>
          </Text>
        </Pressable>
        {errors.agreeToTerms && (
          <Text className="ml-8 text-xs text-red-500">{errors.agreeToTerms}</Text>
        )}
      </View>

      {/* Sign up button */}
      <Pressable
        onPress={handleSignUp}
        disabled={isSubmitting}
        className={`mt-8 h-14 items-center justify-center rounded-full ${
          isSubmitting ? 'bg-blue-400' : 'bg-blue-500'
        }`}>
        <Text className="text-lg font-medium text-white">
          {isSubmitting ? 'Creating Account...' : 'Sign Up'}
        </Text>
      </Pressable>

      {/* Social sign up */}
      <View className="mt-8 items-center">
        <View className="w-full flex-row items-center">
          <View className="h-[1px] flex-1 bg-gray-300" />
          <Text className="mx-4 text-gray-500">Or sign up with</Text>
          <View className="h-[1px] flex-1 bg-gray-300" />
        </View>

        <View className="mt-6 flex-row justify-center space-x-6">
          <Pressable
            onPress={() => handleSocialSignUp('Apple')}
            className="h-16 w-16 items-center justify-center rounded-full border border-gray-400">
            <FontAwesome name="apple" size={24} color="black" />
          </Pressable>

          <Pressable
            onPress={() => handleSocialSignUp('Google')}
            className="h-16 w-16 items-center justify-center rounded-full border border-gray-400">
            <AntDesign name="google" size={24} color="#4285F4" />
          </Pressable>

          <Pressable
            onPress={() => handleSocialSignUp('Facebook')}
            className="h-16 w-16 items-center justify-center rounded-full border border-gray-400">
            <FontAwesome name="facebook" size={24} color="#1877F2" />
          </Pressable>
        </View>
      </View>

      {/* Sign in link */}
      <View className="mt-8 flex-row justify-center">
        <Text className="text-gray-600">Already have an account?</Text>
        <Pressable onPress={() => router.push('/sign-in')}>
          <Text className="ml-1 text-blue-500">Sign In</Text>
        </Pressable>
      </View>
    </View>
  );
}
