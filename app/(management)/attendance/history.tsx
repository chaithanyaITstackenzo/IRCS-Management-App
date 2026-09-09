import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ui/ThemedView';
import { AttendanceCard } from '@/components/attendance/AttendanceCard';
import { FilterSheet, FilterSheetField } from '@/components/common/FilterSheet';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { useAttendanceHistory } from '@/hooks/useAttendance';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Spacing } from '@/constants/spacing';

export default function AttendanceHistoryScreen() {
  const [filters, setFilters] = useState<Record<string, string | undefined>>({});
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);

  const params = useMemo(
    () => ({ filter: (filters.filter as 'today' | 'week' | 'month' | 'all') ?? 'all', page: 1, limit: 50 }),
    [filters]
  );

  const { data, isLoading, isError, error, refetch } = useAttendanceHistory(params);
  const primary = useThemeColor({}, 'primary');
  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const filterFields: FilterSheetField[] = [
    {
      key: 'filter',
      label: 'Period',
      options: [
        { label: 'Today', value: 'today' },
        { label: 'This week', value: 'week' },
        { label: 'This month', value: 'month' },
        { label: 'All', value: 'all' },
      ],
    },
  ];

  return (
    <ThemedView style={styles.flex}>
      <View style={styles.header}>
        <Pressable onPress={() => setFilterSheetOpen(true)} style={styles.filterButton}>
          <Ionicons name="options-outline" size={20} color={primary} />
        </Pressable>
      </View>

      {isLoading ? (
        <LoadingSkeleton rows={6} />
      ) : isError ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : (
        <FlatList
          data={data ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <AttendanceCard record={item} />}
          ListEmptyComponent={
            <EmptyState
              icon="calendar-outline"
              title="No attendance records found"
              description={activeFilterCount ? 'Try adjusting your filters.' : undefined}
            />
          }
        />
      )}

      <FilterSheet
        visible={filterSheetOpen}
        fields={filterFields}
        values={filters}
        onApply={setFilters}
        onClose={() => setFilterSheetOpen(false)}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'flex-end', padding: Spacing.lg, paddingBottom: 0 },
  filterButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  list: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.md, paddingBottom: Spacing.xxxl },
});
