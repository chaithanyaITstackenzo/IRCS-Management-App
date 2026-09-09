import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '../ui/ThemedText';
import { Button } from '../ui/Button';
import { StatusBadge } from '../common/StatusBadge';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Radius, Spacing } from '@/constants/spacing';
import { REQUEST_STATUS } from '@/constants/status';
import { LeaveRequestItem } from '@/types/managementRequests';

interface LeaveRequestListItemProps {
  item: LeaveRequestItem;
  canDecide: boolean;
  busy: boolean;
  onApprove: () => void;
  onReject: () => void;
}

export function LeaveRequestListItem({ item, canDecide, busy, onApprove, onReject }: LeaveRequestListItemProps) {
  const surface = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'border');
  const leave = item.leave;

  return (
    <View style={[styles.row, { backgroundColor: surface, borderColor: border }]}>
      <View style={styles.info}>
        <ThemedText variant="bodyStrong">{item.employee.name}</ThemedText>
        <ThemedText variant="caption" muted>
          {String(leave.from_date ?? '')} to {String(leave.to_date ?? '')} · {String(leave.total_days ?? '')} day(s)
        </ThemedText>
        <ThemedText variant="caption" muted numberOfLines={2}>
          {String(leave.reason ?? '')}
        </ThemedText>
      </View>
      <StatusBadge meta={REQUEST_STATUS[String(leave.status)] ?? REQUEST_STATUS.PENDING} />
      {canDecide ? (
        <View style={styles.actions}>
          <Button label="Reject" variant="danger" onPress={onReject} disabled={busy} style={styles.action} />
          <Button label="Approve" onPress={onApprove} disabled={busy} style={styles.action} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { borderRadius: Radius.lg, borderWidth: StyleSheet.hairlineWidth, padding: Spacing.md, marginBottom: Spacing.sm, gap: Spacing.sm },
  info: { gap: 2 },
  actions: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.xs },
  action: { flex: 1, minHeight: 42 },
});