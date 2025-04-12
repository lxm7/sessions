import { useState } from 'react';
import { View, Text, TextInput, Pressable, StatusBar, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { AntDesign, Feather, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { z } from 'zod';

// Define Zod schema for form validation
const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phoneNumber: z
    .string()
    .min(6, 'Phone number is too short')
    .regex(/^\d+$/, 'Phone number can only contain digits'),
  gender: z
    .enum(['Male', 'Female', 'Non-binary', 'Prefer not to say'], {
      errorMap: () => ({ message: 'Please select a gender' }),
    })
    .optional(),
  profileImage: z.string().nullable(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

// This is a simplified version - you might want to use a proper country code picker library
const CountryCodeSelector = ({
  countryCode,
  onPress,
}: {
  countryCode: string;
  onPress: () => void;
}) => (
  <Pressable onPress={onPress} className="flex-row items-center border-r border-gray-400 pr-2">
    <Text className="text-base">{countryCode}</Text>
    <MaterialIcons name="keyboard-arrow-down" size={20} color="gray" />
  </Pressable>
);

export default function CompleteProfileScreen() {
  const router = useRouter();
  const [name, setName] = useState('John Doe');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [gender, setGender] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Form errors
  const [errors, setErrors] = useState<{
    name?: string;
    phoneNumber?: string;
    gender?: string;
  }>({});

  const handleSelectCountryCode = () => {
    console.log('Open country code selector');
    // Implement country code selection logic
  };

  const handleSelectGender = () => {
    // Simulating a gender selection dropdown
    const options = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];
    // In a real app, you'd show a modal or picker
    setGender('Male'); // For demonstration
    setErrors((prev) => ({ ...prev, gender: undefined }));
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const validateForm = (): boolean => {
    try {
      profileSchema.parse({
        name,
        phoneNumber,
        gender: gender || undefined,
        profileImage,
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

  const handleCompleteProfile = () => {
    if (validateForm()) {
      console.log('Profile completed:', {
        name,
        phoneNumber: `${countryCode}${phoneNumber}`,
        gender,
        profileImage,
      });
      // Implement profile completion logic here

      // Navigate to home or dashboard
      router.push('/dashboard');
    } else {
      console.log('Validation failed', errors);
    }
  };

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
      <View className="mt-6">
        <Text className="text-3xl font-bold text-gray-800">Complete Your Profile</Text>
        <Text className="mt-2 text-base text-gray-500">
          Don't worry, only you can see your personal data. No one else will be able to see it.
        </Text>
      </View>

      {/* Profile picture */}
      <View className="mt-8 items-center">
        <View className="relative">
          <View className="h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-gray-200">
            {profileImage ? (
              <Image source={{ uri: profileImage }} className="h-full w-full" resizeMode="cover" />
            ) : (
              <Feather name="user" size={48} color="gray" />
            )}
          </View>
          <Pressable
            onPress={handlePickImage}
            className="absolute bottom-0 right-0 h-8 w-8 items-center justify-center rounded-full bg-blue-500">
            <Feather name="edit-2" size={16} color="white" />
          </Pressable>
        </View>
      </View>

      {/* Form */}
      <View className="mt-8 space-y-4">
        {/* Name input */}
        <View>
          <Text className="mb-2 text-base font-medium text-gray-700">Name</Text>
          <TextInput
            className={`h-14 w-full rounded-xl border px-4 text-base ${
              errors.name ? 'border-red-500' : 'border-gray-400'
            }`}
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (errors.name) {
                setErrors((prev) => ({ ...prev, name: undefined }));
              }
            }}
          />
          {errors.name && (
            <View className="mt-1 flex-row items-center">
              <MaterialIcons name="error-outline" size={16} color="#EF4444" />
              <Text className="ml-1 text-red-500">{errors.name}</Text>
            </View>
          )}
        </View>

        {/* Phone Number input */}
        <View>
          <Text className="mb-2 text-base font-medium text-gray-700">Phone Number</Text>
          <View
            className={`h-14 w-full flex-row items-center rounded-xl border px-2 ${
              errors.phoneNumber ? 'border-red-500' : 'border-gray-400'
            }`}>
            <CountryCodeSelector countryCode={countryCode} onPress={handleSelectCountryCode} />
            <TextInput
              className="flex-1 px-2 text-base"
              placeholder="Enter Phone Number"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={(text) => {
                setPhoneNumber(text);
                if (errors.phoneNumber) {
                  setErrors((prev) => ({ ...prev, phoneNumber: undefined }));
                }
              }}
            />
          </View>
          {errors.phoneNumber && (
            <View className="mt-1 flex-row items-center">
              <MaterialIcons name="error-outline" size={16} color="#EF4444" />
              <Text className="ml-1 text-red-500">{errors.phoneNumber}</Text>
            </View>
          )}
        </View>

        {/* Gender selector */}
        <View>
          <Text className="mb-2 text-base font-medium text-gray-700">Gender</Text>
          <Pressable
            onPress={handleSelectGender}
            className={`h-14 w-full flex-row items-center justify-between rounded-xl border px-4 ${
              errors.gender ? 'border-red-500' : 'border-gray-400'
            }`}>
            <Text className={gender ? 'text-black' : 'text-gray-400'}>{gender || 'Select'}</Text>
            <MaterialIcons name="keyboard-arrow-down" size={24} color="gray" />
          </Pressable>
          {errors.gender && (
            <View className="mt-1 flex-row items-center">
              <MaterialIcons name="error-outline" size={16} color="#EF4444" />
              <Text className="ml-1 text-red-500">{errors.gender}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Complete profile button */}
      <Pressable
        onPress={handleCompleteProfile}
        className="mt-8 h-14 items-center justify-center rounded-full bg-blue-500">
        <Text className="text-lg font-medium text-white">Complete Profile</Text>
      </Pressable>
    </View>
  );
}
