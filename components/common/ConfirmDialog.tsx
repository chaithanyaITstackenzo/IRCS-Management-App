import React, { ReactNode } from 'react';
import { Modal, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { ThemedText } from '../ui/ThemedText';
import { Button } from '../ui/Button';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Radius, Spacing } from '@/constants/spacing';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  description?: string;
  confirmLabel: string;
  confirmingLabel?: string;
  destructive?: boolean;
  loading?: boolean;
  children?: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}

// Used only for destructive/high-impact actions (spec §99) — activate/deactivate,
// approve/reject, etc. Harmless navigation never needs confirmation.
export function ConfirmDialog({
  visible,
  title,
  description,
  confirmLabel,
  confirmingLabel,
  destructive,
  loading,
  children,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const surface = useThemeColor({}, 'surface');

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.backdrop}>
        <View style={[styles.card, { backgroundColor: surface }]}>
          <ThemedText variant="h3">{title}</ThemedText>
          <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
            {description ? (
              <ThemedText variant="body" muted style={{ marginTop: Spacing.sm }}>
                {description}
              </ThemedText>
            ) : null}
            {children}
          </ScrollView>
          <View style={styles.actions}>
            <Button label="Cancel" variant="secondary" onPress={onCancel} style={styles.actionBtn} disabled={loading} />
            <Button
              label={confirmLabel}
              loadingLabel={confirmingLabel}
              loading={loading}
              variant={destructive ? 'danger' : 'primary'}
              onPress={onConfirm}
              style={styles.actionBtn}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center', padding: Spacing.xl },
  card: { width: '100%', maxWidth: 380, maxHeight: '85%', borderRadius: Radius.xl, padding: Spacing.xl },
  content: { flexShrink: 1 },
  actions: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.xl },
  actionBtn: { flex: 1 },
});
