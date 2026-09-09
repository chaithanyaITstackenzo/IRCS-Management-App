import React from 'react';
import { StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Spacing } from '@/constants/spacing';

// Shown when a valid, authenticated user's role doesn't grant Management App
// access (e.g. plain EMPLOYEE) — the frontend never lets them into a management
// route just because it exists (spec §58).
export default function AccessDeniedScreen() {
  const logout = useAuthStore((s) => s.logout);
  const warning = useThemeColor({}, 'warning');

  return (
    <ThemedView style={styles.wrap}>
      <Ionicons name="lock-closed-outline" size={40} color={warning} />
      <ThemedText variant="h3" style={styles.title}>
        Management access required
      </ThemedText>
      <ThemedText variant="body" muted style={styles.description}>
        This account doesn&apos;t have permission to use the Management App. Contact your administrator if you believe
        this is a mistake.
      </ThemedText>
      <Button label="Log Out" onPress={() => logout()} style={styles.action} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xxl },
  title: { marginTop: Spacing.lg, textAlign: 'center' },
  description: { marginTop: Spacing.sm, textAlign: 'center' },
  action: { marginTop: Spacing.xl, minWidth: 160 },
});
