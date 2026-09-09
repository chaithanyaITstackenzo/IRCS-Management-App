import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import { ThemedView } from '@/components/ui/ThemedView';
import { MonthField } from '@/components/ui/MonthField';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { ReportResultView } from '@/components/common/ReportResultView';
import { useMonthlyReport } from '@/hooks/useReports';
import { useDepartments } from '@/hooks/useDepartments';
import { Spacing } from '@/constants/spacing';
import { KeyboardAwareScrollView } from '@/components/common/KeyboardAwareScrollView';
import { getReadableErrorMessage } from '@/utils/errorMessages';

function currentMonthValue() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export default function MonthlyReportScreen() {
  const [month, setMonth] = useState(currentMonthValue());
  const [departmentId, setDepartmentId] = useState('');
  const departments = useDepartments();
  const monthlyReport = useMonthlyReport();

  const handleGenerate = () => {
    monthlyReport.mutate(
      { month, department_id: departmentId || undefined },
      { onError: (err) => Toast.show({ type: 'error', text1: 'Unable to generate report', text2: getReadableErrorMessage(err) }) }
    );
  };

  return (
    <ThemedView style={styles.flex}>
      <KeyboardAwareScrollView contentContainerStyle={styles.content}>
        <MonthField label="Month" required value={month} onChange={setMonth} />
        <Select
          label="Department (optional)"
          loading={departments.isLoading}
          options={(departments.data ?? []).map((d) => ({ label: d.name, value: d.id }))}
          value={departmentId}
          onChange={setDepartmentId}
        />
        <Button
          label="Generate"
          loadingLabel="Generating..."
          loading={monthlyReport.isPending}
          onPress={handleGenerate}
        />
        {monthlyReport.data ? <ReportResultView result={monthlyReport.data} /> : null}
      </KeyboardAwareScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: Spacing.xl, paddingBottom: Spacing.xxxl },
});
