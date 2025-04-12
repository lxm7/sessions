import { View, Text, Image, Pressable, TextInput, ScrollView, StatusBar } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// Dummy data - replace with actual chat data and logic
const messages = [
  {
    id: '1',
    sender: 'Angie Brekke',
    text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    time: '08:04 pm',
    isMe: false,
    avatar: 'https://placehold.co/24x24/png?text=A',
  },
  {
    id: '2',
    sender: 'Esther Howard',
    text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    time: '08:04 pm',
    isMe: true,
    avatar: 'https://placehold.co/24x24/png?text=E',
  },
  {
    id: '3',
    sender: 'Angie Brekke',
    image: 'https://placehold.co/300x200.png?text=Medicine',
    time: '08:04 pm',
    isMe: false,
    avatar: 'https://placehold.co/24x24/png?text=A',
  },
  {
    id: '4',
    sender: 'Esther Howard',
    audio: { duration: '0:13' }, // Placeholder for audio data
    time: '08:04 pm',
    isMe: true,
    avatar: 'https://placehold.co/24x24/png?text=E',
  },
];

const ChatScreen = () => {
  return (
    <View className="flex-1 bg-gray-100">
      <StatusBar barStyle="light-content" />
      {/* Header */}
      <View className="flex-row items-center justify-between bg-blue-500 p-4">
        <Pressable>
          <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>
        <View className="flex-row items-center">
          <Image
            source={{ uri: 'https://placehold.co/40x40/png?text=Dr' }}
            className="mr-3 h-10 w-10 rounded-full"
          />
          <View>
            <Text className="text-lg font-semibold text-white">Angie Brekke</Text>
            <Text className="text-sm text-white">Online</Text>
          </View>
        </View>
        <Pressable>
          <MaterialCommunityIcons name="dots-vertical" size={24} color="white" />
        </Pressable>
      </View>

      {/* Chat Area */}
      <ScrollView
        className="flex-1 px-4 pt-4"
        contentContainerStyle={{ paddingBottom: 10 }} // Ensure scroll content doesn't hide behind input
      >
        <Text className="mb-4 text-center text-xs text-gray-500">TODAY</Text>
        {messages.map((msg) => (
          <View key={msg.id} className={`mb-4 ${msg.isMe ? 'items-end' : 'items-start'}`}>
            <View className="max-w-[85%] flex-row items-end">
              {!msg.isMe && (
                <Image
                  source={{ uri: msg.avatar }}
                  className="mb-1 mr-2 h-6 w-6 self-end rounded-full" // Align avatar properly
                />
              )}
              <View
                className={`rounded-lg p-3 ${
                  msg.isMe ? 'rounded-br-none bg-blue-500' : 'rounded-bl-none bg-white shadow-sm' // Added subtle shadow for received messages
                }`}>
                {msg.text && (
                  <Text className={`${msg.isMe ? 'text-white' : 'text-black'}`}>{msg.text}</Text>
                )}
                {msg.image && (
                  <Image
                    source={{ uri: msg.image }}
                    className="my-1 h-32 w-48 rounded-md" // Added margin for spacing
                    resizeMode="cover"
                  />
                )}
                {msg.audio && (
                  <View className="my-1 flex-row items-center">
                    <Pressable>
                      <Ionicons
                        name="play-circle"
                        size={28}
                        color={msg.isMe ? 'white' : '#3b82f6'} // Use theme blue
                      />
                    </Pressable>
                    {/* Basic audio wave representation - adjust styling as needed */}
                    <View className="mx-2 h-8 flex-1 items-center justify-center rounded bg-gray-200">
                      <Text className="text-xs text-gray-500">Audio Wave</Text>
                    </View>
                    <Text className={`text-xs ${msg.isMe ? 'text-white' : 'text-gray-600'}`}>
                      {msg.audio.duration}
                    </Text>
                  </View>
                )}
              </View>
              {msg.isMe && (
                <Image
                  source={{ uri: msg.avatar }}
                  className="mb-1 ml-2 h-6 w-6 self-end rounded-full" // Align avatar properly
                />
              )}
            </View>
            <Text
              className={`mt-1 text-xs text-gray-500 ${
                msg.isMe ? 'mr-8' : 'ml-8' // Adjust margin based on avatar presence
              }`}>
              {msg.time}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Input Area */}
      <View className="flex-row items-center border-t border-gray-200 bg-white p-2">
        <Pressable className="p-2">
          <Ionicons name="add" size={28} color="gray" />
        </Pressable>
        <TextInput
          className="mx-2 h-10 flex-1 rounded-full bg-gray-100 px-4 text-base" // Increased text size
          placeholder="Type a message here..."
          placeholderTextColor="#9ca3af" // Explicit placeholder color
        />
        <Pressable className="h-10 w-10 items-center justify-center rounded-full bg-blue-500 p-2">
          <Ionicons name="mic" size={20} color="white" />
        </Pressable>
      </View>
    </View>
  );
};

export default ChatScreen;
