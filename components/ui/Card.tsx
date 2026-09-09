import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Radius, Spacing } from '@/constants/spacing';

export function Card({ style, ...rest }: ViewProps) {
  const backgroundColor = useThemeColor({}, 'surface');
  const borderColor = useThemeColor({}, 'border');
  return <View style={[styles.card, { backgroundColor, borderColor }, style]} {...rest} />;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.lg,
  },
});
