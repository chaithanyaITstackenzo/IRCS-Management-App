import React, { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Radius, Spacing } from '@/constants/spacing';

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  label: string;
  value?: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  loading?: boolean;
}

/** Bottom-sheet-style picker used for department/designation/role/shift/camera selection. */
export function Select({ label, value, options, onChange, placeholder = 'Select...', required, error, loading }: SelectProps) {
  const [open, setOpen] = useState(false);
  const surface = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'border');
  const text = useThemeColor({}, 'text');
  const textMuted = useThemeColor({}, 'textMuted');
  const errorColor = useThemeColor({}, 'error');
  const primary = useThemeColor({}, 'primary');

  const selected = options.find((o) => o.value === value);

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
        <ThemedText style={{ color: selected ? text : textMuted }}>
          {loading ? 'Loading…' : selected ? selected.label : placeholder}
        </ThemedText>
        <Ionicons name="chevron-down" size={18} color={textMuted} />
      </Pressable>
      {error ? (
        <ThemedText variant="caption" style={{ color: errorColor, marginTop: Spacing.xs }}>
          {error}
        </ThemedText>
      ) : null}

      <Modal visible={open} animationType="slide" transparent onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={[styles.sheet, { backgroundColor: surface }]}>
            <ThemedText variant="h3" style={{ marginBottom: Spacing.md }}>
              {label}
            </ThemedText>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              style={{ maxHeight: 360 }}
              ListEmptyComponent={
                <ThemedText muted style={{ paddingVertical: Spacing.lg }}>
                  No options available.
                </ThemedText>
              }
              renderItem={({ item }) => (
                <Pressable
                  style={styles.option}
                  onPress={() => {
                    onChange(item.value);
                    setOpen(false);
                  }}
                >
                  <ThemedText style={{ color: item.value === value ? primary : text }}>{item.label}</ThemedText>
                  {item.value === value ? <Ionicons name="checkmark" size={18} color={primary} /> : null}
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: Spacing.lg },
  label: { marginBottom: Spacing.xs },
  field: {
    minHeight: 48,
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: { borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl, padding: Spacing.xl, maxHeight: '70%' },
  option: {
    paddingVertical: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
