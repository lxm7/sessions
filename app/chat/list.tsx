import {
  View,
  Text,
  Image,
  Pressable,
  TextInput,
  ScrollView,
  FlatList,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomNavBar from '../../components/BottomNavBar';

// Dummy Data
const onlineMusicians = [
  { id: '1', img: 'https://placehold.co/50x50/png?text=D1' },
  { id: '2', img: 'https://placehold.co/50x50/png?text=D2' },
  { id: '3', img: 'https://placehold.co/50x50/png?text=D3' },
  { id: '4', img: 'https://placehold.co/50x50/png?text=D4' },
  { id: '5', img: 'https://placehold.co/50x50/png?text=D5' },
  { id: '6', img: 'https://placehold.co/50x50/png?text=D6' },
];

const chatListData = [
  {
    id: '1',
    name: 'Carla Schoen',
    message: 'Perfect, will check it',
    time: '09:34 PM',
    img: 'https://placehold.co/50x50/png?text=CS',
    online: true,
  },
  {
    id: '2',
    name: 'Mrs. Sheila Lemke',
    message: 'Thanks',
    time: '09:34 PM',
    img: 'https://placehold.co/50x50/png?text=SL',
    online: true,
  },
  {
    id: '3',
    name: 'Deanna Botsford V',
    message: 'Welcome!',
    time: '09:34 PM',
    img: 'https://placehold.co/50x50/png?text=DB',
    online: false,
  },
  {
    id: '4',
    name: 'Mr. Katie Bergnaum',
    message: 'Good Morning!',
    time: '09:34 PM',
    img: 'https://placehold.co/50x50/png?text=KB',
    online: true,
  },
  {
    id: '5',
    name: 'Armando Ferry',
    message: 'Can i check that?',
    time: '09:34 PM',
    img: 'https://placehold.co/50x50/png?text=AF',
    online: false,
  },
  {
    id: '6',
    name: 'Annette Fritsch',
    message: 'Thanks!',
    time: '09:34 PM',
    img: 'https://placehold.co/50x50/png?text=AFR',
    online: true,
  },
];

type ChatItemProps = (typeof chatListData)[0];

const ChatListItem = ({ item }: { item: ChatItemProps }) => (
  <Pressable className="mb-px flex-row items-center bg-white p-4">
    {/* Use mb-px for thin separator effect if desired */}
    <View className="relative mr-4">
      <Image source={{ uri: item.img }} className="h-12 w-12 rounded-full" />
      {item.online && (
        <View className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500" />
      )}
    </View>
    <View className="flex-1">
      <Text className="text-base font-semibold">{item.name}</Text>
      <Text className="text-sm text-gray-500" numberOfLines={1}>
        {item.message}
      </Text>
    </View>
    <Text className="ml-2 text-xs text-gray-400">{item.time}</Text>
  </Pressable>
);

const ChatListScreen = () => {
  return (
    <View className="flex-1 bg-gray-100">
      <StatusBar barStyle="light-content" />
      {/* Header */}
      <View className="bg-blue-500 p-4">
        <View className="mb-4 flex-row items-center">
          <Pressable className="mr-4 p-1">
            <Ionicons name="arrow-back" size={24} color="white" />
          </Pressable>
          <Text className="flex-1 text-xl font-semibold text-white">Chat</Text>
        </View>
        <View className="flex-row items-center rounded-full bg-white px-4 py-2">
          <Ionicons
            name="search"
            size={20}
            color="#6b7280" // gray-500
            className="mr-2"
          />
          <TextInput
            placeholder="Search musician"
            placeholderTextColor="#6b7280" // gray-500
            className="h-6 flex-1 text-base" // Adjust height/text size
            style={Platform.OS === 'web' ? { outline: 'none' } : {}} // Remove web outline
          />
        </View>
      </View>

      {/* Online Musicians Horizontal List */}
      <View className="mb-2 rounded-b-3xl bg-white py-3 pl-4 shadow-md">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {onlineMusicians.map((musician) => (
            <Pressable key={musician.id} className="mr-4 items-center">
              <Image
                source={{ uri: musician.img }}
                className="h-14 w-14 rounded-full border-2 border-blue-300" // Slightly darker border
              />
              {/* Optional: Add name below avatar */}
              {/* <Text className="text-xs mt-1 text-gray-600">Name</Text> */}
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Chat List */}
      <FlatList
        data={chatListData}
        renderItem={({ item }) => <ChatListItem item={item} />}
        keyExtractor={(item) => item.id}
        className="flex-1" // Removed mt-2 as separator is handled by mb-px or bg change
        ItemSeparatorComponent={() => <View className="h-px bg-gray-200" />} // Optional explicit separator
      />

      {/* Bottom Navigation */}
      <BottomNavBar active="Chat" />
    </View>
  );
};

export default ChatListScreen;
