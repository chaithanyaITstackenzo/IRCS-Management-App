import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { SearchBar } from '@/components/common/SearchBar';
import { FilterSheet, FilterSheetField } from '@/components/common/FilterSheet';
import { EmployeeListItem } from '@/components/employees/EmployeeListItem';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { useEmployees } from '@/hooks/useEmployees';
import { useDepartments } from '@/hooks/useDepartments';
import { useDesignations } from '@/hooks/useDesignations';
import { useShifts } from '@/hooks/useShifts';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Spacing } from '@/constants/spacing';

export default function EmployeesListScreen() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Record<string, string | undefined>>({});
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);

  const departments = useDepartments();
  const designations = useDesignations();
  const shifts = useShifts();

  const params = useMemo(
    () => ({
      name: search || undefined,
      department_id: filters.department_id,
      designation_id: filters.designation_id,
      shift_id: filters.shift_id,
      status: filters.status === undefined ? undefined : filters.status === 'active',
    }),
    [search, filters]
  );

  const { data, isLoading, isError, error, refetch, isRefetching } = useEmployees(params);
  const primary = useThemeColor({}, 'primary');
  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const filterFields: FilterSheetField[] = [
    {
      key: 'department_id',
      label: 'Department',
      options: (departments.data ?? []).map((d) => ({ label: d.name, value: d.id })),
    },
    {
      key: 'designation_id',
      label: 'Designation',
      options: (designations.data ?? []).map((d) => ({ label: d.name, value: d.id })),
    },
    { key: 'shift_id', label: 'Shift', options: (shifts.data ?? []).map((s) => ({ label: s.name, value: s.id })) },
    {
      key: 'status',
      label: 'Status',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
      ],
    },
  ];

  return (
    <ThemedView style={styles.flex}>
      <View style={styles.header}>
        <ThemedText variant="h1">Employees</ThemedText>
        <Pressable
          onPress={() => router.push('/(management)/employees/add')}
          style={[styles.addButton, { backgroundColor: primary }]}
          testID="add-employee-button"
        >
          <Ionicons name="add" size={22} color="#fff" />
        </Pressable>
      </View>

      <View style={styles.searchRow}>
        <View style={{ flex: 1 }}>
          <SearchBar value={search} onChangeText={setSearch} placeholder="Search employees..." />
        </View>
        <Pressable onPress={() => setFilterSheetOpen(true)} style={styles.filterButton}>
          <Ionicons name="options-outline" size={20} color={primary} />
          {activeFilterCount > 0 ? (
            <View style={[styles.filterBadge, { backgroundColor: primary }]}>
              <ThemedText variant="label" style={{ color: '#fff' }}>
                {activeFilterCount}
              </ThemedText>
            </View>
          ) : null}
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
          renderItem={({ item }) => <EmployeeListItem employee={item} />}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
          ListEmptyComponent={
            <EmptyState
              icon="people-outline"
              title="No employees found"
              description={search || activeFilterCount ? 'Try adjusting your search or filters.' : 'Add your first employee to get started.'}
              actionLabel={!search && !activeFilterCount ? 'Add Employee' : undefined}
              onAction={() => router.push('/(management)/employees/add')}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
  },
  addButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, padding: Spacing.xl, paddingBottom: Spacing.md },
  filterButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  filterBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: { paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xxxl },
});
