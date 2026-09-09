import React from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { AttendanceCard } from '@/components/attendance/AttendanceCard';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { useTodayAttendance } from '@/hooks/useAttendance';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Spacing } from '@/constants/spacing';

export default function TodayAttendanceScreen() {
  const { data, isLoading, isError, error, refetch, isRefetching } = useTodayAttendance();
  const primary = useThemeColor({}, 'primary');

  return (
    <ThemedView style={styles.flex}>
      <View style={styles.header}>
        <ThemedText variant="h1">Today&apos;s Attendance</ThemedText>
        <Pressable onPress={() => router.push('/(management)/attendance/history')}>
          <ThemedText variant="bodyStrong" style={{ color: primary }}>
            History
          </ThemedText>
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
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
          ListEmptyComponent={<EmptyState icon="calendar-outline" title="No attendance records found" />}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.xl,
  },
  list: { paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xxxl },
});
