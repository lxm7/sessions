import { View, Text, Image, StatusBar, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Dummy illustration URL - replace with your actual asset or URL
const illustrationUrl = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4';

const OnboardingScreen = () => {
  // State for pagination dots would go here if dynamic
  const activeDot = 0;
  const totalDots = 3;

  return (
    <View className="flex-1 bg-white pt-10">
      <StatusBar barStyle="dark-content" />
      <View className="flex-row justify-end px-4">
        <Pressable>
          <Text className="text-base text-blue-500">Skip</Text>
        </Pressable>
      </View>

      <View className="flex-1 items-center justify-center px-6">
        {/* Replace with your actual illustration */}
        <Image
          source={{ uri: illustrationUrl }}
          className="mb-10 h-60 w-full"
          resizeMode="contain"
        />
        <Text className="mb-2 text-center text-2xl font-bold">
          Effortless{' '}
          <Text className="text-blue-500">musician, event, equipment and ticket finder</Text>
        </Text>
        <Text className="px-4 text-center text-base text-gray-500">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
        </Text>
      </View>

      <View className="mb-4 flex-row items-center justify-between p-6">
        <Pressable className="rounded-full border border-blue-500 p-3">
          <Ionicons name="arrow-back" size={24} color="#a855f7" />
        </Pressable>

        <View className="flex-row">
          {Array.from({ length: totalDots }).map((_, index) => (
            <View
              key={index}
              className={`mx-1 h-2 w-2 rounded-full ${
                index === activeDot
                  ? 'bg-gradient-to-r from-purple-500 to-purple-900'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </View>

        <Pressable className="rounded-full bg-gradient-to-r from-purple-500 to-purple-900 p-3">
          <Ionicons name="arrow-forward" size={24} color="white" />
        </Pressable>
      </View>
    </View>
  );
};

export default OnboardingScreen;
