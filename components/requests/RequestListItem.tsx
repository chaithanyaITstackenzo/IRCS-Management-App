import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '../ui/ThemedText';
import { StatusBadge } from '../common/StatusBadge';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Radius, Spacing } from '@/constants/spacing';
import { REQUEST_STATUS, REQUEST_TYPE_LABEL } from '@/constants/status';
import { AttendanceRequest } from '@/types/request';
import { formatDate } from '@/utils/date';

export function RequestListItem({ request }: { request: AttendanceRequest }) {
  const surface = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'border');
  const name = request.employee
    ? `${request.employee.first_name} ${request.employee.last_name ?? ''}`.trim()
    : 'Employee';

  return (
    <Pressable
      onPress={() => router.push(`/(management)/requests/${request.id}`)}
      style={[styles.row, { backgroundColor: surface, borderColor: border }]}
    >
      <View style={styles.info}>
        <ThemedText variant="bodyStrong">{name}</ThemedText>
        <ThemedText variant="caption" muted>
          {REQUEST_TYPE_LABEL[request.request_type] ?? request.request_type} · {formatDate(request.created_at)}
        </ThemedText>
        <ThemedText variant="caption" muted numberOfLines={2}>
          {request.reason}
        </ThemedText>
      </View>
      <StatusBadge meta={REQUEST_STATUS[request.status]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: Spacing.sm,
  },
  info: { flex: 1, gap: 2 },
});
