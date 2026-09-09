import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { ThemedText } from './ThemedText';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Radius, Spacing } from '@/constants/spacing';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface ButtonProps {
  label: string;
  loadingLabel?: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  testID?: string;
}

// Every mutation button must show a loading label and disable itself to
// prevent duplicate taps (spec §40).
export function Button({
  label,
  loadingLabel,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  testID,
}: ButtonProps) {
  const primary = useThemeColor({}, 'primary');
  const surface = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'border');
  const error = useThemeColor({}, 'error');
  const isDisabled = disabled || loading;

  const backgroundColor =
    variant === 'primary'
      ? primary
      : variant === 'danger'
        ? error
        : variant === 'secondary'
          ? surface
          : 'transparent';

  const textColor = variant === 'primary' || variant === 'danger' ? '#fff' : variant === 'secondary' ? primary : primary;

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={isDisabled}
      style={[
        styles.base,
        {
          backgroundColor,
          borderColor: variant === 'secondary' ? border : 'transparent',
          borderWidth: variant === 'secondary' ? 1 : 0,
          opacity: isDisabled ? 0.6 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <ThemedText variant="bodyStrong" style={{ color: textColor }}>
          {label}
        </ThemedText>
      )}
      {loading && loadingLabel ? (
        <ThemedText variant="bodyStrong" style={{ color: textColor, marginLeft: Spacing.sm }}>
          {loadingLabel}
        </ThemedText>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});
