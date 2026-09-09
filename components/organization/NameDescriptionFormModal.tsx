import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from '../ui/ThemedText';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Radius, Spacing } from '@/constants/spacing';

export interface NameDescriptionValues {
  name: string;
  description: string;
}

interface Props {
  visible: boolean;
  title: string;
  initial?: NameDescriptionValues;
  submitting: boolean;
  onSubmit: (values: NameDescriptionValues) => void;
  onClose: () => void;
}

// Shared add/edit form for Departments and Designations — identical field shape (spec §18/§19).
export function NameDescriptionFormModal({ visible, title, initial, submitting, onSubmit, onClose }: Props) {
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [nameError, setNameError] = useState<string | undefined>();
  const surface = useThemeColor({}, 'surface');

  useEffect(() => {
    if (visible) {
      setName(initial?.name ?? '');
      setDescription(initial?.description ?? '');
      setNameError(undefined);
    }
  }, [visible, initial]);

  const handleSubmit = () => {
    if (!name.trim()) {
      setNameError('Name is required.');
      return;
    }
    onSubmit({ name: name.trim(), description: description.trim() });
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <Pressable style={[styles.sheet, { backgroundColor: surface }]}> 
          <ThemedText variant="h3" style={{ marginBottom: Spacing.lg }}>
            {title}
          </ThemedText>
          <Input label="Name" required value={name} onChangeText={setName} error={nameError} />
          <Input label="Description" value={description} onChangeText={setDescription} multiline />
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
  actions: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.sm },
  actionBtn: { flex: 1 },
});
