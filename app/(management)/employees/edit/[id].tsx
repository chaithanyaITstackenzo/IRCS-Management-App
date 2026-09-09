import React from 'react';
import { StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';
import { ThemedView } from '@/components/ui/ThemedView';
import { EmployeeForm, EmployeeFormValues } from '@/components/employees/EmployeeForm';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { useEmployee, useUpdateEmployee } from '@/hooks/useEmployees';
import { getReadableErrorMessage } from '@/utils/errorMessages';
import { Spacing } from '@/constants/spacing';
import { KeyboardAwareScrollView } from '@/components/common/KeyboardAwareScrollView';

export default function EditEmployeeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: employee, isLoading, isError, error, refetch } = useEmployee(id);
  const updateEmployee = useUpdateEmployee(id);

  if (isLoading) return <LoadingSkeleton rows={6} />;
  if (isError || !employee) return <ErrorState error={error} onRetry={refetch} />;

  const handleSubmit = (values: EmployeeFormValues) => {
    const { email, password, ...updatePayload } = values;
    void email;
    void password;
    updateEmployee.mutate(updatePayload, {
      onSuccess: () => {
        Toast.show({ type: 'success', text1: 'Employee updated successfully' });
        router.replace(`/(management)/employees/${id}`);
      },
      onError: (err) => {
        Toast.show({ type: 'error', text1: 'Unable to update employee', text2: getReadableErrorMessage(err) });
      },
    });
  };

  return (
    <ThemedView style={styles.flex}>
      <KeyboardAwareScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <EmployeeForm
          initial={employee}
          submitLabel="Save Changes"
          submittingLabel="Saving..."
          submitting={updateEmployee.isPending}
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
