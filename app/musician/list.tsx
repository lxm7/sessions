import React, { useState } from 'react';
import { View, Text, Image, FlatList, Pressable, ScrollView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';

const specialists = [
  {
    id: '1',
    name: 'Jane Cooper',
    specialty: 'Guitarist',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4',
    rating: 4.8,
    reviews: 49,
    isProfessional: true,
    isFavorite: true,
  },
  {
    id: '2',
    name: 'Guy Hawkins',
    specialty: 'Guitarist',
    image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76',
    rating: 4.8,
    reviews: 49,
    isProfessional: true,
    isFavorite: false,
  },
  {
    id: '3',
    name: 'Jacob Jones',
    specialty: 'Guitarist',
    image: 'https://images.unsplash.com/photo-1517230878791-4d28214057c2',
    rating: 4.8,
    reviews: 49,
    isProfessional: true,
    isFavorite: false,
  },
  {
    id: '4',
    name: 'Leslie Alexander',
    specialty: 'Guitarist',
    image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1',
    rating: 4.8,
    reviews: 49,
    isProfessional: true,
    isFavorite: false,
  },
];

const categories = ['All', 'Guitarist', 'Cardiologist', 'Neurologist', 'Ophthalmologist'];

export default function SpecialistsScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('Guitarist');
  const [favorites, setFavorites] = useState(
    specialists.filter((s) => s.isFavorite).map((s) => s.id)
  );

  const toggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((fid) => fid !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const renderSpecialist = ({ item }: { item: (typeof specialists)[0] }) => (
    <Pressable
      className="mb-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
      onPress={() => router.push(`/specialist/${item.id}`)}>
      <View className="flex-row">
        <Image source={{ uri: item.image }} className="h-20 w-20 rounded-lg" resizeMode="cover" />

        <View className="ml-3 flex-1">
          <View className="flex-row justify-between">
            <View className="flex-row items-center rounded-lg bg-blue-100 px-2 py-1">
              <Ionicons name="checkmark-circle" size={16} color="#007AFF" />
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
          <Text className="text-gray-500">{item.specialty}</Text>

          <View className="mt-1 flex-row items-center">
            <View className="flex-row items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons key={star} name="star" size={14} color="#FFD700" />
              ))}
              <Text className="ml-1 font-medium">{item.rating}</Text>
            </View>
            <Text className="ml-2 text-gray-400">| {item.reviews} Reviews</Text>
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
        {categories.map((category) => (
          <Pressable
            key={category}
            className={`mr-2 rounded-full px-5 py-2 ${
              selectedCategory === category ? 'bg-blue-500' : 'bg-gray-100'
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

      {/* Specialists list */}
      <FlatList
        data={specialists}
        renderItem={renderSpecialist}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
