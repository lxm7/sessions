import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { AntDesign, Feather, MaterialIcons } from '@expo/vector-icons';
import { z } from 'zod';

// Define Zod schema for password validation
const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' })
      .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
      .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
      .regex(/[0-9]/, { message: 'Password must contain at least one number' })
      .regex(/[^A-Za-z0-9]/, { message: 'Password must contain at least one special character' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

interface PasswordInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  isVisible: boolean;
  toggleVisibility: () => void;
  error?: string;
}

const PasswordInput = ({
  label,
  value,
  onChangeText,
  isVisible,
  toggleVisibility,
  error,
}: PasswordInputProps) => {
  return (
    <View className="mb-6">
      <Text className="mb-2 text-lg text-gray-700">{label}</Text>
      <View className="relative">
        <TextInput
          className={`h-14 w-full rounded-xl border px-4 text-base ${
            error ? 'border-red-500' : 'border-gray-400'
          }`}
          secureTextEntry={!isVisible}
          value={value}
          onChangeText={onChangeText}
        />
        <Pressable
          onPress={toggleVisibility}
          className="absolute right-3 top-0 h-full justify-center">
          <Feather name={isVisible ? 'eye-off' : 'eye'} size={20} color="gray" />
        </Pressable>
      </View>
      {error && (
        <View className="mt-1 flex-row items-center">
          <MaterialIcons name="error-outline" size={16} color="#EF4444" />
          <Text className="ml-1 text-xs text-red-500">{error}</Text>
        </View>
      )}
    </View>
  );
};

export default function NewPasswordScreen() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const validateForm = (): boolean => {
    try {
      passwordSchema.parse({ password, confirmPassword });
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

  const handleCreatePassword = async () => {
    if (!validateForm() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      console.log('Creating new password:', password);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Navigate to next screen on success
      router.push('/sign-in');
    } catch (err) {
      setErrors({ password: 'Failed to update password. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Password strength indicator
  const getPasswordStrength = () => {
    if (!password) return { color: 'bg-gray-300', text: '' };

    const hasLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    const strength = [hasLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;

    if (strength <= 2) return { color: 'bg-red-500', text: 'Weak' };
    if (strength <= 4) return { color: 'bg-yellow-500', text: 'Medium' };
    return { color: 'bg-green-500', text: 'Strong' };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <View className="flex-1 bg-white p-6">
      <StatusBar barStyle="dark-content" />

      {/* Back button */}
      <Pressable
        onPress={() => router.back()}
        className="h-12 w-12 items-center justify-center rounded-full bg-gray-100">
        <AntDesign name="arrowleft" size={20} color="#333" />
      </Pressable>

      {/* Header */}
      <View className="mt-8">
        <Text className="text-3xl font-bold text-gray-800">New Password</Text>
        <Text className="mt-2 text-base text-gray-500">
          Your new password must be different from previously used passwords.
        </Text>
      </View>

      {/* Password inputs */}
      <View className="mt-8">
        <PasswordInput
          label="Password"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
          }}
          isVisible={passwordVisible}
          toggleVisibility={togglePasswordVisibility}
          error={errors.password}
        />

        {/* Password strength indicator */}
        {password && (
          <View className="mb-6">
            <View className="mb-1 flex-row items-center">
              <View className={`h-2 flex-1 rounded-full ${passwordStrength.color}`} />
              <Text className="ml-2 text-xs">{passwordStrength.text}</Text>
            </View>
            <Text className="text-xs text-gray-500">
              Use 8+ characters with a mix of letters, numbers & symbols
            </Text>
          </View>
        )}

        <PasswordInput
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            if (errors.confirmPassword)
              setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
          }}
          isVisible={confirmPasswordVisible}
          toggleVisibility={toggleConfirmPasswordVisibility}
          error={errors.confirmPassword}
        />
      </View>

      {/* Create password button */}
      <Pressable
        onPress={handleCreatePassword}
        disabled={isSubmitting}
        className={`mt-8 h-14 items-center justify-center rounded-full ${
          isSubmitting ? 'bg-blue-400' : 'bg-gradient-to-r from-purple-500 to-purple-900'
        }`}>
        <Text className="text-lg font-medium text-white">
          {isSubmitting ? 'Creating Password...' : 'Create New Password'}
        </Text>
      </Pressable>
    </View>
  );
}
