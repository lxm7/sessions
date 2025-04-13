import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Using Ionicons for all examples

interface BottomNavBarProps {
  active: 'Home' | 'Explore' | 'Bookings' | 'Chat' | 'Profile';
  // Add navigation prop type if using React Navigation, e.g.:
  // navigation: any;
}

type NavItemName = 'Home' | 'Explore' | 'Bookings' | 'Chat' | 'Profile';

interface NavItem {
  name: NavItemName;
  icon: keyof typeof Ionicons.glyphMap; // Type checking for icon names
  activeIcon: keyof typeof Ionicons.glyphMap;
}

const navItems: NavItem[] = [
  { name: 'Home', icon: 'home-outline', activeIcon: 'home' },
  { name: 'Explore', icon: 'compass-outline', activeIcon: 'compass' },
  { name: 'Bookings', icon: 'calendar-outline', activeIcon: 'calendar' },
  {
    name: 'Chat',
    icon: 'chatbubble-ellipses-outline',
    activeIcon: 'chatbubble-ellipses',
  },
  { name: 'Profile', icon: 'person-outline', activeIcon: 'person' },
];

const BottomNavBar = ({ active }: BottomNavBarProps) => {
  // Function to handle navigation onPress
  const handlePress = (screenName: NavItemName) => {
    console.log('Navigate to:', screenName);
    // Example with React Navigation:
    // navigation.navigate(screenName);
  };

  return (
    <View className="shadow-inner flex-row items-center justify-around border-t border-gray-200 bg-white py-2">
      {navItems.map((item) => {
        const isActive = active === item.name;
        return (
          <TouchableOpacity
            key={item.name}
            className="flex-1 items-center justify-center py-1" // Added padding for better touch area
            onPress={() => handlePress(item.name)}
            accessibilityRole="button"
            accessibilityLabel={item.name}
            accessibilityState={{ selected: isActive }}>
            <View className="relative mb-0.5 h-6 w-6 items-center justify-center">
              <Ionicons
                name={isActive ? item.activeIcon : item.icon}
                size={24}
                color={isActive ? '#3b82f6' : '#6b7280'} // blue-500, gray-500
              />
              {/* Indicator dot for Chat */}
              {isActive && item.name === 'Chat' && (
                <View className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-gradient-to-r from-purple-500 to-purple-900" />
              )}
            </View>
            <Text className={`text-xs ${isActive ? 'font-medium text-blue-500' : 'text-gray-500'}`}>
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default BottomNavBar;
