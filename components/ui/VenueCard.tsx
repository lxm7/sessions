import React, { useState } from 'react';
import { View, Text, Image, Pressable, ScrollView, StatusBar, ImageBackground } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { venues } from '~/mockData/venue';

type venue = (typeof venues)[0];

const VenueCard = ({ venue }: { venue: venue }) => (
  <View className="mb-4 overflow-hidden rounded-xl bg-white shadow-md">
    <ImageBackground source={{ uri: venue.image }} className="h-40 w-full" resizeMode="cover">
      <View className="flex-row justify-end p-2">
        <Pressable className="rounded-full bg-white/80 p-2 shadow">
          <Ionicons
            name={venue.isFav ? 'heart' : 'heart-outline'}
            size={20}
            color={venue.isFav ? '#ef4444' : 'black'} // red-500
          />
        </Pressable>
      </View>
      <View className="absolute bottom-2 right-2 flex-row items-center rounded-full bg-white/90 px-2 py-1 shadow">
        <Ionicons name="star" size={14} color="#f59e0b" />
        <Text className="ml-1 text-xs font-semibold">
          {venue.rating} ({venue.reviews} Review)
        </Text>
      </View>
    </ImageBackground>
    <View className="p-4">
      <Text className="mb-1 text-lg font-bold">{venue.name}</Text>
      <Text className="mb-2 text-sm text-gray-500">{venue.specialties.join(', ')}</Text>
      <View className="mb-1 flex-row items-center">
        <Ionicons name="location-sharp" size={16} color="#a855f7" />
        <Text className="ml-1.5 flex-shrink text-sm text-gray-600" numberOfLines={1}>
          {venue.address}
        </Text>
      </View>
      <View className="flex-row items-center">
        <MaterialCommunityIcons name="clock-time-four-outline" size={16} color="#a855f7" />
        <Text className="ml-1.5 text-sm text-gray-600">
          {venue.time} • {venue.distance}
        </Text>
      </View>
    </View>
  </View>
);

export default VenueCard;
