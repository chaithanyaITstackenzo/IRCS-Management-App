import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '../ui/ThemedText';
import { Button } from '../ui/Button';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Spacing } from '@/constants/spacing';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon = 'file-tray-outline', title, description, actionLabel, onAction }: EmptyStateProps) {
  const muted = useThemeColor({}, 'textMuted');
  return (
    <View style={styles.wrap}>
      <Ionicons name={icon} size={40} color={muted} />
      <ThemedText variant="bodyStrong" style={styles.title}>
        {title}
      </ThemedText>
      {description ? (
        <ThemedText variant="caption" muted style={styles.description}>
          {description}
        </ThemedText>
      ) : null}
      {actionLabel && onAction ? (
        <Button label={actionLabel} onPress={onAction} variant="secondary" style={styles.action} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing.xxxl, paddingHorizontal: Spacing.xl },
  title: { marginTop: Spacing.md, textAlign: 'center' },
  description: { marginTop: Spacing.xs, textAlign: 'center' },
  action: { marginTop: Spacing.lg, minWidth: 160 },
});
