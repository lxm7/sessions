import { useState } from 'react';
import { View, Text, Image, ScrollView, Pressable, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';

// venue pics
// "venues": {
//     "Concert Hall": [
//       "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14",
//       "https://images.unsplash.com/photo-1514525253161-7a46d19cd819"
//     ],
//     "Stadium": [
//       "https://images.unsplash.com/photo-1523580494863-6f3031224c94",
//       "https://images.unsplash.com/photo-1513106580091-1d82408b8cd6"
//     ],
//     "Night Club": [
//       "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7",
//       "https://images.unsplash.com/photo-1514525253161-7a46d19cd819"
//     ],
//     "Outdoor Festival": [
//       "https://images.unsplash.com/photo-1470225620780-dba8ba36b745",
//       "https://images.unsplash.com/photo-1514525253161-7a46d19cd819"
//     ]
//   }

export default function VenueScreen() {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = () => setIsFavorite(!isFavorite);

  return (
    <ScrollView className="flex-1 bg-white">
      <StatusBar barStyle="light-content" />

      {/* venue Image */}
      <View className="relative h-64 w-full">
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819' }}
          className="h-full w-full"
          resizeMode="cover"
        />

        {/* Top buttons */}
        <View className="absolute left-4 right-4 top-12 flex-row justify-between">
          <Pressable
            onPress={() => router.back()}
            className="h-12 w-12 items-center justify-center rounded-full bg-white shadow-md">
            <Feather name="arrow-left" size={22} color="#333" />
          </Pressable>

          <View className="flex-row space-x-3">
            <Pressable
              className="h-12 w-12 items-center justify-center rounded-full bg-white shadow-md"
              onPress={() => console.log('Share')}>
              <Feather name="share-2" size={22} color="#333" />
            </Pressable>

            <Pressable
              className="h-12 w-12 items-center justify-center rounded-full bg-white shadow-md"
              onPress={toggleFavorite}>
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={22}
                color={isFavorite ? '#FF3B30' : '#333'}
              />
            </Pressable>
          </View>
        </View>

        {/* Rating badge */}
        <View className="absolute bottom-4 left-4 flex-row items-center rounded-full bg-blue-500 px-4 py-2">
          <Ionicons name="star" size={18} color="white" />
          <Text className="ml-1 font-medium text-white">4.8 (1k+ Review)</Text>
        </View>
      </View>

      {/* venue Info */}
      <View className="p-4">
        <Text className="text-2xl font-bold text-gray-800">Serenity Wellness venue</Text>
        <Text className="mt-1 text-base text-gray-500">Dental, Skin Care, Eye Care</Text>

        <View className="mt-4 flex-row items-center">
          <Ionicons name="location" size={20} color="#007AFF" />
          <Text className="ml-2 text-gray-600">8502 Preston Rd. Inglewood, Maine 98380</Text>
        </View>

        <View className="mt-2 flex-row items-center">
          <Ionicons name="time-outline" size={20} color="#007AFF" />
          <Text className="ml-2 text-gray-600">15 min • 1.5km • Mon-Sun | 11 am - 11pm</Text>
        </View>

        {/* Action buttons */}
        <View className="mt-6 flex-row justify-between">
          <Pressable className="items-center" onPress={() => console.log('Website')}>
            <View className="mb-1 h-14 w-14 items-center justify-center rounded-full bg-blue-100">
              <Feather name="globe" size={22} color="#007AFF" />
            </View>
            <Text className="text-gray-700">Website</Text>
          </Pressable>

          <Pressable className="items-center" onPress={() => console.log('Message')}>
            <View className="mb-1 h-14 w-14 items-center justify-center rounded-full bg-blue-100">
              <Feather name="message-circle" size={22} color="#007AFF" />
            </View>
            <Text className="text-gray-700">Message</Text>
          </Pressable>

          <Pressable className="items-center" onPress={() => console.log('Call')}>
            <View className="mb-1 h-14 w-14 items-center justify-center rounded-full bg-blue-100">
              <Feather name="phone" size={22} color="#007AFF" />
            </View>
            <Text className="text-gray-700">Call</Text>
          </Pressable>

          <Pressable className="items-center" onPress={() => console.log('Direction')}>
            <View className="mb-1 h-14 w-14 items-center justify-center rounded-full bg-blue-100">
              <Feather name="map-pin" size={22} color="#007AFF" />
            </View>
            <Text className="text-gray-700">Direction</Text>
          </Pressable>

          <Pressable className="items-center" onPress={() => console.log('Share')}>
            <View className="mb-1 h-14 w-14 items-center justify-center rounded-full bg-blue-100">
              <Feather name="share" size={22} color="#007AFF" />
            </View>
            <Text className="text-gray-700">Share</Text>
          </Pressable>
        </View>

        {/* Tabs */}
        <View className="mt-6 flex-row border-b border-gray-200">
          <Pressable className="mr-8 pb-2">
            <Text className="font-medium text-gray-500">Treatments</Text>
          </Pressable>

          <Pressable className="mr-8 pb-2">
            <Text className="font-medium text-gray-500">Specialist</Text>
          </Pressable>

          <Pressable className="mr-8 border-b-2 border-blue-500 pb-2">
            <Text className="font-medium text-blue-500">Gallery</Text>
          </Pressable>

          <Pressable className="pb-2">
            <Text className="font-medium text-gray-500">Review</Text>
          </Pressable>
        </View>

        {/* Gallery */}
        <View className="mt-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-gray-800">Gallery (400)</Text>
            <Pressable className="flex-row items-center" onPress={() => console.log('Add photo')}>
              <Ionicons name="camera-outline" size={20} color="#007AFF" />
              <Text className="ml-1 text-blue-500">add photo</Text>
            </Pressable>
          </View>

          <View className="mt-4 flex-row flex-wrap justify-between">
            {[1, 2, 3, 4].map((item) => (
              <Pressable
                key={item}
                className="mb-2 overflow-hidden rounded-lg"
                style={{ width: '49%', height: 120 }}
                onPress={() => console.log(`View photo ${item}`)}>
                <Image
                  source={{
                    uri: `https://images.unsplash.com/photo-1540039155733-5bb30b53aa14`,
                  }}
                  className="h-full w-full"
                  resizeMode="cover"
                />
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      {/* Book Appointment Button */}
      <View className="p-4 pb-8">
        <Pressable
          className="h-14 items-center justify-center rounded-full bg-blue-500"
          onPress={() => router.push('/book-appointment')}>
          <Text className="text-lg font-bold text-white">Book Appointment</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
