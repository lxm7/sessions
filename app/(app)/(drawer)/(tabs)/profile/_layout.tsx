import { Tabs } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePathname } from 'expo-router';

function CustomHeader({ navigation }: any) {
  const pathname = usePathname();
  const currentRoute = pathname.split('/').pop() || '';

  return (
    <View className="border-b border-gray-200 bg-white px-4 pb-2 pt-12">
      <View className="flex-row items-center justify-between">
        <TouchableOpacity onPress={() => navigation.openDrawer()} className="-ml-2 p-2">
          <Ionicons name="menu-outline" size={24} color="#333" />
        </TouchableOpacity>

        <Text className="text-xl font-bold">Events</Text>

        <TouchableOpacity className="-mr-2 p-2">
          <Ionicons name="options-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Segmented Control */}
      <View className="mt-4 flex-row rounded-lg bg-gray-100 p-1">
        <TouchableOpacity
          onPress={() => navigation.navigate('/')}
          className={`flex-1 rounded-md px-4 py-2 ${
            currentRoute === '' || currentRoute === 'events' ? 'bg-white shadow-sm' : ''
          }`}>
          <Text
            className={`text-center ${
              currentRoute === '' || currentRoute === 'events'
                ? 'font-medium text-blue-500'
                : 'text-gray-500'
            }`}>
            Upcoming
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('for-you')}
          className={`flex-1 rounded-md px-4 py-2 ${
            currentRoute === 'for-you' ? 'bg-white shadow-sm' : ''
          }`}>
          <Text
            className={`text-center ${
              currentRoute === 'for-you' ? 'font-medium text-blue-500' : 'text-gray-500'
            }`}>
            For You
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('my-tickets')}
          className={`flex-1 rounded-md px-4 py-2 ${
            currentRoute === 'my-tickets' ? 'bg-white shadow-sm' : ''
          }`}>
          <Text
            className={`text-center ${
              currentRoute === 'my-tickets' ? 'font-medium text-blue-500' : 'text-gray-500'
            }`}>
            My Tickets
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function EventsLayout() {
  return (
    <Tabs
      screenOptions={{
        header: (props) => <CustomHeader {...props} />,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Upcoming',
        }}
      />
      <Tabs.Screen
        name="for-you"
        options={{
          title: 'For You',
        }}
      />
      <Tabs.Screen
        name="my-tickets"
        options={{
          title: 'My Tickets',
        }}
      />
    </Tabs>
  );
}
