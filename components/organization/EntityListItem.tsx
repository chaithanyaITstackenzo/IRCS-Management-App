import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from '../ui/ThemedText';
import { StatusBadge } from '../common/StatusBadge';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Radius, Spacing } from '@/constants/spacing';
import { EMPLOYEE_STATUS } from '@/constants/status';

interface Props {
  name: string;
  description?: string | null;
  status: boolean;
  employeeCount?: number;
  onPress: () => void;
  onToggleStatus?: () => void;
}

export function EntityListItem({ name, description, status, employeeCount, onPress, onToggleStatus }: Props) {
  const surface = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'border');
  const primary = useThemeColor({}, 'primary');

  return (
    <Pressable onPress={onPress} style={[styles.row, { backgroundColor: surface, borderColor: border }]}>
      <View style={styles.info}>
        <ThemedText variant="bodyStrong">{name}</ThemedText>
        {description ? (
          <ThemedText variant="caption" muted numberOfLines={1}>
            {description}
          </ThemedText>
        ) : null}
        {employeeCount !== undefined ? (
          <ThemedText variant="caption" muted>
            {employeeCount} employee{employeeCount === 1 ? '' : 's'}
          </ThemedText>
        ) : null}
      </View>
      <View style={styles.actions}>
        <StatusBadge meta={EMPLOYEE_STATUS[String(status) as 'true' | 'false']} />
        {status && onToggleStatus ? (
          <Pressable onPress={onToggleStatus} hitSlop={8}>
            <ThemedText variant="caption" style={{ color: primary, marginTop: Spacing.xs }}>
              Deactivate
            </ThemedText>
          </Pressable>
        ) : null}
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
  info: { flex: 1, gap: 2, marginRight: Spacing.md },
  actions: { alignItems: 'flex-end' },
});
