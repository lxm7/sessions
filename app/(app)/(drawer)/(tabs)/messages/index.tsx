import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { conversations } from '~/mockData/conversations';

export default function ConversationsScreen() {
  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center justify-between border-b border-gray-200 px-4 pb-2 pt-12">
        <TouchableOpacity onPress={() => {}}>
          <Ionicons name="menu-outline" size={24} color="#333" />
        </TouchableOpacity>
        <Text className="text-xl font-bold">Messages</Text>
        <TouchableOpacity>
          <Ionicons name="create-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Link href={`/messages/${item.id}`} asChild>
            <TouchableOpacity className="flex-row items-center border-b border-gray-100 px-4 py-3">
              <Image source={{ uri: item.avatar }} className="mr-3 h-12 w-12 rounded-full" />
              <View className="flex-1">
                <View className="flex-row justify-between">
                  <Text className={`font-medium ${item.unread ? 'font-bold' : ''}`}>
                    {item.name}
                  </Text>
                  <Text className="text-xs text-gray-500">{item.time}</Text>
                </View>
                <Text
                  className={`text-sm ${item.unread ? 'font-medium text-gray-800' : 'text-gray-500'}`}
                  numberOfLines={1}>
                  {item.lastMessage}
                </Text>
              </View>
              {item.unread && <View className="ml-2 h-3 w-3 rounded-full bg-blue-500" />}
            </TouchableOpacity>
          </Link>
        )}
      />
    </View>
  );
}
