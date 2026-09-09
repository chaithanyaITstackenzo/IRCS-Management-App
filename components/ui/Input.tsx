import React from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Radius, Spacing } from '@/constants/spacing';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  required?: boolean;
}

export function Input({ label, error, required, style, ...rest }: InputProps) {
  const text = useThemeColor({}, 'text');
  const textMuted = useThemeColor({}, 'textMuted');
  const surface = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'border');
  const errorColor = useThemeColor({}, 'error');

  return (
    <View style={styles.wrap}>
      <ThemedText variant="captionStrong" muted style={styles.label}>
        {label}
        {required ? ' *' : ''}
      </ThemedText>
      <TextInput
        placeholderTextColor={textMuted}
        style={[
          styles.input,
          { color: text, backgroundColor: surface, borderColor: error ? errorColor : border },
          style,
        ]}
        {...rest}
      />
      {error ? (
        <ThemedText variant="caption" style={{ color: errorColor, marginTop: Spacing.xs }}>
          {error}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: Spacing.lg },
  label: { marginBottom: Spacing.xs },
  input: {
    minHeight: 48,
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    fontSize: 15,
  },
});
