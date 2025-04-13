import { useState } from 'react';
import { View, Text, Image, FlatList, Pressable, ScrollView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';

import { musicians } from '~/data/musicians';
import { instruments } from '~/data/instruments';

export default function MusiciansScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('Guitarist');
  const [favorites, setFavorites] = useState(
    musicians.filter((s) => s.isFavorite).map((s) => s.id)
  );

  const toggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((fid) => fid !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const renderSpecialist = ({ item }: { item: (typeof musicians)[0] }) => (
    <Pressable
      className="mb-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
      onPress={() => router.push(`/specialist/${item.id}`)}>
      <View className="flex-row">
        <Image source={{ uri: item.image }} className="h-20 w-20 rounded-lg" resizeMode="cover" />

        <View className="ml-3 flex-1">
          <View className="flex-row justify-between">
            <View className="flex-row items-center rounded-lg bg-blue-100 px-2 py-1">
              <Ionicons name="checkmark-circle" size={16} color="#a855f7" />
              <Text className="ml-1 text-xs text-blue-500">Professional musician</Text>
            </View>

            <Pressable onPress={() => toggleFavorite(item.id)}>
              <Ionicons
                name={favorites.includes(item.id) ? 'heart' : 'heart-outline'}
                size={24}
                color={favorites.includes(item.id) ? '#FF3B30' : '#CCCCCC'}
              />
            </Pressable>
          </View>

          <Text className="mt-1 text-lg font-bold text-gray-800">{item.name}</Text>
          <Text className="text-gray-500">{item.instruments}</Text>

          <View className="mt-1 flex-row items-center">
            <View className="flex-row items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons key={star} name="star" size={14} color="#FFD700" />
              ))}
              <Text className="ml-1 font-medium">{item.rating}</Text>
            </View>
            <Text className="ml-2 text-gray-400">| {item.previousShows} previousShows</Text>
          </View>
        </View>
      </View>

      <Pressable
        className="mt-3 h-12 items-center justify-center rounded-lg bg-blue-100"
        onPress={() => router.push(`/book/${item.id}`)}>
        <Text className="font-medium text-blue-500">Make Appointment</Text>
      </Pressable>
    </Pressable>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="flex-row items-center justify-between bg-white p-4">
        <View className="flex-row items-center">
          <Pressable
            className="h-10 w-10 items-center justify-center rounded-full bg-gray-100"
            onPress={() => router.back()}>
            <Feather name="arrow-left" size={20} color="#333" />
          </Pressable>
          <Text className="ml-4 text-xl font-semibold">Top Specialist</Text>
        </View>

        <Pressable
          className="h-10 w-10 items-center justify-center rounded-full bg-gray-100"
          onPress={() => router.push('/search')}>
          <Feather name="search" size={20} color="#333" />
        </Pressable>
      </View>

      {/* Category filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12 }}
        className="bg-white py-3">
        {instruments.map((category) => (
          <Pressable
            key={category}
            className={`mr-2 rounded-full px-5 py-2 ${
              selectedCategory === category
                ? 'bg-gradient-to-r from-purple-500 to-purple-900'
                : 'bg-gray-100'
            }`}
            onPress={() => setSelectedCategory(category)}>
            <Text
              className={`font-medium ${
                selectedCategory === category ? 'text-white' : 'text-gray-700'
              }`}>
              {category}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* musicians list */}
      <FlatList
        data={musicians}
        renderItem={renderSpecialist}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
