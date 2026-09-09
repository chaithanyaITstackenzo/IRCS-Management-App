import React from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ui/ThemedView';
import { CameraListItem } from '@/components/infrastructure/CameraListItem';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { useCameras } from '@/hooks/useCameras';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Spacing } from '@/constants/spacing';

// Cameras are rendered purely from the API response — never hardcode
// CAM001..CAM006 here (spec §29/§65/§86). Adding CAM007+ requires zero frontend changes.
export default function CamerasScreen() {
  const { data, isLoading, isError, error, refetch, isRefetching } = useCameras();
  const primary = useThemeColor({}, 'primary');

  return (
    <ThemedView style={styles.flex}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.push('/(management)/infrastructure/camera/new')}
          style={[styles.addButton, { backgroundColor: primary }]}
        >
          <Ionicons name="add" size={22} color="#fff" />
        </Pressable>
      </View>

      {isLoading ? (
        <LoadingSkeleton rows={5} />
      ) : isError ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : (
        <FlatList
          data={data ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <CameraListItem camera={item} />}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
          ListEmptyComponent={
            <EmptyState
              icon="videocam-outline"
              title="No cameras configured"
              actionLabel="Add Camera"
              onAction={() => router.push('/(management)/infrastructure/camera/new')}
            />
          }
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'flex-end', padding: Spacing.xl, paddingBottom: 0 },
  addButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  list: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.md, paddingBottom: Spacing.xxxl },
});
