import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { Card } from '@/components/ui/Card';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { useAttendanceRecord } from '@/hooks/useAttendance';
import { Spacing } from '@/constants/spacing';
import { formatDate, formatDuration, formatTime } from '@/utils/date';

// Only renders fields that actually exist in the API response (spec §23) —
// never fabricates missing values.
export default function AttendanceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: record, isLoading, isError, error, refetch } = useAttendanceRecord(id);

  if (isLoading) return <LoadingSkeleton rows={5} />;
  if (isError || !record) return <ErrorState error={error} onRetry={refetch} />;

  const name = record.employee
    ? `${record.employee.first_name} ${record.employee.last_name ?? ''}`.trim()
    : 'Employee';

  return (
    <ThemedView style={styles.flex}>
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.section}>
          <ThemedText variant="h2">{name}</ThemedText>
          <ThemedText variant="body" muted>
            {formatDate(record.attendance_date)}
          </ThemedText>
        </Card>

        <Card style={styles.section}>
          <Row label="IN" value={formatTime(record.in_time)} />
          <Row label="OUT" value={formatTime(record.out_time)} />
          <Row label="Hours Worked" value={formatDuration(record.total_hours_worked)} />
        </Card>

        <Card style={styles.section}>
          <Row label="Late" value={record.in_time_late ? 'Yes' : 'No'} />
          {record.in_time_late && record.in_time_late_reason ? (
            <Row label="Late Reason" value={record.in_time_late_reason} />
          ) : null}
          <Row label="CCTV IN" value={record.cctv_in ? 'Yes' : 'No'} />
          <Row label="CCTV OUT" value={record.cctv_out ? 'Yes' : 'No'} />
        </Card>

        <Card style={styles.section}>
          <ThemedText variant="h3" style={{ marginBottom: Spacing.sm }}>
            Outside Attendance
          </ThemedText>
          <Row label="IN Outside" value={record.in_time_outside ? 'Yes' : 'No'} />
          {record.in_time_outside ? (
            <Row label="Approved" value={record.in_time_outside_approved ? 'Yes' : record.in_time_outside_approved === false ? 'No' : 'Pending'} />
          ) : null}
          <Row label="OUT Outside" value={record.out_time_outside ? 'Yes' : 'No'} />
          {record.out_time_outside ? (
            <Row label="Approved" value={record.out_time_outside_approved ? 'Yes' : record.out_time_outside_approved === false ? 'No' : 'Pending'} />
          ) : null}
        </Card>

        <Card style={styles.section}>
          <ThemedText variant="h3" style={{ marginBottom: Spacing.sm }}>
            Early Going
          </ThemedText>
          <Row label="Early Going" value={record.early_going ? 'Yes' : 'No'} />
          {record.early_going && record.early_going_reason ? (
            <Row label="Reason" value={record.early_going_reason} />
          ) : null}
          {record.early_going ? (
            <Row
              label="Approved"
              value={record.early_going_approved ? 'Yes' : record.early_going_approved === false ? 'No' : 'Pending'}
            />
          ) : null}
        </Card>

        {record.out_time_permission ? (
          <Card style={styles.section}>
            <ThemedText variant="h3" style={{ marginBottom: Spacing.sm }}>
              OUT Permission
            </ThemedText>
            <Row label="Requested" value="Yes" />
            <Row
              label="Approved"
              value={record.out_time_permission_approved ? 'Yes' : record.out_time_permission_approved === false ? 'No' : 'Pending'}
            />
            {record.out_time_permission_reason ? <Row label="Reason" value={record.out_time_permission_reason} /> : null}
          </Card>
        ) : null}
      </ScrollView>
    </ThemedView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <ThemedText variant="body" muted>
        {label}
      </ThemedText>
      <ThemedText variant="bodyStrong">{value}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: Spacing.xl, paddingBottom: Spacing.xxxl, gap: Spacing.lg },
  section: { gap: Spacing.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
