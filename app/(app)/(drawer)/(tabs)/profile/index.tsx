import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-gray-50">
      <View className="flex-row items-center justify-between border-b border-gray-200 px-4 pb-2 pt-4">
        <TouchableOpacity onPress={() => router.navigate('../../../drawer/')}>
          <Ionicons name="menu-outline" size={24} color="#333" />
        </TouchableOpacity>
        <Text className="text-xl font-bold">My Profile</Text>
        <Link href="/profile/settings" asChild>
          <TouchableOpacity>
            <Ionicons name="settings-outline" size={24} color="#333" />
          </TouchableOpacity>
        </Link>
      </View>

      <ScrollView>
        {/* Profile Header */}
        <View className="items-center border-b border-gray-200 bg-white p-4">
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/women/32.jpg' }}
            className="mb-3 h-24 w-24 rounded-full"
          />
          <Text className="text-2xl font-bold">Jane Musician</Text>
          <Text className="mb-2 text-gray-500">Jazz Guitarist & Vocalist</Text>

          <View className="mt-2 flex-row">
            <Link href="/profile/edit" asChild>
              <TouchableOpacity className="mr-3 rounded-full bg-blue-500 px-5 py-2">
                <Text className="font-medium text-white">Edit Profile</Text>
              </TouchableOpacity>
            </Link>
            <Link href="/profile/connections" asChild>
              <TouchableOpacity className="rounded-full bg-gray-200 px-5 py-2">
                <Text className="font-medium text-gray-800">Connections</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        {/* Stats Section */}
        <View className="flex-row border-b border-gray-200 bg-white">
          <View className="flex-1 items-center border-r border-gray-200 py-3">
            <Text className="text-lg font-bold">42</Text>
            <Text className="text-sm text-gray-500">Gigs</Text>
          </View>
          <View className="flex-1 items-center border-r border-gray-200 py-3">
            <Text className="text-lg font-bold">1.2k</Text>
            <Text className="text-sm text-gray-500">Followers</Text>
          </View>
          <View className="flex-1 items-center py-3">
            <Text className="text-lg font-bold">128</Text>
            <Text className="text-sm text-gray-500">Following</Text>
          </View>
        </View>

        {/* Quick Links */}
        <View className="mx-4 mt-4 overflow-hidden rounded-lg bg-white">
          <Link href="/profile/gigs" asChild>
            <TouchableOpacity className="flex-row items-center border-b border-gray-200 px-4 py-3">
              <Ionicons name="calendar-outline" size={22} color="#3b82f6" className="mr-3" />
              <Text className="flex-1 text-gray-800">My Gigs</Text>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>
          </Link>

          <Link href="/profile/analytics" asChild>
            <TouchableOpacity className="flex-row items-center border-b border-gray-200 px-4 py-3">
              <Ionicons name="bar-chart-outline" size={22} color="#3b82f6" className="mr-3" />
              <Text className="flex-1 text-gray-800">Analytics & Insights</Text>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>
          </Link>

          <Link href="/saved" asChild>
            <TouchableOpacity className="flex-row items-center px-4 py-3">
              <Ionicons name="bookmark-outline" size={22} color="#3b82f6" className="mr-3" />
              <Text className="flex-1 text-gray-800">Saved Items</Text>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>
          </Link>
        </View>

        {/* Bio Section */}
        <View className="mx-4 mb-6 mt-4 rounded-lg bg-white p-4">
          <Text className="mb-2 text-lg font-bold">About Me</Text>
          <Text className="leading-5 text-gray-700">
            Jazz guitarist and vocalist with over 10 years of experience. Specializing in jazz
            standards and bossa nova. Available for gigs at clubs, restaurants, and private events.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
