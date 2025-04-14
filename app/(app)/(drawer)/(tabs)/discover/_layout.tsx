import { Tabs } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePathname } from 'expo-router';

// Custom header with drawer toggle and segments
function CustomHeader({ navigation }: any) {
  const pathname = usePathname();

  // Get the current route without the leading paths
  const currentRoute = pathname.split('/').pop() || '';

  return (
    <View className="border-b border-gray-200 bg-white px-4 pb-2 pt-4">
      <View className="flex-row items-center justify-between">
        <TouchableOpacity onPress={() => navigation.openDrawer()} className="-ml-2 p-2">
          <Ionicons name="menu-outline" size={24} color="#333" />
        </TouchableOpacity>

        <Text className="text-xl font-bold">Discover</Text>

        <TouchableOpacity className="-mr-2 p-2">
          <Ionicons name="search-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Segmented Control */}
      {/* <View className="mt-4 flex-row rounded-lg bg-gray-100 p-1">
        <TouchableOpacity
          onPress={() => navigation.navigate('/')}
          className={`flex-1 rounded-md px-4 py-2 ${
            currentRoute === '' || currentRoute === 'discover' ? 'bg-white shadow-sm' : ''
          }`}>
          <Text
            className={`text-center ${
              currentRoute === '' || currentRoute === 'discover'
                ? 'font-medium text-blue-500'
                : 'text-gray-500'
            }`}>
            Musicians
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('venues')}
          className={`flex-1 rounded-md px-4 py-2 ${
            currentRoute === 'venues' ? 'bg-white shadow-sm' : ''
          }`}>
          <Text
            className={`text-center ${
              currentRoute === 'venues' ? 'font-medium text-blue-500' : 'text-gray-500'
            }`}>
            Venues
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('trending')}
          className={`flex-1 rounded-md px-4 py-2 ${
            currentRoute === 'trending' ? 'bg-white shadow-sm' : ''
          }`}>
          <Text
            className={`text-center ${
              currentRoute === 'trending' ? 'font-medium text-blue-500' : 'text-gray-500'
            }`}>
            Trending
          </Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
}

export default function DiscoverLayout() {
  return (
    <Tabs
      screenOptions={{
        header: (props) => <CustomHeader {...props} />,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Musicians',
        }}
      />
      <Tabs.Screen
        name="venues"
        options={{
          title: 'Venues',
        }}
      />
      <Tabs.Screen
        name="trending"
        options={{
          title: 'Trending',
        }}
      />
    </Tabs>
  );
}
