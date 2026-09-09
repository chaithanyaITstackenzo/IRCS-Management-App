import React from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { StatusBadge } from '@/components/common/StatusBadge';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { Card } from '@/components/ui/Card';
import { useCreateRole, useDeactivateRole, useRoles } from '@/hooks/useRoles';
import { NameDescriptionFormModal } from '@/components/organization/NameDescriptionFormModal';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Spacing } from '@/constants/spacing';
import { Role } from '@/types/role';
import Toast from 'react-native-toast-message';
import { getReadableErrorMessage } from '@/utils/errorMessages';
import { EMPLOYEE_STATUS } from '@/constants/status';

export default function RolesScreen() {
  const { data, isLoading, isError, error, refetch } = useRoles();
  const info = useThemeColor({}, 'info');
  const createRole = useCreateRole();
  const deactivateRole = useDeactivateRole();
  const [formOpen, setFormOpen] = React.useState(false);
  const [target, setTarget] = React.useState<Role | null>(null);

  return (
    <ThemedView style={styles.flex}>
      <View style={styles.header}><Pressable onPress={() => setFormOpen(true)}><ThemedText variant="bodyStrong" style={{ color: info }}>Add Role</ThemedText></Pressable></View>

      {isLoading ? (
        <LoadingSkeleton rows={4} />
      ) : isError ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : (
        <FlatList
          data={data ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Card style={styles.row}>
              <View style={{ flex: 1 }}>
                <ThemedText variant="bodyStrong">{item.role_name}</ThemedText>
                {item.description ? (
                  <ThemedText variant="caption" muted>
                    {item.description}
                  </ThemedText>
                ) : null}
              </View>
              <View><StatusBadge meta={EMPLOYEE_STATUS[String(item.status) as 'true' | 'false']} />{item.status ? <Pressable onPress={() => setTarget(item)}><ThemedText variant="caption" style={{ color: info }}>Deactivate</ThemedText></Pressable> : null}</View>
            </Card>
          )}
          ListEmptyComponent={<EmptyState icon="shield-checkmark-outline" title="No roles found" />}
        />
      )}
      <NameDescriptionFormModal visible={formOpen} title="Add Role" submitting={createRole.isPending} onSubmit={(values) => createRole.mutate(values, { onSuccess: () => { setFormOpen(false); Toast.show({ type: 'success', text1: 'Role created successfully' }); }, onError: (error) => Toast.show({ type: 'error', text1: 'Unable to create role', text2: getReadableErrorMessage(error) }) })} onClose={() => setFormOpen(false)} />
      <ConfirmDialog visible={!!target} title="Deactivate Role?" description="This role will no longer be available for assignment." confirmLabel="Deactivate" destructive loading={deactivateRole.isPending} onConfirm={() => target && deactivateRole.mutate(target.id, { onSuccess: () => { setTarget(null); Toast.show({ type: 'success', text1: 'Role deactivated' }); }, onError: (error) => Toast.show({ type: 'error', text1: 'Unable to deactivate role', text2: getReadableErrorMessage(error) }) })} onCancel={() => setTarget(null)} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { alignItems: 'flex-end', padding: Spacing.xl, paddingBottom: 0 },
  notice: { padding: Spacing.xl, paddingBottom: 0 },
  noticeCard: { padding: Spacing.md },
  list: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.md, paddingBottom: Spacing.xxxl, gap: Spacing.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
