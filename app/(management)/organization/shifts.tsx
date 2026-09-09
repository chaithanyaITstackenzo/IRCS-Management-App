import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ui/ThemedView';
import { ShiftListItem } from '@/components/organization/ShiftListItem';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { useShifts } from '@/hooks/useShifts';
import { Spacing } from '@/constants/spacing';

export default function ShiftsScreen() {
  const { data, isLoading, isError, error, refetch } = useShifts();

  if (isLoading) return <LoadingSkeleton rows={5} />;
  if (isError) return <ErrorState error={error} onRetry={refetch} />;

  return (
    <ThemedView style={styles.flex}>
      <FlatList
        data={data ?? []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <ShiftListItem shift={item} />}
        ListEmptyComponent={<EmptyState icon="time-outline" title="No shifts configured" />}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  list: { padding: Spacing.xl, paddingBottom: Spacing.xxxl },
});
