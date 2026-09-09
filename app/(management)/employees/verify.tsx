import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useResendEmployeeOTP, useVerifyEmployee } from '@/hooks/useEmployees';
import { Spacing } from '@/constants/spacing';
import { KeyboardAwareScrollView } from '@/components/common/KeyboardAwareScrollView';
import { getReadableErrorMessage } from '@/utils/errorMessages';

export default function VerifyEmployeeScreen() {
  const { email = '', employeeId = '' } = useLocalSearchParams<{ email: string; employeeId: string }>();
  const [otp, setOtp] = useState('');
  const verify = useVerifyEmployee();
  const resend = useResendEmployeeOTP();

  const submit = () => {
    if (!/^\d{6}$/.test(otp)) {
      Toast.show({ type: 'error', text1: 'Enter the six-digit OTP.' });
      return;
    }
    verify.mutate({ otp, email }, {
      onSuccess: () => {
        Toast.show({ type: 'success', text1: 'Employee verified successfully' });
        router.replace('/(management)/(tabs)/employees');
      },
      onError: (error) => Toast.show({ type: 'error', text1: 'Verification failed', text2: getReadableErrorMessage(error) }),
    });
  };

  return (
    <ThemedView style={styles.flex}>
      <KeyboardAwareScrollView contentContainerStyle={styles.content}>
        <ThemedText variant="h2">Verify employee email</ThemedText>
        <ThemedText variant="body" muted style={styles.description}>Enter the OTP sent to {email}.</ThemedText>
        <Input label="OTP" required keyboardType="number-pad" value={otp} onChangeText={setOtp} maxLength={6} />
        <Button label="Verify Employee" loadingLabel="Verifying..." loading={verify.isPending} onPress={submit} />
        <Button
          label="Resend OTP"
          variant="secondary"
          loadingLabel="Resending..."
          loading={resend.isPending}
          onPress={() => resend.mutate(employeeId, {
            onSuccess: () => Toast.show({ type: 'success', text1: 'Verification OTP sent successfully' }),
            onError: (error) => Toast.show({ type: 'error', text1: 'Unable to resend OTP', text2: getReadableErrorMessage(error) }),
          })}
          style={styles.resend}
        />
      </KeyboardAwareScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: Spacing.xl, gap: Spacing.md },
  description: { marginBottom: Spacing.md },
  resend: { marginTop: Spacing.sm },
});
