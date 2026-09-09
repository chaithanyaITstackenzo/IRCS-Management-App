import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Radius, Spacing } from '@/constants/spacing';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

// Debounces server-side search so we don't fire a request on every keystroke (spec §36).
export function SearchBar({ value, onChangeText, placeholder = 'Search...', debounceMs = 400 }: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => setLocalValue(value), [value]);

  const surface = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'border');
  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'textMuted');

  const handleChange = (t: string) => {
    setLocalValue(t);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => onChangeText(t), debounceMs);
  };

  const handleClear = () => {
    setLocalValue('');
    if (timer.current) clearTimeout(timer.current);
    onChangeText('');
  };

  return (
    <View style={[styles.wrap, { backgroundColor: surface, borderColor: border }]}>
      <Ionicons name="search" size={18} color={muted} />
      <TextInput
        value={localValue}
        onChangeText={handleChange}
        placeholder={placeholder}
        placeholderTextColor={muted}
        style={[styles.input, { color: text }]}
      />
      {localValue.length > 0 ? (
        <Pressable onPress={handleClear} hitSlop={8}>
          <Ionicons name="close-circle" size={18} color={muted} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    height: 44,
  },
  input: { flex: 1, fontSize: 15 },
});
