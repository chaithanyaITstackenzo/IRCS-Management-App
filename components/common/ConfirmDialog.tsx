import React from 'react';
import { Modal, StyleSheet, View } from 'react-native';
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
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const surface = useThemeColor({}, 'surface');

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={[styles.card, { backgroundColor: surface }]}>
          <ThemedText variant="h3">{title}</ThemedText>
          {description ? (
            <ThemedText variant="body" muted style={{ marginTop: Spacing.sm }}>
              {description}
            </ThemedText>
          ) : null}
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
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center', padding: Spacing.xl },
  card: { width: '100%', maxWidth: 380, borderRadius: Radius.xl, padding: Spacing.xl },
  actions: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.xl },
  actionBtn: { flex: 1 },
});
