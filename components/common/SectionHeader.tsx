import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '../ui/ThemedText';
import { Spacing } from '@/constants/spacing';

export function SectionHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <View style={styles.row}>
      <ThemedText variant="h3">{title}</ThemedText>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
});
