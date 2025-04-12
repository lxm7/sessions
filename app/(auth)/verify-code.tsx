import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, Pressable, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { z } from 'zod';

// Define Zod schema for OTP validation
const otpSchema = z.object({
  code: z
    .string()
    .length(4, { message: 'Please enter the complete 4-digit code' })
    .regex(/^\d+$/, { message: 'Code must contain only numbers' }),
});

interface CodeInputProps {
  value: string;
  index: number;
  focused: boolean;
  onChangeText: (text: string, index: number) => void;
  onFocus: (index: number) => void;
}

const CodeInput = ({ value, index, focused, onChangeText, onFocus }: CodeInputProps) => {
  return (
    <TextInput
      className={`h-16 w-16 rounded-xl border ${
        focused ? 'border-blue-500' : 'border-gray-400'
      } text-center text-xl font-medium`}
      value={value}
      keyboardType="number-pad"
      maxLength={1}
      onChangeText={(text) => onChangeText(text, index)}
      onFocus={() => onFocus(index)}
    />
  );
};

export default function VerifyCodeScreen() {
  const router = useRouter();
  const [code, setCode] = useState<string[]>(['2', '8', '', '']);
  const [focusedIndex, setFocusedIndex] = useState<number>(2);
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(TextInput | null)[]>([null, null, null, null]);

  // Countdown for resend code
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const handleCodeChange = (text: string, index: number) => {
    // Only allow numbers
    if (text && !/^\d+$/.test(text)) return;

    setError(null);
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Auto-advance to next input
    if (text && index < 3) {
      setFocusedIndex(index + 1);
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleResendCode = () => {
    if (resendCooldown > 0) return;

    console.log('Resending code...');
    // Implement resend logic here

    // Set cooldown for 30 seconds
    setResendCooldown(30);
  };

  const validateCode = (): boolean => {
    const fullCode = code.join('');
    try {
      otpSchema.parse({ code: fullCode });
      setError(null);
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0]?.message || 'Invalid code');
      } else {
        setError('An error occurred validating your code');
      }
      return false;
    }
  };

  const handleVerify = async () => {
    if (isVerifying) return;

    if (!validateCode()) return;

    setIsVerifying(true);

    const fullCode = code.join('');
    console.log('Verifying code:', fullCode);

    // Simulate API verification
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate successful verification
      router.push('/new-password');
    } catch (err) {
      setError('Failed to verify code. Please try again.');
    } finally {
      setIsVerifying(false);
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
      <View className="mt-8 items-center">
        <Text className="text-3xl font-bold text-gray-800">Verify Code</Text>
        <Text className="mt-2 text-center text-base text-gray-500">
          Please enter the code we just sent to email
        </Text>
        <Text className="mt-1 text-center text-base text-blue-500">example@email.com</Text>
      </View>

      {/* Code input fields */}
      <View className="mt-8 flex-row justify-center space-x-4">
        {code.map((digit, index) => (
          <CodeInput
            key={index}
            value={digit}
            index={index}
            focused={focusedIndex === index}
            onChangeText={handleCodeChange}
            onFocus={setFocusedIndex}
          />
        ))}
      </View>

      {/* Error message */}
      {error && (
        <View className="mt-2 flex-row items-center justify-center">
          <MaterialIcons name="error-outline" size={16} color="#EF4444" />
          <Text className="ml-1 text-red-500">{error}</Text>
        </View>
      )}

      {/* Resend code */}
      <View className="mt-8 items-center">
        <Text className="text-gray-500">Didn't receive OTP?</Text>
        <Pressable onPress={handleResendCode} disabled={resendCooldown > 0}>
          <Text className={`mt-1 ${resendCooldown > 0 ? 'text-gray-400' : 'text-blue-500'}`}>
            {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend code'}
          </Text>
        </Pressable>
      </View>

      {/* Verify button */}
      <Pressable
        onPress={handleVerify}
        disabled={isVerifying}
        className={`mt-8 h-14 items-center justify-center rounded-full ${
          isVerifying ? 'bg-blue-400' : 'bg-blue-500'
        }`}>
        <Text className="text-lg font-medium text-white">
          {isVerifying ? 'Verifying...' : 'Verify'}
        </Text>
      </Pressable>
    </View>
  );
}
