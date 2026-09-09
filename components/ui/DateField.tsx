import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ThemedText } from './ThemedText';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Radius, Spacing } from '@/constants/spacing';
import { toDateInputValue } from '@/utils/date';

interface DateFieldProps {
  label: string;
  value: string; // "YYYY-MM-DD"
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
  maximumDate?: Date;
  minimumDate?: Date;
}

// Native date picker wrapper — same component works on Android (dialog) and
// iOS (inline spinner/calendar depending on OS version) per spec §12/§50/§70.
export function DateField({ label, value, onChange, required, error, maximumDate, minimumDate }: DateFieldProps) {
  const [open, setOpen] = useState(false);
  const surface = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'border');
  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'textMuted');
  const errorColor = useThemeColor({}, 'error');

  const dateValue = value ? new Date(value) : undefined;

  const handleChange = (event: { type: string }, selected?: Date) => {
    if (Platform.OS === 'android') setOpen(false);
    if (event.type === 'dismissed' || !selected) return;
    onChange(toDateInputValue(selected));
  };

  return (
    <View style={styles.wrap}>
      <ThemedText variant="captionStrong" muted style={styles.label}>
        {label}
        {required ? ' *' : ''}
      </ThemedText>
      <Pressable
        onPress={() => setOpen(true)}
        style={[styles.field, { backgroundColor: surface, borderColor: error ? errorColor : border }]}
      >
        <ThemedText style={{ color: value ? text : muted }}>{value || 'YYYY-MM-DD'}</ThemedText>
      </Pressable>
      {error ? (
        <ThemedText variant="caption" style={{ color: errorColor, marginTop: Spacing.xs }}>
          {error}
        </ThemedText>
      ) : null}
      {open ? (
        <DateTimePicker
          value={dateValue ?? new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={handleChange}
          maximumDate={maximumDate}
          minimumDate={minimumDate}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: Spacing.lg },
  label: { marginBottom: Spacing.xs },
  field: { minHeight: 48, borderRadius: Radius.md, borderWidth: 1, paddingHorizontal: Spacing.md, justifyContent: 'center' },
});
