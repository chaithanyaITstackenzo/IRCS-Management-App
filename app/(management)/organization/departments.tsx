import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { EntityListItem } from '@/components/organization/EntityListItem';
import { NameDescriptionFormModal } from '@/components/organization/NameDescriptionFormModal';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import {
  useCreateDepartment,
  useDepartments,
  useSetDepartmentStatus,
} from '@/hooks/useDepartments';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Spacing } from '@/constants/spacing';
import { Department } from '@/types/department';
import { getReadableErrorMessage } from '@/utils/errorMessages';

export default function DepartmentsScreen() {
  const { data, isLoading, isError, error, refetch } = useDepartments();
  const createDepartment = useCreateDepartment();
  const [editing, setEditing] = useState<Department | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [statusTarget, setStatusTarget] = useState<Department | null>(null);
  const setStatus = useSetDepartmentStatus();

  const primary = useThemeColor({}, 'primary');
  const isSubmitting = createDepartment.isPending;

  const handleSubmit = (values: { name: string; description: string }) => {
    const onSuccess = () => {
      Toast.show({ type: 'success', text1: `Department ${editing ? 'updated' : 'created'} successfully` });
      setFormOpen(false);
      setEditing(null);
    };
    const onError = (err: unknown) =>
      Toast.show({ type: 'error', text1: 'Unable to save department', text2: getReadableErrorMessage(err) });

    createDepartment.mutate(values, { onSuccess, onError });
  };

  const handleToggleStatus = () => {
    if (!statusTarget) return;
    setStatus.mutate(
      { id: statusTarget.id, status: false },
      {
        onSuccess: () => {
          Toast.show({ type: 'success', text1: 'Department deactivated' });
          setStatusTarget(null);
        },
        onError: (err) => {
          Toast.show({ type: 'error', text1: 'Unable to update status', text2: getReadableErrorMessage(err) });
          setStatusTarget(null);
        },
      }
    );
  };

  return (
    <ThemedView style={styles.flex}>
      <View style={styles.header}>
        <Pressable
          onPress={() => {
            setEditing(null);
            setFormOpen(true);
          }}
          style={[styles.addButton, { backgroundColor: primary }]}
        >
          <Ionicons name="add" size={18} color="#fff" />
          <ThemedText style={{ color: '#fff', marginLeft: 4 }} variant="bodyStrong">
            Add
          </ThemedText>
        </Pressable>
      </View>

      {isLoading ? (
        <LoadingSkeleton rows={5} />
      ) : isError ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : (
        <FlatList
          data={data ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <EntityListItem
              name={item.name}
              description={item.description}
              status={item.status}
              employeeCount={item.employee_count}
              onPress={() => {
                setEditing(null);
                setFormOpen(false);
              }}
              onToggleStatus={() => setStatusTarget(item)}
            />
          )}
          ListEmptyComponent={<EmptyState icon="business-outline" title="No departments found" actionLabel="Add Department" onAction={() => setFormOpen(true)} />}
        />
      )}

      <NameDescriptionFormModal
        visible={formOpen}
        title="Add Department"
        initial={undefined}
        submitting={isSubmitting}
        onSubmit={handleSubmit}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
      />

      <ConfirmDialog
        visible={!!statusTarget}
        title="Deactivate Department?"
        description="This department will no longer be active."
        confirmLabel="Deactivate"
        confirmingLabel="Saving..."
        destructive={!!statusTarget?.status}
        loading={setStatus.isPending}
        onConfirm={handleToggleStatus}
        onCancel={() => setStatusTarget(null)}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'flex-end', padding: Spacing.lg, paddingBottom: 0 },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    height: 36,
    borderRadius: 18,
  },
  list: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.md, paddingBottom: Spacing.xxxl },
});
