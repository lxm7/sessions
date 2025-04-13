import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { venues } from '~/data/venue';
import VenueCard from '~/components/VenueCard';

// Dummy Data
const filters = ['All', 'Pub', 'Late opening', 'Local Venue', 'Night Club', 'Festival'];

const NearbyVenuesScreen = () => {
  const [activeFilter, setActiveFilter] = useState('Pub');

  const filteredvenues = venues.filter(
    (c) =>
      activeFilter === 'All' ||
      c.specialties.some((s) => s.toLowerCase() === activeFilter.toLowerCase())
  );

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />
      {/* Header */}
      <View className="flex-row items-center justify-between bg-white p-4 shadow-sm">
        <TouchableOpacity className="p-1">
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold">Nearby Venues</Text>
        <TouchableOpacity className="p-1">
          <Ionicons name="search" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View className="bg-white px-4 py-3">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              onPress={() => setActiveFilter(filter)}
              className={`mr-2 rounded-full border px-4 py-2 ${
                activeFilter === filter
                  ? 'border-blue-500 bg-gradient-to-r from-purple-500 to-purple-900'
                  : 'border-gray-300 bg-white'
              }`}>
              <Text
                className={`font-medium ${
                  activeFilter === filter ? 'text-white' : 'text-gray-700'
                }`}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* venues List */}
      <ScrollView className="flex-1 p-4">
        {filteredvenues.length > 0 ? (
          filteredvenues.map((venue) => <VenueCard key={venue.id} venue={venue} />)
        ) : (
          <View className="mt-20 items-center justify-center">
            <Text className="text-lg text-gray-500">No venues found for "{activeFilter}".</Text>
          </View>
        )}
      </ScrollView>

      {/* Add BottomNavBar here if this screen needs it */}
      {/* <BottomNavBar active="Explore" /> */}
    </View>
  );
};

export default NearbyVenuesScreen;
