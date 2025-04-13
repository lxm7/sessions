import { View, Text, Image, ScrollView, Pressable, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';
import VenueCard from '~/components/VenueCard';
import { venues } from '~/data/venue';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="bg-white p-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Pressable onPress={() => router.push('/location')} className="flex-row items-center">
              <Ionicons name="location" size={20} color="#a855f7" />
              <Text className="ml-1 font-medium text-gray-700">New York, USA</Text>
              <Ionicons name="chevron-down" size={16} color="#666" />
            </Pressable>
          </View>

          <Pressable
            className="h-10 w-10 items-center justify-center rounded-full bg-gray-100"
            onPress={() => console.log('Notifications')}>
            <View className="absolute right-0 top-0 z-10 h-2 w-2 rounded-full bg-red-500" />
            <Ionicons name="notifications-outline" size={20} color="#333" />
          </Pressable>
        </View>

        {/* Search bar */}
        <View className="mt-4 flex-row items-center">
          <Pressable
            className="h-12 flex-1 flex-row items-center rounded-lg border border-gray-200 px-3"
            onPress={() => router.push('/search')}>
            <Ionicons name="search" size={20} color="#999" />
            <Text className="ml-2 text-gray-400">Search</Text>
          </Pressable>

          <Pressable
            className="ml-3 h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-purple-900"
            onPress={() => console.log('Filter')}>
            <Feather name="sliders" size={20} color="white" />
          </Pressable>
        </View>
      </View>

      {/* Upcoming appointments */}
      <View className="mt-4 px-4">
        <View className="mb-3 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Text className="text-xl font-bold text-gray-800">Upcoming Schedule</Text>
            <View className="ml-2 h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-purple-900">
              <Text className="text-xs font-bold text-white">2</Text>
            </View>
          </View>

          <Pressable onPress={() => router.push('/appointments')}>
            <Text className="text-blue-500">See All</Text>
          </Pressable>
        </View>

        <Pressable
          className="rounded-xl bg-gradient-to-r from-purple-500 to-purple-900 p-4"
          onPress={() => router.push('/appointment/1')}>
          <View className="flex-row items-center">
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1517230878791-4d28214057c2' }}
              className="h-12 w-12 rounded-full"
            />
            <View className="ml-3">
              <Text className="font-medium text-white">Alana Rueter</Text>
              <Text className="text-blue-200">Guitar Lesson</Text>
            </View>

            <Pressable
              className="ml-auto h-10 w-10 items-center justify-center rounded-full bg-blue-400"
              onPress={() => console.log('Call musician')}>
              <Feather name="phone" size={18} color="white" />
            </Pressable>
          </View>

          <View className="mt-4 flex-row justify-between">
            <View className="flex-row items-center">
              <Feather name="calendar" size={16} color="white" />
              <Text className="ml-2 text-white">Monday, 26 July</Text>
            </View>

            <View className="flex-row items-center">
              <Feather name="clock" size={16} color="white" />
              <Text className="ml-2 text-white">09:00 - 10:00</Text>
            </View>
          </View>
        </Pressable>

        <Pressable
          className="mt-4 rounded-xl bg-gradient-to-r from-purple-500 to-purple-900 p-4"
          onPress={() => router.push('/appointment/1')}>
          <View className="flex-row items-center">
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76' }}
              className="h-12 w-12 rounded-full"
            />
            <View className="ml-3">
              <Text className="font-medium text-white">Motion</Text>
              <Text className="text-blue-200">Playing bass for Fat White Family</Text>
            </View>

            <Pressable
              className="ml-auto h-10 w-10 items-center justify-center rounded-full bg-blue-400"
              onPress={() => console.log('Call musician')}>
              <Feather name="phone" size={18} color="white" />
            </Pressable>
          </View>

          <View className="mt-4 flex-row justify-between">
            <View className="flex-row items-center">
              <Feather name="calendar" size={16} color="white" />
              <Text className="ml-2 text-white">Monday, 06 Sep</Text>
            </View>

            <View className="flex-row items-center">
              <Feather name="clock" size={16} color="white" />
              <Text className="ml-2 text-white">19:00 - 23:00</Text>
            </View>
          </View>
        </Pressable>
      </View>

      {/* Nearby venues */}
      <View className="mt-6 px-4 pb-8">
        <View className="mb-3 flex-row items-center justify-between">
          <Text className="text-xl font-bold text-gray-800">Nearby venues</Text>
          <Pressable onPress={() => router.push('/venue/list')}>
            <Text className="text-blue-500">See All</Text>
          </Pressable>
        </View>

        {venues.map((venue) => (
          <VenueCard key={venue.id} venue={venue} />
        ))}
      </View>
    </ScrollView>
  );
}
