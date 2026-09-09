import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import { ThemedView } from '@/components/ui/ThemedView';
import { DateField } from '@/components/ui/DateField';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { ReportResultView } from '@/components/common/ReportResultView';
import { useDailyReport } from '@/hooks/useReports';
import { useDepartments } from '@/hooks/useDepartments';
import { Spacing } from '@/constants/spacing';
import { KeyboardAwareScrollView } from '@/components/common/KeyboardAwareScrollView';
import { todayInputValue } from '@/utils/date';
import { getReadableErrorMessage } from '@/utils/errorMessages';

export default function DailyReportScreen() {
  const [date, setDate] = useState(todayInputValue());
  const [departmentId, setDepartmentId] = useState('');
  const departments = useDepartments();
  const dailyReport = useDailyReport();

  const handleGenerate = () => {
    dailyReport.mutate(
      { date, department_id: departmentId || undefined },
      { onError: (err) => Toast.show({ type: 'error', text1: 'Unable to generate report', text2: getReadableErrorMessage(err) }) }
    );
  };

  return (
    <ThemedView style={styles.flex}>
      <KeyboardAwareScrollView contentContainerStyle={styles.content}>
        <DateField label="Date" required value={date} onChange={setDate} maximumDate={new Date()} />
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
          loading={dailyReport.isPending}
          onPress={handleGenerate}
        />
        {dailyReport.data ? <ReportResultView result={dailyReport.data} /> : null}
      </KeyboardAwareScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: Spacing.xl, paddingBottom: Spacing.xxxl },
});
