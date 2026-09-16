import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import Toast from 'react-native-toast-message';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useEmployee, useDeactivateEmployee } from '@/hooks/useEmployees';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Spacing } from '@/constants/spacing';
import { EMPLOYEE_STATUS, ENROLLMENT_STATUS } from '@/constants/status';
import { formatEmployeeName, formatCurrencyINR, formatEmploymentType, initials } from '@/utils/formatters';
import { formatDate } from '@/utils/date';
import { formatShiftRange } from '@/utils/shift';
import { getReadableErrorMessage } from '@/utils/errorMessages';
import { canManageEmployees, canStartEnrollment, canViewPayroll } from '@/utils/permissions';
import { useAuthStore } from '@/store/authStore';

export default function EmployeeDetailScreen() {
  const { id: routeId } = useLocalSearchParams<{ id?: string | string[] }>();
  const id = Array.isArray(routeId) ? routeId[0] : routeId;
  const { data: employee, isLoading, isError, error, refetch } = useEmployee(id ?? '');
  const deactivate = useDeactivateEmployee();
  const [confirmVisible, setConfirmVisible] = useState(false);
  const { user } = useAuthStore();

  const primary = useThemeColor({}, 'primary');
  const primaryMuted = useThemeColor({}, 'primaryMuted');

  if (isLoading) return <LoadingSkeleton rows={6} />;
  if (isError || !employee) return <ErrorState error={error} onRetry={refetch} />;

  const name = formatEmployeeName(employee);
  const enrollmentStatus = employee.enrollment_status ?? 'NOT_STARTED';

  const handleStatusToggle = () => {
    deactivate.mutate(
      employee.id,
      {
        onSuccess: () => {
          Toast.show({ type: 'success', text1: 'Employee deactivated' });
          setConfirmVisible(false);
        },
        onError: (err) => {
          Toast.show({ type: 'error', text1: 'Unable to update status', text2: getReadableErrorMessage(err) });
          setConfirmVisible(false);
        },
      }
    );
  };

  return (
    <ThemedView style={styles.flex}>
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.headerCard}>
          {employee.profile_photo_url ? (
            <Image source={{ uri: employee.profile_photo_url }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarFallback, { backgroundColor: primaryMuted }]}>
              <ThemedText variant="h2" style={{ color: primary }}>
                {initials(name)}
              </ThemedText>
            </View>
          )}
          <ThemedText variant="h2" style={styles.name}>
            {name}
          </ThemedText>
          <ThemedText variant="body" muted>
            {employee.employee_code}
          </ThemedText>
          <StatusBadge meta={EMPLOYEE_STATUS[String(employee.status) as 'true' | 'false']} />
        </Card>

        <Card style={styles.section}>
          <ThemedText variant="h3" style={styles.sectionTitle}>
            Employment Information
          </ThemedText>
          <Row label="Department" value={employee.department?.name ?? '—'} />
          <Row label="Designation" value={employee.designation?.name ?? '—'} />
          <Row label="Role" value={employee.role?.role_name ?? '—'} />
          <Row label="Shift" value={employee.shift ? `${employee.shift.name} · ${formatShiftRange(employee.shift)}` : '—'} />
          <Row label="Employment Type" value={formatEmploymentType(employee.employment_type)} />
          <Row label="Joining Date" value={formatDate(employee.joining_date)} />
          {canManageEmployees(user?.role) ? (
            <Row label="Salary" value={formatCurrencyINR(employee.salary)} />
          ) : null}
        </Card>

        <Card style={styles.section}>
          <ThemedText variant="h3" style={styles.sectionTitle}>
            Contact
          </ThemedText>
          <Row label="Email" value={employee.email} />
          <Row label="Mobile" value={employee.mobile} />
        </Card>

        <Card style={styles.section}>
          <View style={styles.rowBetween}>
            <ThemedText variant="h3">Face Enrollment</ThemedText>
            <StatusBadge meta={ENROLLMENT_STATUS[enrollmentStatus]} />
          </View>
          {canStartEnrollment(user?.role) ? (
            <Button
              label={enrollmentStatus === 'NOT_STARTED' ? 'Start Enrollment' : 'View Enrollment'}
              variant="secondary"
              style={{ marginTop: Spacing.md }}
              onPress={() => router.push(`/(management)/employees/enrollment/${employee.id}`)}
            />
          ) : null}
        </Card>

        {canManageEmployees(user?.role) ? (
          <View style={styles.actions}>
            <Button
              label="Edit Employee"
              variant="secondary"
              style={styles.actionBtn}
              onPress={() => router.push(`/(management)/employees/edit/${employee.id}`)}
            />
            <Button
              label="Deactivate"
              variant="danger"
              style={styles.actionBtn}
              onPress={() => setConfirmVisible(true)}
              disabled={!employee.status}
            />
          </View>
        ) : null}

        {canViewPayroll(user?.role) ? (
          <Button
            label="Salary Report"
            variant="secondary"
            onPress={() => router.push({ pathname: '/(management)/reports/payroll', params: { employeeId: employee.id } })}
          />
        ) : null}
      </ScrollView>

      <ConfirmDialog
        visible={confirmVisible}
        title="Deactivate Employee?"
        description="This employee will no longer be active in the system."
        confirmLabel="Deactivate"
        confirmingLabel="Saving..."
        destructive
        loading={deactivate.isPending}
        onConfirm={handleStatusToggle}
        onCancel={() => setConfirmVisible(false)}
      />
    </ThemedView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.rowBetween}>
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
  headerCard: { alignItems: 'center', gap: Spacing.xs },
  avatar: { width: 72, height: 72, borderRadius: 36, marginBottom: Spacing.sm },
  avatarFallback: { alignItems: 'center', justifyContent: 'center' },
  name: { marginTop: Spacing.xs },
  section: { gap: Spacing.md },
  sectionTitle: { marginBottom: Spacing.xs },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  actions: { flexDirection: 'row', gap: Spacing.md },
  actionBtn: { flex: 1 },
});
