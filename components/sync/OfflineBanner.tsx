import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDatabase } from '../../lib/database.tsx';

export default function OfflineBanner() {
  const { lastSyncedAt, syncDatabase } = useDatabase();

  // Format last synced time
  const lastSyncText = lastSyncedAt
    ? `Last synced: ${formatLastSynced(lastSyncedAt)}`
    : 'Not synced yet';

  return (
    <View className="flex-row items-center justify-between bg-yellow-500 px-4 py-2">
      <View className="flex-row items-center">
        <Ionicons name="cloud-offline-outline" size={18} color="#fff" />
        <Text className="ml-2 font-medium text-white">You're offline</Text>
      </View>

      <View className="flex-row items-center">
        <Text className="mr-3 text-xs text-white">{lastSyncText}</Text>
        <TouchableOpacity onPress={syncDatabase} className="rounded-full bg-yellow-600 px-3 py-1">
          <Text className="text-xs text-white">Sync When Online</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Helper to format last synced time in human-readable format
function formatLastSynced(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.round(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}
