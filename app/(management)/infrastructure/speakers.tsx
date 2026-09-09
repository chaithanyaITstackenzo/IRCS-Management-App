import React from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ui/ThemedView';
import { SpeakerListItem } from '@/components/infrastructure/SpeakerListItem';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { useSpeakers } from '@/hooks/useSpeakers';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Spacing } from '@/constants/spacing';

export default function SpeakersScreen() {
  const { data, isLoading, isError, error, refetch, isRefetching } = useSpeakers();
  const primary = useThemeColor({}, 'primary');

  return (
    <ThemedView style={styles.flex}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.push('/(management)/infrastructure/speaker/new')}
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
          renderItem={({ item }) => <SpeakerListItem speaker={item} />}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
          ListEmptyComponent={
            <EmptyState
              icon="volume-high-outline"
              title="No speakers configured"
              actionLabel="Add Speaker"
              onAction={() => router.push('/(management)/infrastructure/speaker/new')}
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
