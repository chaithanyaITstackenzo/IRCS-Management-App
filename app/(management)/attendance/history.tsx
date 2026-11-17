import React, { useMemo, useState } from 'react';
import { FlatList, Platform, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { AttendanceCard } from '@/components/attendance/AttendanceCard';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { useAttendanceHistory } from '@/hooks/useAttendance';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Spacing } from '@/constants/spacing';
import { formatDate, toDateInputValue, todayInputValue } from '@/utils/date';

type HistoryFilter = 'today' | 'week' | 'month' | 'date';

export default function AttendanceHistoryScreen() {
  const [selectedFilter, setSelectedFilter] = useState<HistoryFilter>('today');
  const [selectedDate, setSelectedDate] = useState(todayInputValue());
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const params = useMemo(
    () => selectedFilter === 'date'
      ? { filter: 'all' as const, date: selectedDate, page: 1, limit: 50 }
      : { filter: selectedFilter, page: 1, limit: 50 },
    [selectedFilter, selectedDate]
  );

  const { data, isLoading, isError, error, refetch } = useAttendanceHistory(params);
  const primary = useThemeColor({}, 'primary');
  const border = useThemeColor({}, 'border');
  const text = useThemeColor({}, 'text');
  const surface = useThemeColor({}, 'surface');

  return (
    <ThemedView style={styles.flex}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filters}
      >
        <FilterTab label="Today" active={selectedFilter === 'today'} onPress={() => setSelectedFilter('today')} />
        <FilterTab label="This Week" active={selectedFilter === 'week'} onPress={() => setSelectedFilter('week')} />
        <FilterTab label="This Month" active={selectedFilter === 'month'} onPress={() => setSelectedFilter('month')} />
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: selectedFilter === 'date' }}
          onPress={() => setDatePickerOpen(true)}
          style={[
            styles.filterTab,
            {
              backgroundColor: selectedFilter === 'date' ? primary : surface,
              borderColor: selectedFilter === 'date' ? primary : border,
            },
          ]}
        >
          <Ionicons name="calendar-outline" size={16} color={selectedFilter === 'date' ? '#fff' : primary} />
          <ThemedText
            variant="caption"
            style={{ color: selectedFilter === 'date' ? '#fff' : text }}
          >
            {selectedFilter === 'date' ? formatDate(selectedDate) : 'Select Date'}
          </ThemedText>
        </Pressable>
      </ScrollView>

      {datePickerOpen ? (
        <DateTimePicker
          value={new Date(`${selectedDate}T12:00:00`)}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          maximumDate={new Date()}
          onChange={(event, date) => {
            if (event.type === 'dismissed' || !date) {
              setDatePickerOpen(false);
              return;
            }
            setSelectedDate(toDateInputValue(date));
            setSelectedFilter('date');
            setDatePickerOpen(false);
          }}
        />
      ) : null}

      {isLoading ? (
        <LoadingSkeleton rows={6} />
      ) : isError ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : (
        <FlatList
          data={data ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <ThemedText variant="caption" muted style={styles.count}>
              {data?.length ?? 0} attendance records
            </ThemedText>
          }
          renderItem={({ item }) => <AttendanceCard record={item} />}
          ListEmptyComponent={
            <EmptyState
              icon="calendar-outline"
              title="No attendance records found"
              description="Try selecting a different period or date."
            />
          }
        />
      )}
    </ThemedView>
  );
}

function FilterTab({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  const primary = useThemeColor({}, 'primary');
  const border = useThemeColor({}, 'border');
  const surface = useThemeColor({}, 'surface');
  const text = useThemeColor({}, 'text');

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={[
        styles.filterTab,
        { backgroundColor: active ? primary : surface, borderColor: active ? primary : border },
      ]}
    >
      <ThemedText variant="caption" style={{ color: active ? '#fff' : text }}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  filters: { alignItems: 'center', gap: Spacing.sm, paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md },
  filterTab: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: 999,
    borderWidth: 1,
  },
  list: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.md, paddingBottom: Spacing.xxxl },
  count: { marginBottom: Spacing.md },
});
