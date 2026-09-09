import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '../ui/ThemedText';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Radius, Spacing } from '@/constants/spacing';
import { AttendanceRecord } from '@/types/attendance';
import { formatDuration, formatTime } from '@/utils/date';

export function AttendanceCard({ record }: { record: AttendanceRecord }) {
  const surface = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'border');
  const warning = useThemeColor({}, 'warning');
  const success = useThemeColor({}, 'success');
  const name = record.employee
    ? `${record.employee.first_name} ${record.employee.last_name ?? ''}`.trim()
    : 'Employee';

  return (
    <Pressable
      onPress={() => router.push(`/(management)/attendance/${record.id}`)}
      style={[styles.row, { backgroundColor: surface, borderColor: border }]}
    >
      <View style={styles.header}>
        <ThemedText variant="bodyStrong">{name}</ThemedText>
        {record.in_time_late ? (
          <ThemedText variant="caption" style={{ color: warning }}>
            Late
          </ThemedText>
        ) : record.in_time ? (
          <ThemedText variant="caption" style={{ color: success }}>
            On time
          </ThemedText>
        ) : null}
      </View>
      <View style={styles.grid}>
        <Field label="IN" value={formatTime(record.in_time)} />
        <Field label="OUT" value={formatTime(record.out_time)} />
        <Field label="Hours" value={formatDuration(record.total_hours_worked)} />
      </View>
    </Pressable>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <View>
      <ThemedText variant="caption" muted>
        {label}
      </ThemedText>
      <ThemedText variant="bodyStrong">{value}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  grid: { flexDirection: 'row', justifyContent: 'space-between' },
});
