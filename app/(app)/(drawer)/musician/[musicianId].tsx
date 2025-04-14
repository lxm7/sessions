import React, { useState } from 'react';
import { View, Text, Image, ScrollView, Pressable, StatusBar } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';

export default function musicianDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="border-b border-gray-100 px-4 pb-4 pt-4">
        <View className="flex-row items-center justify-between">
          <Pressable
            className="h-10 w-10 items-center justify-center rounded-full bg-gray-100"
            onPress={() => router.back()}>
            <Feather name="arrow-left" size={20} color="#333" />
          </Pressable>

          <Text className="text-xl font-bold">musician Details</Text>

          <View className="flex-row">
            <Pressable
              className="mr-2 h-10 w-10 items-center justify-center rounded-full bg-gray-100"
              onPress={() => console.log('Share musician')}>
              <Feather name="share-2" size={20} color="#333" />
            </Pressable>

            <Pressable
              className="h-10 w-10 items-center justify-center rounded-full bg-gray-100"
              onPress={toggleFavorite}>
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={20}
                color={isFavorite ? '#FF3B30' : '#333'}
              />
            </Pressable>
          </View>
        </View>

        {/* musician info */}
        <View className="mt-6 flex-row">
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
            className="h-20 w-20 rounded-full"
          />

          <View className="ml-4 flex-1">
            <View className="flex-row items-center">
              <Text className="text-xl font-bold text-gray-800">Jonny Wilson</Text>
              <View className="ml-2 h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-purple-900">
                <Feather name="check" size={14} color="white" />
              </View>
            </View>

            <Text className="mt-1 text-gray-500">Guitarist</Text>

            <View className="mt-2 flex-row items-center">
              <Ionicons name="location-outline" size={16} color="#a855f7" />
              <Text className="ml-1 text-gray-600">New York, United States</Text>
              <Pressable className="ml-2" onPress={() => router.push('/map')}>
                <Ionicons name="map-outline" size={16} color="#a855f7" />
              </Pressable>
            </View>
          </View>
        </View>
      </View>

      {/* Stats */}
      <View className="flex-row justify-between border-b border-gray-100 px-4 py-5">
        <View className="items-center">
          <View className="mb-1 h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Ionicons name="people-outline" size={20} color="#a855f7" />
          </View>
          <Text className="text-lg font-bold text-gray-800">7,500+</Text>
          <Text className="text-sm text-gray-500">Patients</Text>
        </View>

        <View className="items-center">
          <View className="mb-1 h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Ionicons name="briefcase-outline" size={20} color="#a855f7" />
          </View>
          <Text className="text-lg font-bold text-gray-800">10+</Text>
          <Text className="text-sm text-gray-500">Years Exp.</Text>
        </View>

        <View className="items-center">
          <View className="mb-1 h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Ionicons name="star-outline" size={20} color="#a855f7" />
          </View>
          <Text className="text-lg font-bold text-gray-800">4.9+</Text>
          <Text className="text-sm text-gray-500">Rating</Text>
        </View>

        <View className="items-center">
          <View className="mb-1 h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Ionicons name="chatbubble-outline" size={20} color="#a855f7" />
          </View>
          <Text className="text-lg font-bold text-gray-800">4,956</Text>
          <Text className="text-sm text-gray-500">Review</Text>
        </View>
      </View>

      {/* About */}
      <View className="border-b border-gray-100 px-4 py-4">
        <Text className="mb-2 text-xl font-bold text-gray-800">About</Text>
        <Text className="leading-5 text-gray-600">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco.
        </Text>
        <Pressable className="mt-1">
          <Text className="text-blue-500">Read more</Text>
        </Pressable>
      </View>

      {/* Working Hours */}
      <View className="border-b border-gray-100 px-4 py-4">
        <Text className="mb-3 text-xl font-bold text-gray-800">Working Hours</Text>

        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, index) => (
          <View key={day} className="flex-row justify-between py-2">
            <Text className="text-gray-500">{day}</Text>
            <Text className="text-gray-800">00:00 - 00:00</Text>
          </View>
        ))}
      </View>

      {/* Book Appointment Button */}
      <View className="p-4 pb-8">
        <Pressable
          className="h-14 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-purple-900"
          onPress={() => router.push(`/book/${id}`)}>
          <Text className="text-lg font-bold text-white">Book Appointment</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
