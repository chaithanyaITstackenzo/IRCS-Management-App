import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '../ui/ThemedText';
import { StatusBadge } from '../common/StatusBadge';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Radius, Spacing } from '@/constants/spacing';
import { EMPLOYEE_STATUS } from '@/constants/status';
import { Shift } from '@/types/shift';
import { formatShiftRange, shiftTypeLabel } from '@/utils/shift';

interface Props {
  shift: Shift;
  onPress?: () => void;
  onDelete?: () => void;
}

export function ShiftListItem({ shift, onPress, onDelete }: Props) {
  const surface = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'border');
  const info = useThemeColor({}, 'info');
  const isOvernight = shiftTypeLabel(shift) === 'Overnight';

  return (
    <Pressable onPress={onPress} style={[styles.row, { backgroundColor: surface, borderColor: border }]}>
      <View style={styles.info}>
        <View style={styles.titleRow}>
          <ThemedText variant="bodyStrong">{shift.name}</ThemedText>
          {isOvernight ? (
            <ThemedText variant="label" style={{ color: info, marginLeft: Spacing.sm }}>
              OVERNIGHT
            </ThemedText>
          ) : null}
        </View>
        <ThemedText variant="caption" muted>
          {formatShiftRange(shift)}
        </ThemedText>
      </View>
      <View style={styles.actions}>
        <StatusBadge meta={EMPLOYEE_STATUS[String(shift.status) as 'true' | 'false']} />
        <View style={styles.iconActions}>
          <Pressable accessibilityLabel={`Edit ${shift.name}`} onPress={onPress} hitSlop={8} style={styles.iconButton}>
            <Ionicons name="create-outline" size={20} color={info} />
          </Pressable>
          <Pressable accessibilityLabel={`Delete ${shift.name}`} onPress={onDelete} hitSlop={8} style={styles.iconButton}>
            <Ionicons name="trash-outline" size={20} color="#DC2626" />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: Spacing.sm,
  },
  info: { flex: 1, marginRight: Spacing.md },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  actions: { alignItems: 'flex-end' },
  iconActions: { flexDirection: 'row', marginTop: Spacing.sm },
  iconButton: { paddingLeft: Spacing.md },
});
