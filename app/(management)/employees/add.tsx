import React from 'react';
import { StyleSheet } from 'react-native';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { ThemedView } from '@/components/ui/ThemedView';
import { EmployeeForm, EmployeeFormValues } from '@/components/employees/EmployeeForm';
import { useCreateEmployee } from '@/hooks/useEmployees';
import { getReadableErrorMessage } from '@/utils/errorMessages';
import { Spacing } from '@/constants/spacing';
import { KeyboardAwareScrollView } from '@/components/common/KeyboardAwareScrollView';

export default function AddEmployeeScreen() {
  const createEmployee = useCreateEmployee();

  const handleSubmit = (values: EmployeeFormValues) => {
    createEmployee.mutate(values, {
      onSuccess: (employee) => {
        Toast.show({ type: 'success', text1: 'Employee created successfully' });
        router.replace({ pathname: '/(management)/employees/verify', params: { email: employee.email, employeeId: employee.employee_id } });
      },
      onError: (error) => {
        // Form data is preserved automatically — we simply don't navigate away (spec §101/§102).
        Toast.show({ type: 'error', text1: 'Unable to create employee', text2: getReadableErrorMessage(error) });
      },
    });
  };

  return (
    <ThemedView style={styles.flex}>
      <KeyboardAwareScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <EmployeeForm
          submitLabel="Create Employee"
          submittingLabel="Creating..."
          submitting={createEmployee.isPending}
          onSubmit={handleSubmit}
        />
      </KeyboardAwareScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: Spacing.xl },
});
