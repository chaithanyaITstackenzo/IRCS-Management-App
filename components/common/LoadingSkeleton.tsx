import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Radius, Spacing } from '@/constants/spacing';

// Simple, dependency-free skeleton (no extra animation library) — good enough
// to avoid a blank white screen while data loads (spec §40).
export function LoadingSkeleton({ rows = 4 }: { rows?: number }) {
  const bg = useThemeColor({}, 'border');
  return (
    <View style={styles.wrap}>
      {Array.from({ length: rows }).map((_, i) => (
        <View key={i} style={[styles.row, { backgroundColor: bg }]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: Spacing.lg, gap: Spacing.md },
  row: { height: 72, borderRadius: Radius.lg, opacity: 0.5 },
});
