import React, { useState } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { KeyboardAwareScrollView } from '@/components/common/KeyboardAwareScrollView';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useLogin } from '@/hooks/useAuth';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Spacing } from '@/constants/spacing';
import { getReadableErrorMessage } from '@/utils/errorMessages';
import { MOCK_AUTH_ENABLED } from '@/constants/api';
import { MOCK_CREDENTIALS } from '@/api/mockAuth';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const primary = useThemeColor({}, 'primary');
  const login = useLogin();

  const validate = () => {
    const next: typeof errors = {};
    if (!email.trim()) next.email = 'Email is required.';
    else if (!EMAIL_REGEX.test(email.trim())) next.email = 'Please enter a valid email address.';
    if (!password) next.password = 'Password is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    login.mutate(
      { email: email.trim(), password },
      {
        onError: (error) => {
          Toast.show({ type: 'error', text1: 'Login failed', text2: getReadableErrorMessage(error) });
        },
      }
    );
  };

  return (
    <ThemedView style={styles.flex}>
      <KeyboardAwareScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <View style={[styles.badge, { backgroundColor: primary }]}>
              <Ionicons name="medkit-outline" size={28} color="#fff" />
            </View>
            <ThemedText variant="h1" style={styles.title}>
              IRCS Cancer Hospital
            </ThemedText>
            <ThemedText variant="body" muted style={styles.subtitle}>
              Management sign in
            </ThemedText>

            <View style={styles.form}>
              <Input
                label="Email"
                placeholder="admin@hospital.com"
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                value={email}
                onChangeText={setEmail}
                error={errors.email}
                testID="login-email"
              />
              <Input
                label="Password"
                placeholder="••••••••"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                error={errors.password}
                testID="login-password"
              />
              <Button
                label="Show password"
                variant="ghost"
                onPress={() => setShowPassword((v) => !v)}
                style={styles.showPasswordBtn}
              />

              <Button
                label="Log In"
                loadingLabel="Logging in..."
                loading={login.isPending}
                onPress={handleSubmit}
                style={styles.submit}
                testID="login-submit"
              />

              {MOCK_AUTH_ENABLED ? (
                <View style={styles.demoSection}>
                  <ThemedText variant="captionStrong" muted style={styles.demoTitle}>
                    MOCK LOGIN
                  </ThemedText>
                  {MOCK_CREDENTIALS.map((credential) => (
                    <Button
                      key={credential.email}
                      label={`${credential.label} - ${credential.email}`}
                      variant="secondary"
                      style={styles.demoButton}
                      onPress={() => {
                        setEmail(credential.email);
                        setPassword(credential.password);
                        setErrors({});
                      }}
                    />
                  ))}
                </View>
              ) : null}

            </View>
      </KeyboardAwareScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flexGrow: 1, justifyContent: 'center', padding: Spacing.xxl },
  badge: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: Spacing.lg,
  },
  title: { textAlign: 'center' },
  subtitle: { textAlign: 'center', marginTop: Spacing.xs, marginBottom: Spacing.xxl },
  form: { marginTop: Spacing.md },
  showPasswordBtn: { alignSelf: 'flex-start', minHeight: 32, paddingHorizontal: 0, marginTop: -Spacing.sm, marginBottom: Spacing.md },
  submit: { marginTop: Spacing.sm },
  demoSection: { marginTop: Spacing.xxl },
  demoTitle: { marginBottom: Spacing.sm, textAlign: 'center' },
  demoButton: { marginTop: Spacing.sm },
});
