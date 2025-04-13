import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, FlatList, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';

const recentLocations = [
  {
    id: '1',
    name: 'Golden Avenue',
    address: '8502 Preston Rd. Inglewood',
  },
  {
    id: '2',
    name: 'Sunset Boulevard',
    address: '2715 Ash San Jose',
  },
  {
    id: '3',
    name: 'Central Park',
    address: '4140 Parker Rd. Allentown',
  },
];

export default function LocationScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('Golden Avenue');
  const [searchResults, setSearchResults] = useState(recentLocations);

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.length > 0) {
      setSearchResults(
        recentLocations.filter((location) =>
          location.name.toLowerCase().includes(text.toLowerCase())
        )
      );
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectLocation = (location: (typeof recentLocations)[0]) => {
    console.log('Selected location:', location);
    // Set the location in your app state
    router.back();
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="bg-white px-4 pb-4 pt-12">
        <View className="flex-row items-center">
          <Pressable
            className="h-10 w-10 items-center justify-center rounded-full bg-gray-100"
            onPress={() => router.back()}>
            <Feather name="arrow-left" size={20} color="#333" />
          </Pressable>
          <Text className="ml-4 text-xl font-bold">Enter Your Location</Text>
        </View>
      </View>

      {/* Search input */}
      <View className="px-4">
        <View className="relative">
          <TextInput
            className="h-12 rounded-lg border border-gray-200 pl-10 pr-10 text-base"
            placeholder="Search location"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          <View className="absolute left-3 top-0 h-full justify-center">
            <Feather name="search" size={18} color="#666" />
          </View>
          {searchQuery.length > 0 && (
            <Pressable
              className="absolute right-3 top-0 h-full justify-center"
              onPress={handleClearSearch}>
              <Ionicons name="close-circle" size={18} color="#666" />
            </Pressable>
          )}
        </View>
      </View>

      {/* Use current location button */}
      <Pressable
        className="flex-row items-center border-b border-gray-100 px-4 py-4"
        onPress={() => console.log('Use current location')}>
        <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-purple-900">
          <Ionicons name="navigate" size={20} color="white" />
        </View>
        <Text className="text-base font-medium">Use my current location</Text>
      </Pressable>

      {/* Search results */}
      <View className="flex-1">
        <Text className="px-4 py-2 text-xs font-medium uppercase text-gray-500">SEARCH RESULT</Text>

        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              className="flex-row items-center border-b border-gray-100 px-4 py-3"
              onPress={() => handleSelectLocation(item)}>
              <View className="mr-3 h-9 w-9 items-center justify-center rounded-full bg-blue-100">
                <Ionicons name="location" size={18} color="#a855f7" />
              </View>
              <View>
                <Text className="text-base font-medium text-gray-800">{item.name}</Text>
                <Text className="text-sm text-gray-500">{item.address}</Text>
              </View>
            </Pressable>
          )}
          ListEmptyComponent={() => (
            <View className="items-center justify-center p-8">
              <Text className="text-gray-500">No locations found</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}
