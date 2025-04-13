import { useSync } from './SyncProvider';

function MyComponent() {
  const { state, sync } = useSync();

  const handleManualSync = async () => {
    try {
      const result = await sync();
      if (result.success) {
        // Show success message
        console.log(
          `Synced ${result.pullCount} items from server and pushed ${result.pushCount} changes`
        );
      } else {
        // Show error message
        console.error('Sync failed:', result.error);
      }
    } catch (error) {
      console.error('Error during sync:', error);
    }
  };

  return (
    <View>
      <Text>Last synced: {state.lastSyncedAt?.toLocaleString()}</Text>
      <Button
        title={state.isSyncing ? 'Syncing...' : 'Sync Now'}
        onPress={handleManualSync}
        disabled={state.isSyncing}
      />
      {state.error && <Text style={{ color: 'red' }}>Error: {state.error.message}</Text>}
    </View>
  );
}
