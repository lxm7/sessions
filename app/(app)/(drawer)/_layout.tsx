import { Drawer } from 'expo-router/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DrawerContentScrollView } from '@react-navigation/drawer';

// Custom drawer content
function CustomDrawerContent(props: any) {
  const insets = useSafeAreaInsets();

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: insets.top }}>
      {/* Profile Section */}
      <View className="border-b border-gray-200 px-5 py-4">
        <Image
          source={{ uri: 'https://randomuser.me/api/portraits/women/32.jpg' }}
          className="mb-2 h-20 w-20 rounded-full"
        />
        <Text className="text-lg font-bold">Jane Jules</Text>
        <Text className="text-gray-500">Musician</Text>
      </View>

      {/* Menu Items */}
      <ScrollView className="px-2 py-2">
        <TouchableOpacity
          className="mb-1 flex-row items-center rounded-md px-3 py-3 active:bg-gray-100"
          onPress={() => props.navigation.navigate('(tabs)')}>
          <Ionicons name="home-outline" size={22} color="#555" />
          <Text className="ml-3 text-gray-800">Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="mb-1 flex-row items-center rounded-md px-3 py-3 active:bg-gray-100"
          onPress={() => props.navigation.navigate('calendar')}>
          <Ionicons name="calendar-outline" size={22} color="#555" />
          <Text className="ml-3 text-gray-800">Calendar View</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="mb-1 flex-row items-center rounded-md px-3 py-3 active:bg-gray-100"
          onPress={() => props.navigation.navigate('saved')}>
          <Ionicons name="bookmark-outline" size={22} color="#555" />
          <Text className="ml-3 text-gray-800">Saved Items</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="mb-1 flex-row items-center rounded-md px-3 py-3 active:bg-gray-100"
          onPress={() => props.navigation.navigate('network')}>
          <Ionicons name="people-outline" size={22} color="#555" />
          <Text className="ml-3 text-gray-800">Network</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="mb-1 flex-row items-center rounded-md px-3 py-3 active:bg-gray-100"
          onPress={() => props.navigation.navigate('promo-tools')}>
          <Ionicons name="megaphone-outline" size={22} color="#555" />
          <Text className="ml-3 text-gray-800">Promotional Tools</Text>
        </TouchableOpacity>

        <View className="my-2 border-t border-gray-200" />

        <TouchableOpacity
          className="mb-1 flex-row items-center rounded-md px-3 py-3 active:bg-gray-100"
          onPress={() => props.navigation.navigate('help')}>
          <Ionicons name="help-circle-outline" size={22} color="#555" />
          <Text className="ml-3 text-gray-800">Help & Support</Text>
        </TouchableOpacity>
      </ScrollView>
    </DrawerContentScrollView>
  );
}

export default function DrawerLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'slide',
        drawerStyle: {
          width: '75%',
          backgroundColor: '#fff',
        },
      }}>
      <Drawer.Screen
        name="(tabs)"
        options={{
          drawerLabel: 'Home',
          title: 'Home',
        }}
      />
      <Drawer.Screen
        name="calendar"
        options={{
          drawerLabel: 'Calendar',
          title: 'Calendar View',
        }}
      />
      <Drawer.Screen
        name="saved"
        options={{
          drawerLabel: 'Saved Items',
          title: 'Saved Items',
        }}
      />
      <Drawer.Screen
        name="network"
        options={{
          drawerLabel: 'Network',
          title: 'Network',
        }}
      />
      <Drawer.Screen
        name="promo-tools"
        options={{
          drawerLabel: 'Promotional Tools',
          title: 'Promotional Tools',
        }}
      />
      <Drawer.Screen
        name="help"
        options={{
          drawerLabel: 'Help & Support',
          title: 'Help & Support',
        }}
      />
    </Drawer>
  );
}
