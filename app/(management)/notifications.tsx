import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { useMarkNotificationAsRead, useNotifications } from '@/hooks/useManagementRequests';
import { Notification } from '@/types/managementRequests';
import { Spacing } from '@/constants/spacing';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function NotificationsScreen() {
  const { data = [], isLoading, isError, error, refetch, isRefetching } = useNotifications();
  const markAsReadMutation = useMarkNotificationAsRead();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const border = useThemeColor({}, 'border');
  const primary = useThemeColor({}, 'primary');
  const surface = useThemeColor({}, 'surface');
  const text = useThemeColor({}, 'text');

  const filteredData = useMemo(() => {
    if (filter === 'unread') return data.filter((item) => !item.is_read);
    return data;
  }, [data, filter]);

  if (isLoading) return <LoadingSkeleton rows={5} />;
  if (isError) return <ErrorState error={error} onRetry={refetch} />;

  return (
    <ThemedView style={styles.flex}>
      <View style={styles.filterBar}>
        {(['all', 'unread'] as const).map((value) => {
          const active = filter === value;
          return (
            <Pressable
              key={value}
              onPress={() => setFilter(value)}
              style={[styles.filterChip, { backgroundColor: active ? primary : surface, borderColor: border }]}
            >
              <ThemedText variant="captionStrong" style={{ color: active ? '#fff' : text }}>
                {value === 'all' ? 'All' : 'Unread'}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
        renderItem={({ item }) => <NotificationItem item={item} border={border} primary={primary} markAsReadMutation={markAsReadMutation} />}
        ListEmptyComponent={<EmptyState icon="notifications-off-outline" title="No notifications" description={filter === 'unread' ? 'You have no unread notifications.' : 'You do not have any updates yet.'} />}
      />
    </ThemedView>
  );
}

function NotificationItem({ item, border, primary, markAsReadMutation }: { item: Notification; border: string; primary: string; markAsReadMutation: ReturnType<typeof useMarkNotificationAsRead> }) {
  const read = item.is_read;

  const openNotification = () => {
    if (!item.is_read) {
      markAsReadMutation.mutate({ notificationId: item.id });
    }

    const id = item.attendance_request_id ?? item.request_id ?? item.requestId ?? item.reference_id ?? item.referenceId ?? item.attendance_id ?? item.id;
    const screen = (item.screen ?? '').toLowerCase();
    const type = (item.type ?? '').toLowerCase();

    if (item.attendance_request_id || item.request_id || item.requestId || type.includes('request')) {
      router.push(`/(management)/requests/${String(id)}`);
      return;
    }

    if (item.attendance_id || type.includes('attendance')) {
      router.push(`/(management)/attendance/${String(id)}`);
      return;
    }

    if (screen.includes('speaker') || type.includes('speaker')) {
      router.push('/(management)/infrastructure/speakers');
      return;
    }

    if (screen.includes('payroll') || type.includes('payroll') || type.includes('salary')) {
      router.push('/(management)/reports/payroll');
      return;
    }

    if (screen.includes('requests')) {
      router.push('/(management)/(tabs)/requests');
      return;
    }

    if (screen.includes('attendance')) {
      router.push('/(management)/attendance/history');
      return;
    }

    router.push('/(management)/(tabs)/requests');
  };

  return (
    <Pressable onPress={openNotification} style={[styles.card, { borderColor: border, backgroundColor: read ? 'transparent' : `${primary}10` }]}>
      <View style={styles.row}>
        <Ionicons name={read ? 'mail-open-outline' : 'mail-unread-outline'} size={20} color={primary} />
        <View style={styles.textWrap}>
          <ThemedText variant="bodyStrong">{item.type ?? 'Notification'}</ThemedText>
          <ThemedText variant="body" style={styles.message}>{item.message}</ThemedText>
          <ThemedText variant="caption" muted>
            {new Date(item.timestamp).toLocaleString()}
          </ThemedText>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    gap: Spacing.sm,
  },
  filterChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  list: { padding: Spacing.xl, paddingBottom: Spacing.xxxl },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  textWrap: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  message: {
    marginTop: Spacing.xs,
    marginBottom: Spacing.xs,
  },
});
