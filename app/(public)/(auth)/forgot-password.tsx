import { useState } from 'react';
import { View, Text, TextInput, Pressable, StatusBar, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { z } from 'zod';

// Define Zod schema for email validation
const emailSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Invalid email address' }),
});

type EmailFormData = z.infer<typeof emailSchema>;

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async () => {
    try {
      // Reset states
      setError(null);
      setIsSubmitting(true);

      // Validate email with Zod
      emailSchema.parse({ email });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Show success state
      setIsSuccess(true);
      setIsSubmitting(false);
    } catch (err) {
      setIsSubmitting(false);

      if (err instanceof z.ZodError) {
        // Handle Zod validation errors
        setError(err.errors[0]?.message || 'Invalid email format');
      } else {
        // Handle other errors
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <View className="flex-1 p-6">
      <StatusBar barStyle="dark-content" />

      {/* Back button */}
      <Pressable
        onPress={() => router.back()}
        className="h-12 w-12 items-center justify-center rounded-full bg-gray-100">
        <AntDesign name="arrowleft" size={20} color="#333" />
      </Pressable>

      {/* Header */}
      <View className="mt-8">
        <Text className="text-3xl font-bold text-gray-800">Forgot Password</Text>
        <Text className="mt-2 text-base text-gray-500">
          Enter your email address below and we'll send you a link to reset your password.
        </Text>
      </View>

      {/* Form */}
      {!isSuccess ? (
        <View className="mt-8">
          <Text className="mb-2 text-base font-medium text-gray-700">Email</Text>
          <TextInput
            className={`h-14 w-full rounded-xl border px-4 text-base ${
              error ? 'border-red-500' : 'border-gray-400'
            }`}
            placeholder="example@gmail.com"
            placeholderTextColor="#B2B7C2"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setError(null); // Clear error when typing
            }}
          />
          {error && (
            <View className="mt-1 flex-row items-center">
              <MaterialIcons name="error-outline" size={16} color="#EF4444" />
              <Text className="ml-1 text-red-500">{error}</Text>
            </View>
          )}

          {/* Submit button */}
          <Pressable
            onPress={handleSubmit}
            disabled={isSubmitting}
            className={`mt-8 h-14 items-center justify-center rounded-full ${
              isSubmitting ? 'bg-blue-400' : 'bg-gradient-to-r from-purple-500 to-purple-900'
            }`}>
            {isSubmitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-lg font-medium text-white">Send Reset Link</Text>
            )}
          </Pressable>
        </View>
      ) : (
        // Success state
        <View className="mt-8 items-center">
          <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <AntDesign name="checkcircleo" size={32} color="#10B981" />
          </View>

          <Text className="mb-2 text-center text-xl font-medium">Reset Link Sent</Text>

          <Text className="text-center text-base text-gray-500">
            If an account exists with {email}, we've sent a password reset link. Please check your
            inbox and follow the instructions to reset your password.
          </Text>

          <Text className="mt-6 text-center text-base text-gray-500">
            Didn't receive the email?
          </Text>

          <Pressable
            onPress={() => {
              setIsSuccess(false);
              handleSubmit();
            }}
            className="mt-2">
            <Text className="font-medium text-blue-500">Resend Link</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push('/sign-in')}
            className="mt-8 h-14 w-full items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-purple-900">
            <Text className="text-lg font-medium text-white">Back to Sign In</Text>
          </Pressable>
        </View>
      )}

      {/* Additional help */}
      {!isSuccess && (
        <View className="mt-8 items-center">
          <Text className="text-gray-500">Remember your password?</Text>
          <Pressable onPress={() => router.push('/sign-in')}>
            <Text className="mt-1 font-medium text-blue-500">Sign In</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
