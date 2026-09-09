import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '../ui/ThemedText';
import { Button } from '../ui/Button';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Spacing } from '@/constants/spacing';
import { getReadableErrorMessage } from '@/utils/errorMessages';

interface ErrorStateProps {
  error?: unknown;
  message?: string;
  onRetry?: () => void;
}

// Every API-driven screen routes failures through here for consistent,
// human-readable messaging (spec §41/§100) instead of raw Axios errors.
export function ErrorState({ error, message, onRetry }: ErrorStateProps) {
  const errorColor = useThemeColor({}, 'error');
  const text = message ?? getReadableErrorMessage(error);

  return (
    <View style={styles.wrap}>
      <Ionicons name="alert-circle-outline" size={40} color={errorColor} />
      <ThemedText variant="bodyStrong" style={styles.title}>
        Unable to load this screen
      </ThemedText>
      <ThemedText variant="caption" muted style={styles.description}>
        {text}
      </ThemedText>
      {onRetry ? <Button label="Retry" onPress={onRetry} variant="secondary" style={styles.action} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing.xxxl, paddingHorizontal: Spacing.xl },
  title: { marginTop: Spacing.md, textAlign: 'center' },
  description: { marginTop: Spacing.xs, textAlign: 'center' },
  action: { marginTop: Spacing.lg, minWidth: 140 },
});
