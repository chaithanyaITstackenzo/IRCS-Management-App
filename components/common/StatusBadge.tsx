import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '../ui/ThemedText';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Radius, Spacing } from '@/constants/spacing';
import { StatusMeta, StatusTone } from '@/constants/status';

const toneColorKey: Record<StatusTone, { bg: 'successMuted' | 'warningMuted' | 'errorMuted' | 'infoMuted' | 'border'; fg: 'success' | 'warning' | 'error' | 'info' | 'textMuted' }> = {
  success: { bg: 'successMuted', fg: 'success' },
  warning: { bg: 'warningMuted', fg: 'warning' },
  error: { bg: 'errorMuted', fg: 'error' },
  info: { bg: 'infoMuted', fg: 'info' },
  neutral: { bg: 'border', fg: 'textMuted' },
};

export function StatusBadge({ meta }: { meta: StatusMeta }) {
  const colors = toneColorKey[meta.tone];
  const bg = useThemeColor({}, colors.bg);
  const fg = useThemeColor({}, colors.fg);

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <ThemedText variant="label" style={{ color: fg }}>
        {meta.label.toUpperCase()}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
});
