import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { ThemedText } from '../ui/ThemedText';
import { StatusBadge } from '../common/StatusBadge';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Radius, Spacing } from '@/constants/spacing';
import { EMPLOYEE_STATUS } from '@/constants/status';
import { EmployeeListItemSummary } from '@/types/employee';
import { formatEmployeeName, initials } from '@/utils/formatters';

export function EmployeeListItem({ employee }: { employee: EmployeeListItemSummary }) {
  const surface = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'border');
  const primaryMuted = useThemeColor({}, 'primaryMuted');
  const primary = useThemeColor({}, 'primary');
  const name = formatEmployeeName(employee);

  return (
    <Pressable
      onPress={() => router.push(`/(management)/employees/${employee.id}`)}
      style={[styles.row, { backgroundColor: surface, borderColor: border }]}
    >
      {employee.profile_photo_url ? (
        <Image source={{ uri: employee.profile_photo_url }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, styles.avatarFallback, { backgroundColor: primaryMuted }]}>
          <ThemedText variant="bodyStrong" style={{ color: primary }}>
            {initials(name)}
          </ThemedText>
        </View>
      )}
      <View style={styles.info}>
        <ThemedText variant="bodyStrong">{name}</ThemedText>
        <ThemedText variant="caption" muted>
          {employee.employee_code} · {employee.designation?.name ?? '—'}
        </ThemedText>
        <ThemedText variant="caption" muted>
          {employee.department?.name ?? '—'}
        </ThemedText>
      </View>
      <StatusBadge meta={EMPLOYEE_STATUS[String(employee.status) as 'true' | 'false']} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: Spacing.sm,
  },
  avatar: { width: 44, height: 44, borderRadius: 22 },
  avatarFallback: { alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1, gap: 2 },
});
