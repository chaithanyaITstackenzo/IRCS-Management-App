import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ThemedText } from './ThemedText';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Radius, Spacing } from '@/constants/spacing';

interface MonthFieldProps {
  label: string;
  value: string; // "YYYY-MM"
  onChange: (value: string) => void;
  required?: boolean;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function formatMonthLabel(value: string): string {
  const [y, m] = value.split('-').map(Number);
  if (!y || !m) return '';
  return `${MONTH_NAMES[m - 1]} ${y}`;
}

// Reuses the native date picker in month/year mode where the platform supports it,
// falling back to a plain calendar picker snapped to the 1st of the month.
export function MonthField({ label, value, onChange, required }: MonthFieldProps) {
  const [open, setOpen] = useState(false);
  const surface = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'border');
  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'textMuted');

  const dateValue = value ? new Date(`${value}-01`) : new Date();

  const handleChange = (event: { type: string }, selected?: Date) => {
    if (Platform.OS === 'android') setOpen(false);
    if (event.type === 'dismissed' || !selected) return;
    const y = selected.getFullYear();
    const m = String(selected.getMonth() + 1).padStart(2, '0');
    onChange(`${y}-${m}`);
  };

  return (
    <View style={styles.wrap}>
      <ThemedText variant="captionStrong" muted style={styles.label}>
        {label}
        {required ? ' *' : ''}
      </ThemedText>
      <Pressable onPress={() => setOpen(true)} style={[styles.field, { backgroundColor: surface, borderColor: border }]}>
        <ThemedText style={{ color: value ? text : muted }}>{value ? formatMonthLabel(value) : 'Select month'}</ThemedText>
      </Pressable>
      {open ? (
        <DateTimePicker
          value={dateValue}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChange}
          maximumDate={new Date()}
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
