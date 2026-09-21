import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { ShiftListItem } from '@/components/organization/ShiftListItem';
import { ShiftFormModal, ShiftFormValues } from '@/components/organization/ShiftFormModal';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { useCreateShift, useDeleteShift, useShifts, useUpdateShift } from '@/hooks/useShifts';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Spacing } from '@/constants/spacing';
import { getReadableErrorMessage } from '@/utils/errorMessages';
import { Shift } from '@/types/shift';

export default function ShiftsScreen() {
  const { data, isLoading, isError, error, refetch } = useShifts();
  const createShift = useCreateShift();
  const deleteShift = useDeleteShift();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Shift | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Shift | null>(null);
  const updateShift = useUpdateShift(editing?.id ?? '');
  const primary = useThemeColor({}, 'primary');

  const handleSubmit = (values: ShiftFormValues) => {
    const mutation = editing ? updateShift : createShift;
    mutation.mutate(values, {
      onSuccess: () => {
        Toast.show({ type: 'success', text1: `Shift ${editing ? 'updated' : 'created'} successfully` });
        setFormOpen(false);
        setEditing(null);
      },
      onError: (err) => {
        Toast.show({ type: 'error', text1: `Unable to ${editing ? 'update' : 'create'} shift`, text2: getReadableErrorMessage(err) });
      },
    });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteShift.mutate(deleteTarget.id, {
      onSuccess: () => {
        Toast.show({ type: 'success', text1: 'Shift deleted successfully' });
        setDeleteTarget(null);
      },
      onError: (err) => {
        Toast.show({ type: 'error', text1: 'Unable to delete shift', text2: getReadableErrorMessage(err) });
        setDeleteTarget(null);
      },
    });
  };

  if (isLoading) return <LoadingSkeleton rows={5} />;
  if (isError) return <ErrorState error={error} onRetry={refetch} />;

  return (
    <ThemedView style={styles.flex}>
      <View style={styles.header}>
        <Pressable onPress={() => setFormOpen(true)} style={[styles.addButton, { backgroundColor: primary }]}>
          <Ionicons name="add" size={18} color="#fff" />
          <ThemedText style={styles.addLabel} variant="bodyStrong">Add</ThemedText>
        </Pressable>
      </View>
      <FlatList
        data={data ?? []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <ShiftListItem
            shift={item}
            onPress={() => {
              setEditing(item);
              setFormOpen(true);
            }}
            onDelete={() => setDeleteTarget(item)}
          />
        )}
        ListEmptyComponent={<EmptyState icon="time-outline" title="No shifts configured" actionLabel="Add Shift" onAction={() => setFormOpen(true)} />}
      />
      <ShiftFormModal
        visible={formOpen}
        title={editing ? 'Edit Shift' : 'Add Shift'}
        initial={editing ?? undefined}
        submitting={createShift.isPending || updateShift.isPending}
        onSubmit={handleSubmit}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
      />
      <ConfirmDialog
        visible={!!deleteTarget}
        title="Delete Shift?"
        description={deleteTarget ? `Delete ${deleteTarget.name}? Shifts assigned to employees cannot be deleted.` : undefined}
        confirmLabel="Delete"
        confirmingLabel="Deleting..."
        destructive
        loading={deleteShift.isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'flex-end', padding: Spacing.lg, paddingBottom: 0 },
  addButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, height: 36, borderRadius: 18 },
  addLabel: { color: '#fff', marginLeft: 4 },
  list: { padding: Spacing.xl, paddingBottom: Spacing.xxxl },
});
