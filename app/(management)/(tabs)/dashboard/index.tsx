import React from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { Button } from '@/components/ui/Button';
import { StatCard } from '@/components/common/StatCard';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { useManagementDashboard } from '@/hooks/useDashboard';
import { Spacing } from '@/constants/spacing';
import { formatDateTime } from '@/utils/date';

export default function DashboardScreen() {
  const { data, isLoading, isError, error, refetch, isRefetching, dataUpdatedAt } = useManagementDashboard();

  const greeting = getGreeting();

  return (
    <ThemedView style={styles.flex}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
      >
        <ThemedText variant="caption" muted>
          {greeting}
        </ThemedText>
        <ThemedText variant="h1" style={styles.title}>
          Management Dashboard
        </ThemedText>

        {isLoading ? (
          <LoadingSkeleton rows={4} />
        ) : isError ? (
          <ErrorState error={error} onRetry={refetch} />
        ) : data ? (
          <>
            <View style={styles.grid}>
              <StatCard label="Total Employees" value={data.total_employees} icon="people-outline" />
              <StatCard label="Present" value={data.present} icon="checkmark-circle-outline" tone="success" />
              <StatCard label="Absent" value={data.absent} icon="close-circle-outline" tone="error" />
              <StatCard label="Late" value={data.late} icon="time-outline" tone="warning" />
              <StatCard label="Currently Inside" value={data.currently_inside} icon="business-outline" tone="info" />
              <StatCard
                label="Pending Requests"
                value={data.pending_requests}
                icon="document-text-outline"
                tone="warning"
              />
            </View>

            {dataUpdatedAt ? (
              <ThemedText variant="caption" muted style={styles.updated}>
                Last updated {formatDateTime(new Date(dataUpdatedAt).toISOString())}
              </ThemedText>
            ) : null}

            <View style={styles.quickActions}>
              <ThemedText variant="h3" style={{ marginBottom: Spacing.md }}>
                Quick Actions
              </ThemedText>
              <QuickAction label="Review Pending Requests" onPress={() => router.push('/(management)/(tabs)/requests')} />
              <QuickAction label="Add Employee" onPress={() => router.push('/(management)/employees/add')} />
            </View>
          </>
        ) : null}
      </ScrollView>
    </ThemedView>
  );
}

function QuickAction({ label, onPress }: { label: string; onPress: () => void }) {
  return <Button label={label} onPress={onPress} style={styles.quickActionItem} />;
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: Spacing.xl, paddingBottom: Spacing.xxxl },
  title: { marginBottom: Spacing.xl },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
  updated: { marginTop: Spacing.lg },
  quickActions: { marginTop: Spacing.xxl },
  quickActionItem: { marginBottom: Spacing.sm },
});
