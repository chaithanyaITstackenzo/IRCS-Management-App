import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '../ui/ThemedText';
import { Button } from '../ui/Button';
import { StatusBadge } from '../common/StatusBadge';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Radius, Spacing } from '@/constants/spacing';
import { REQUEST_STATUS } from '@/constants/status';
import { WorkoffRequest } from '@/types/managementRequests';
import { formatDateTime } from '@/utils/date';

interface WorkoffRequestListItemProps {
  item: WorkoffRequest;
  canDecide: boolean;
  busy: boolean;
  onApprove: () => void;
  onReject: () => void;
  history?: boolean;
}

export function WorkoffRequestListItem({ item, canDecide, busy, onApprove, onReject, history = false }: WorkoffRequestListItemProps) {
  const surface = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'border');

  return (
    <View style={[styles.row, { backgroundColor: surface, borderColor: border }]}>
      <View style={styles.info}>
        <ThemedText variant="bodyStrong">{item.employee_name}</ThemedText>
        <ThemedText variant="caption" muted>
          Sunday work · {item.worked_date}
        </ThemedText>
        <ThemedText variant="caption" muted numberOfLines={2}>{item.reason}</ThemedText>
        {history ? <ThemedText variant="caption" muted>{item.status === 'APPROVED' ? 'Approved' : 'Rejected'} by {item.approved_by ?? '—'} · {formatDateTime(item.approved_at ?? item.updated_at)}</ThemedText> : null}
      </View>
      <StatusBadge meta={REQUEST_STATUS[item.status] ?? REQUEST_STATUS.PENDING} />
      {canDecide && !history ? (
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