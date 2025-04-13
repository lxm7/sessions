import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Switch, StatusBar } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import BottomNavBar from '../../components/BottomNavBar';

// Dummy Data
const bookings = [
  {
    id: '1',
    date: 'Aug 25, 2023 - 10:00 AM',
    musicianName: 'Jenny William',
    musicianImg: 'https://placehold.co/60x60/png?text=JW',
    address: 'G8502 Preston Rd. Inglewood',
    bookingId: '#DR452SA54',
    remindMe: true,
    status: 'Upcoming', // Added status for filtering
  },
  {
    id: '2',
    date: 'Aug 25, 2023 - 10:00 AM',
    musicianName: 'Guy Hawkins',
    musicianImg: 'https://placehold.co/60x60/png?text=GH',
    address: 'G8502 Preston Rd. Inglewood',
    bookingId: '#DR452SA54',
    remindMe: false,
    status: 'Upcoming',
  },
  {
    id: '3',
    date: 'Aug 15, 2023 - 02:30 PM',
    musicianName: 'Kristin Watson',
    musicianImg: 'https://placehold.co/60x60/png?text=KW',
    address: '123 Health St. Anytown',
    bookingId: '#DR123KW01',
    remindMe: false,
    status: 'Completed',
  },
  {
    id: '4',
    date: 'Aug 10, 2023 - 09:00 AM',
    musicianName: 'Ralph Edwards',
    musicianImg: 'https://placehold.co/60x60/png?text=RE',
    address: '456 Care Ave. Somewhere',
    bookingId: '#DR456RE02',
    remindMe: false,
    status: 'Cancelled',
  },
];

type Booking = (typeof bookings)[0];
type TabStatus = 'Upcoming' | 'Completed' | 'Cancelled';

interface BookingCardProps {
  booking: Booking;
  onRemindMeChange: (id: string, value: boolean) => void;
}

const BookingCard = ({ booking, onRemindMeChange }: BookingCardProps) => (
  <View className="mx-4 mb-4 rounded-xl bg-white p-4 shadow-md">
    <View className="mb-3 flex-row items-center justify-between">
      <Text className="font-medium text-gray-600">{booking.date}</Text>
      {booking.status === 'Upcoming' && ( // Only show toggle for upcoming
        <View className="flex-row items-center">
          <Text className="mr-2 text-sm text-gray-500">Remind me</Text>
          <Switch
            trackColor={{ false: '#e5e7eb', true: '#60a5fa' }} // gray-200, blue-400
            thumbColor={booking.remindMe ? '#3b82f6' : '#f4f3f4'} // blue-500, gray-100
            ios_backgroundColor="#e5e7eb" // gray-200
            onValueChange={(value) => onRemindMeChange(booking.id, value)}
            value={booking.remindMe}
          />
        </View>
      )}
    </View>

    <View className="mb-4 flex-row items-center">
      <Image source={{ uri: booking.musicianImg }} className="mr-4 h-16 w-16 rounded-lg" />
      <View className="flex-1">
        <Text className="mb-1 text-lg font-bold">{booking.musicianName}</Text>
        <View className="mb-1 flex-row items-center">
          <Ionicons name="location-outline" size={16} color="#6b7280" />
          <Text className="ml-1 text-sm text-gray-500" numberOfLines={1}>
            {booking.address}
          </Text>
        </View>
        <View className="flex-row items-center">
          <MaterialCommunityIcons name="id-card" size={16} color="#6b7280" />
          <Text className="ml-1 text-sm text-gray-500">
            Booking ID : <Text className="font-medium text-blue-500">{booking.bookingId}</Text>
          </Text>
        </View>
      </View>
    </View>

    {booking.status === 'Upcoming' && ( // Show buttons only for upcoming
      <View className="flex-row justify-between">
        <TouchableOpacity className="mr-2 flex-1 items-center rounded-full bg-blue-100 py-3">
          <Text className="font-semibold text-blue-500">Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity className="ml-2 flex-1 items-center rounded-full bg-gradient-to-r from-purple-500 to-purple-900 py-3">
          <Text className="font-semibold text-white">Reschedule</Text>
        </TouchableOpacity>
      </View>
    )}
    {booking.status === 'Completed' && ( // Example: Button for completed
      <View className="flex-row justify-end">
        <TouchableOpacity className="items-center rounded-full bg-green-100 px-4 py-2">
          <Text className="text-sm font-semibold text-green-600">Leave Review</Text>
        </TouchableOpacity>
      </View>
    )}
    {/* Add similar conditional rendering for Cancelled if needed */}
  </View>
);

const MyBookingsScreen = () => {
  const [activeTab, setActiveTab] = useState<TabStatus>('Upcoming');
  const [bookingData, setBookingData] = useState(bookings); // Use state for remindMe toggle

  const handleRemindMeChange = (id: string, value: boolean) => {
    setBookingData((prevBookings) =>
      prevBookings.map((b) => (b.id === id ? { ...b, remindMe: value } : b))
    );
  };

  const tabs: TabStatus[] = ['Upcoming', 'Completed', 'Cancelled'];

  const filteredBookings = bookingData.filter((b) => b.status === activeTab);

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />
      {/* Header */}
      <View className="flex-row items-center justify-between bg-white p-4 shadow-sm">
        <TouchableOpacity className="p-1">
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold">My Bookings</Text>
        <TouchableOpacity className="p-1">
          <Ionicons name="search" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View className="flex-row justify-around bg-white pb-1">
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            className={`flex-1 items-center border-b-2 py-3 ${
              activeTab === tab ? 'border-blue-500' : 'border-transparent'
            }`}>
            <Text
              className={`font-medium ${activeTab === tab ? 'text-blue-500' : 'text-gray-500'}`}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Bookings List */}
      <ScrollView className="flex-1 pt-4">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onRemindMeChange={handleRemindMeChange}
            />
          ))
        ) : (
          <View className="mt-20 items-center justify-center">
            <Text className="text-lg text-gray-500">No {activeTab.toLowerCase()} bookings.</Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavBar active="Bookings" />
    </View>
  );
};

export default MyBookingsScreen;
