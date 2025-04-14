import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { musicians } from '~/mockData/musicians';

export default function MusiciansScreen() {
  const renderMusician = ({ item }: any) => (
    <Link href={`/discover/${item.id}`} asChild>
      <TouchableOpacity className="mb-4 overflow-hidden rounded-xl bg-white shadow-sm">
        <Image source={{ uri: item.image }} className="h-44 w-full" />
        <View className="p-4">
          <Text className="text-lg font-semibold">{item.name}</Text>
          <Text className="text-gray-500">{item.genre}</Text>
        </View>
      </TouchableOpacity>
    </Link>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <FlatList
        data={musicians}
        renderItem={renderMusician}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
      />

      {/* Floating action button */}
      <TouchableOpacity className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-blue-500 shadow-md">
        <Ionicons name="filter-outline" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}
