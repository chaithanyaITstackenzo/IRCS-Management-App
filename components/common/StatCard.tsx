import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui/Card';
import { ThemedText } from '../ui/ThemedText';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Spacing } from '@/constants/spacing';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: keyof typeof Ionicons.glyphMap;
  tone?: 'primary' | 'success' | 'warning' | 'error' | 'info';
}

export function StatCard({ label, value, icon, tone = 'primary' }: StatCardProps) {
  const iconBg = useThemeColor({}, tone === 'primary' ? 'primaryMuted' : (`${tone}Muted` as any));
  const iconColor = useThemeColor({}, tone === 'primary' ? 'primary' : (tone as any));

  return (
    <Card style={styles.card}>
      <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>
      <ThemedText variant="h2">{value}</ThemedText>
      <ThemedText variant="caption" muted>
        {label}
      </ThemedText>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { flexBasis: '47%', flexGrow: 1, gap: 4 },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
});
