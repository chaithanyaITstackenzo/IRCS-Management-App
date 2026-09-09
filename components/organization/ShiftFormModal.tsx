import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from '../ui/ThemedText';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Radius, Spacing } from '@/constants/spacing';
import { isOvernightShift } from '@/utils/shift';

export interface ShiftFormValues {
  name: string;
  start_time: string;
  end_time: string;
}

interface Props {
  visible: boolean;
  title: string;
  initial?: ShiftFormValues;
  submitting: boolean;
  onSubmit: (values: ShiftFormValues) => void;
  onClose: () => void;
}

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

// Shift creation/edit form. Overnight status is derived live from the entered
// times and shown to the user — never sent to the backend (spec §21/§107).
export function ShiftFormModal({ visible, title, initial, submitting, onSubmit, onClose }: Props) {
  const [name, setName] = useState(initial?.name ?? '');
  const [startTime, setStartTime] = useState(initial?.start_time?.slice(0, 5) ?? '');
  const [endTime, setEndTime] = useState(initial?.end_time?.slice(0, 5) ?? '');
  const [errors, setErrors] = useState<{ name?: string; start_time?: string; end_time?: string }>({});
  const surface = useThemeColor({}, 'surface');
  const primary = useThemeColor({}, 'primary');

  useEffect(() => {
    if (visible) {
      setName(initial?.name ?? '');
      setStartTime(initial?.start_time?.slice(0, 5) ?? '');
      setEndTime(initial?.end_time?.slice(0, 5) ?? '');
      setErrors({});
    }
  }, [visible, initial]);

  const showOvernight = TIME_REGEX.test(startTime) && TIME_REGEX.test(endTime);
  const overnight = showOvernight && isOvernightShift(startTime, endTime);

  const handleSubmit = () => {
    const next: typeof errors = {};
    if (!name.trim()) next.name = 'Shift name is required.';
    if (!TIME_REGEX.test(startTime)) next.start_time = 'Use 24-hour HH:MM format, e.g. 09:00.';
    if (!TIME_REGEX.test(endTime)) next.end_time = 'Use 24-hour HH:MM format, e.g. 17:00.';
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    onSubmit({ name: name.trim(), start_time: startTime, end_time: endTime });
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <Pressable style={[styles.sheet, { backgroundColor: surface }]}> 
          <ThemedText variant="h3" style={{ marginBottom: Spacing.lg }}>
            {title}
          </ThemedText>
          <Input label="Shift Name" required value={name} onChangeText={setName} error={errors.name} />
          <Input
            label="Start Time"
            required
            placeholder="09:00"
            value={startTime}
            onChangeText={setStartTime}
            error={errors.start_time}
          />
          <Input
            label="End Time"
            required
            placeholder="17:00"
            value={endTime}
            onChangeText={setEndTime}
            error={errors.end_time}
          />
          {showOvernight ? (
            <View style={[styles.badge, { backgroundColor: `${primary}15` }]}>
              <ThemedText variant="captionStrong" style={{ color: primary }}>
                {overnight ? 'Overnight shift — continues into the next day' : 'Normal shift'}
              </ThemedText>
            </View>
          ) : null}
          <View style={styles.actions}>
            <Button label="Cancel" variant="secondary" style={styles.actionBtn} onPress={onClose} disabled={submitting} />
            <Button
              label="Save"
              loadingLabel="Saving..."
              loading={submitting}
              style={styles.actionBtn}
              onPress={handleSubmit}
            />
          </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: { borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl, padding: Spacing.xl },
  badge: { alignSelf: 'flex-start', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: Radius.full, marginBottom: Spacing.md },
  actions: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.sm },
  actionBtn: { flex: 1 },
});
