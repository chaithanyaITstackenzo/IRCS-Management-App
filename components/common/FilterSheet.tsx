import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { ThemedText } from '../ui/ThemedText';
import { Button } from '../ui/Button';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Radius, Spacing } from '@/constants/spacing';

export interface FilterSheetOption {
  label: string;
  value: string;
}

export interface FilterSheetField {
  key: string;
  label: string;
  options: FilterSheetOption[];
  display?: 'chips' | 'select';
  visibleWhen?: (values: Record<string, string | undefined>) => boolean;
}

interface FilterSheetProps {
  visible: boolean;
  fields: FilterSheetField[];
  values: Record<string, string | undefined>;
  onApply: (values: Record<string, string | undefined>) => void;
  onClose: () => void;
}

/** Reusable mobile filter bottom-sheet — used by Employees, Attendance History, etc. (spec §37). */
export function FilterSheet({ visible, fields, values, onApply, onClose }: FilterSheetProps) {
  const [draft, setDraft] = useState(values);
  const [openSelectKey, setOpenSelectKey] = useState<string | null>(null);
  const surface = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'border');
  const primary = useThemeColor({}, 'primary');
  const text = useThemeColor({}, 'text');

  React.useEffect(() => {
    if (visible) setDraft(values);
  }, [visible, values]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={[styles.sheet, { backgroundColor: surface }]}>
          <ThemedText variant="h3" style={{ marginBottom: Spacing.lg }}>
            Filters
          </ThemedText>
          <ScrollView style={{ maxHeight: 420 }}>
            {fields.map((field) => (
              field.visibleWhen && !field.visibleWhen(draft) ? null : (
              <View key={field.key} style={{ marginBottom: Spacing.lg }}>
                <ThemedText variant="captionStrong" muted style={{ marginBottom: Spacing.sm }}>
                  {field.label}
                </ThemedText>
                {field.display === 'select' ? (
                  <View>
                    <Pressable onPress={() => setOpenSelectKey((key) => key === field.key ? null : field.key)} style={[styles.select, { borderColor: border }]}>
                      <ThemedText>{field.options.find((option) => option.value === draft[field.key])?.label ?? 'Select month'}</ThemedText>
                      <ThemedText style={{ color: primary }}>{openSelectKey === field.key ? '▲' : '▼'}</ThemedText>
                    </Pressable>
                    {openSelectKey === field.key ? (
                      <View style={[styles.selectOptions, { borderColor: border }]}>
                        {field.options.map((opt) => (
                          <Pressable key={opt.value} onPress={() => { setDraft((d) => ({ ...d, [field.key]: opt.value })); setOpenSelectKey(null); }} style={styles.selectOption}>
                            <ThemedText style={{ color: draft[field.key] === opt.value ? primary : text }}>{opt.label}</ThemedText>
                          </Pressable>
                        ))}
                      </View>
                    ) : null}
                  </View>
                ) : (
                  <View style={styles.chipRow}>
                    {field.options.map((opt) => {
                      const active = draft[field.key] === opt.value;
                      return (
                        <Pressable key={opt.value} onPress={() => setDraft((d) => ({ ...d, [field.key]: active ? undefined : opt.value }))} style={[styles.chip, { borderColor: active ? primary : border, backgroundColor: active ? primary : 'transparent' }]}>
                          <ThemedText variant="caption" style={{ color: active ? '#fff' : text }}>{opt.label}</ThemedText>
                        </Pressable>
                      );
                    })}
                  </View>
                )}
              </View>
              )
            ))}
          </ScrollView>
          <View style={styles.actions}>
            <Button
              label="Reset"
              variant="secondary"
              style={styles.actionBtn}
              onPress={() => setDraft({})}
            />
            <Button
              label="Apply"
              style={styles.actionBtn}
              onPress={() => {
                onApply(draft);
                onClose();
              }}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: { borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl, padding: Spacing.xl },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  chip: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: Radius.full, borderWidth: 1 },
  actions: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.md },
  actionBtn: { flex: 1 },
  select: { minHeight: 48, borderWidth: 1, borderRadius: Radius.md, paddingHorizontal: Spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  selectOptions: { borderWidth: 1, borderRadius: Radius.md, marginTop: Spacing.xs, overflow: 'hidden' },
  selectOption: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.md },
});
