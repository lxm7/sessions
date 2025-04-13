import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Sample conversations data
const CONVERSATIONS = [
  {
    id: '1',
    name: 'Blue Note Club',
    lastMessage: "We'd love to have you perform next Friday!",
    time: '2:30 PM',
    unread: true,
    avatar: 'https://via.placeholder.com/50',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    lastMessage: 'Looking forward to our collaboration',
    time: '10:15 AM',
    unread: false,
    avatar: 'https://via.placeholder.com/50',
  },
  {
    id: '3',
    name: 'Jazz Festival Organizer',
    lastMessage: 'Can you send your technical requirements?',
    time: 'Yesterday',
    unread: true,
    avatar: 'https://via.placeholder.com/50',
  },
  {
    id: '4',
    name: 'Mike from The Band Next Door',
    lastMessage: 'Great meeting you yesterday at the venue',
    time: 'Yesterday',
    unread: false,
    avatar: 'https://via.placeholder.com/50',
  },
];

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
        data={CONVERSATIONS}
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
