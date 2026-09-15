import React, { useMemo, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, RefreshControl, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { RequestListItem } from '@/components/requests/RequestListItem';
import { LeaveRequestListItem } from '@/components/requests/LeaveRequestListItem';
import { PermissionRequestListItem } from '@/components/requests/PermissionRequestListItem';
import { WorkoffRequestListItem } from '@/components/requests/WorkoffRequestListItem';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { usePendingRequests } from '@/hooks/useAttendanceRequests';
import { useDecideLeaveRequest, useDecidePermissionRequest, useDecideWorkoffRequest, useLeaveRequests, usePermissionRequests, useWorkoffRequests } from '@/hooks/useManagementRequests';
import { Spacing } from '@/constants/spacing';
import { useThemeColor } from '@/hooks/use-theme-color';
import { LeaveRequestItem, PermissionRequestItem, WorkoffRequest } from '@/types/managementRequests';
import { useAuthStore } from '@/store/authStore';
import { canApproveRequests } from '@/utils/permissions';
import { getReadableErrorMessage } from '@/utils/errorMessages';
import { currentMonthValue, getApprovalHistoryRange, ApprovalHistoryPeriod } from '@/utils/date';
import { FilterSheet, FilterSheetField } from '@/components/common/FilterSheet';

export default function RequestsListScreen() {
  const [mode, setMode] = useState<'attendance' | 'leave' | 'permission' | 'workoff'>('attendance');
  const [history, setHistory] = useState(false);
  const [historyFilters, setHistoryFilters] = useState<Record<string, string | undefined>>({ period: 'today', month: currentMonthValue() });
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequestItem | null>(null);
  const [selectedPermission, setSelectedPermission] = useState<PermissionRequestItem | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejecting, setRejecting] = useState(false);
  const [permissionApproveFrom, setPermissionApproveFrom] = useState('');
  const [permissionApproveTo, setPermissionApproveTo] = useState('');
  const [permissionRejecting, setPermissionRejecting] = useState(false);
  const [selectedWorkoff, setSelectedWorkoff] = useState<WorkoffRequest | null>(null);
  const [workoffRejecting, setWorkoffRejecting] = useState(false);
  const requestStatus = history ? 'ALL' : 'PENDING';
  const historyRange = useMemo(
    () => getApprovalHistoryRange((historyFilters.period as ApprovalHistoryPeriod) ?? 'today', historyFilters.month),
    [historyFilters.period, historyFilters.month],
  );
  const requestParams = history ? { status: requestStatus, ...historyRange } : { status: requestStatus };
  const { data, isLoading, isError, error, refetch, isRefetching } = usePendingRequests(requestStatus, history ? historyRange : {});
  const leaveQuery = useLeaveRequests(requestParams);
  const permissionQuery = usePermissionRequests(requestParams);
  const workoffQuery = useWorkoffRequests(requestParams);
  const decideLeave = useDecideLeaveRequest();
  const decidePermission = useDecidePermissionRequest();
  const decideWorkoff = useDecideWorkoffRequest();
  const { user } = useAuthStore();
  const primary = useThemeColor({}, 'primary');
  const border = useThemeColor({}, 'border');
  const previousMonthOptions = useMemo(() => {
    const options = [];
    const date = new Date();
    for (let index = 0; index < 13; index += 1) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      options.push({ label: date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }), value: `${year}-${month}` });
      date.setMonth(date.getMonth() - 1);
    }
    return options;
  }, []);
  const filterFields: FilterSheetField[] = [
    {
      key: 'period',
      label: 'History period',
      options: [
        { label: 'Today', value: 'today' },
        { label: 'This week', value: 'week' },
        { label: 'Month', value: 'month' },
      ],
    },
    { key: 'month', label: 'Select month', options: previousMonthOptions, display: 'select', visibleWhen: (values) => values.period === 'month' },
  ];

  const decide = (action: 'APPROVE' | 'REJECT', reason?: string) => {
    if (!selectedLeave) return;
    decideLeave.mutate(
      { requestId: String(selectedLeave.leave.id), action, rejection_reason: reason },
      {
        onSuccess: () => {
          Toast.show({ type: 'success', text1: action === 'APPROVE' ? 'Leave approved' : 'Leave rejected' });
          setSelectedLeave(null);
          setRejecting(false);
          setRejectReason('');
        },
        onError: (requestError) => Toast.show({ type: 'error', text1: 'Unable to update leave', text2: getReadableErrorMessage(requestError) }),
      }
    );
  };

  const decidePermissionRequest = (action: 'APPROVE' | 'REJECT', reason?: string) => {
    if (!selectedPermission) return;
    const details = action === 'APPROVE'
      ? { approved_from: permissionApproveFrom, approved_to: permissionApproveTo }
      : { rejection_reason: reason };
    decidePermission.mutate(
      { requestId: String(selectedPermission.permission.id), action, details },
      {
        onSuccess: () => {
          Toast.show({ type: 'success', text1: action === 'APPROVE' ? 'Permission approved' : 'Permission rejected' });
          setSelectedPermission(null);
          setPermissionRejecting(false);
          setRejectReason('');
        },
        onError: (requestError) => Toast.show({ type: 'error', text1: 'Unable to update permission', text2: getReadableErrorMessage(requestError) }),
      }
    );
  };

  const selectPermission = (item: PermissionRequestItem, reject = false) => {
    setSelectedPermission(item);
    setPermissionApproveFrom(String(item.permission.requested_from ?? ''));
    setPermissionApproveTo(String(item.permission.requested_to ?? ''));
    setPermissionRejecting(reject);
  };

  const decideWorkoffRequest = (action: 'APPROVE' | 'REJECT', reason?: string) => {
    if (!selectedWorkoff) return;
    decideWorkoff.mutate(
      { requestId: selectedWorkoff.id, action, rejectionReason: reason },
      {
        onSuccess: () => {
          Toast.show({ type: 'success', text1: action === 'APPROVE' ? 'Sunday work approved' : 'Sunday work rejected' });
          setSelectedWorkoff(null);
          setWorkoffRejecting(false);
          setRejectReason('');
        },
        onError: (requestError) => Toast.show({ type: 'error', text1: 'Unable to update Sunday work', text2: getReadableErrorMessage(requestError) }),
      },
    );
  };

  return (
    <ThemedView style={styles.flex}>
      <View style={styles.header}>
        <ThemedText variant="h1">Requests</ThemedText>
        <View style={styles.headerActions}>
          {history ? (
            <Pressable onPress={() => setFilterSheetOpen(true)} style={[styles.filterButton, { borderColor: border }]}>
              <Ionicons name="options-outline" size={19} color={primary} />
              <ThemedText variant="captionStrong" style={{ color: primary }}>Filter</ThemedText>
            </Pressable>
          ) : null}
          <Pressable onPress={() => {
            if (!history) {
              setHistoryFilters({ period: 'today', month: currentMonthValue() });
            }
            setHistory((value) => !value);
          }} style={[styles.historyButton, { borderColor: border, backgroundColor: history ? primary : 'transparent' }]}>
            <ThemedText variant="bodyStrong" style={history ? { color: '#fff' } : undefined}>
              {history ? 'Back to requests' : 'Approval history'}
            </ThemedText>
          </Pressable>
          <Button
            label="Sunday Work"
            variant={mode === 'workoff' ? 'primary' : 'secondary'}
            onPress={() => setMode('workoff')}
            style={styles.workoffButton}
          />
        </View>
        <View style={[styles.tabs, { borderColor: border }]}>
          {(['attendance', 'leave', 'permission'] as const).map((value) => (
            <Pressable key={value} onPress={() => setMode(value)} style={[styles.tab, mode === value && { backgroundColor: primary }]}>
              <ThemedText variant="bodyStrong" style={mode === value ? { color: '#fff' } : undefined}>
                {value === 'attendance' ? 'Attendance' : value === 'leave' ? 'Leave' : 'Permission'}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      </View>

      {mode === 'attendance' && isLoading ? (
        <LoadingSkeleton rows={5} />
      ) : mode === 'attendance' && isError ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : mode === 'leave' && leaveQuery.isLoading ? (
        <LoadingSkeleton rows={5} />
      ) : mode === 'leave' && leaveQuery.isError ? (
        <ErrorState error={leaveQuery.error} onRetry={leaveQuery.refetch} />
      ) : mode === 'permission' && permissionQuery.isLoading ? (
        <LoadingSkeleton rows={5} />
      ) : mode === 'permission' && permissionQuery.isError ? (
        <ErrorState error={permissionQuery.error} onRetry={permissionQuery.refetch} />
      ) : mode === 'workoff' && workoffQuery.isLoading ? (
        <LoadingSkeleton rows={5} />
      ) : mode === 'workoff' && workoffQuery.isError ? (
        <ErrorState error={workoffQuery.error} onRetry={workoffQuery.refetch} />
      ) : mode === 'leave' ? (
        <FlatList
          data={leaveQuery.data?.requests ?? []}
          keyExtractor={(item) => String(item.leave.id)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <LeaveRequestListItem
              item={item}
              canDecide={canApproveRequests(user?.role) && !history}
              busy={decideLeave.isPending}
              history={history}
              onApprove={() => setSelectedLeave(item)}
              onReject={() => { setSelectedLeave(item); setRejecting(true); }}
            />
          )}
          refreshControl={<RefreshControl refreshing={leaveQuery.isRefetching} onRefresh={leaveQuery.refetch} />}
          ListEmptyComponent={<EmptyState icon="document-text-outline" title={history ? 'No request history' : 'No pending leave requests'} />}
        />
      ) : mode === 'permission' ? (
        <FlatList
          data={permissionQuery.data?.requests ?? []}
          keyExtractor={(item) => String(item.permission.id)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <PermissionRequestListItem
              item={item}
              canDecide={canApproveRequests(user?.role) && !history}
              busy={decidePermission.isPending}
              history={history}
              onApprove={() => selectPermission(item)}
              onReject={() => selectPermission(item, true)}
            />
          )}
          refreshControl={<RefreshControl refreshing={permissionQuery.isRefetching} onRefresh={permissionQuery.refetch} />}
          ListEmptyComponent={<EmptyState icon="document-text-outline" title={history ? 'No request history' : 'No pending permission requests'} />}
        />
      ) : mode === 'workoff' ? (
        <FlatList
          data={workoffQuery.data?.requests ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <WorkoffRequestListItem
              item={item}
              canDecide={canApproveRequests(user?.role) && !history}
              busy={decideWorkoff.isPending}
              history={history}
              onApprove={() => setSelectedWorkoff(item)}
              onReject={() => { setSelectedWorkoff(item); setWorkoffRejecting(true); }}
            />
          )}
          refreshControl={<RefreshControl refreshing={workoffQuery.isRefetching} onRefresh={workoffQuery.refetch} />}
          ListEmptyComponent={<EmptyState icon="calendar-outline" title={history ? 'No request history' : 'No pending Sunday work requests'} />}
        />
      ) : (
        <FlatList
          data={data ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <RequestListItem request={item} history={history} />}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
          ListEmptyComponent={<EmptyState icon="document-text-outline" title={history ? 'No request history' : 'No pending requests'} />}
        />
      )}

      <ConfirmDialog
        visible={!!selectedLeave && !rejecting}
        title="Approve Leave?"
        description="This will approve the employee's leave request and deduct the leave balance."
        confirmLabel="Approve"
        confirmingLabel="Approving..."
        loading={decideLeave.isPending}
        onConfirm={() => decide('APPROVE')}
        onCancel={() => setSelectedLeave(null)}
      />

      {rejecting && selectedLeave ? (
        <View style={styles.rejectOverlay}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.rejectAvoidingView}>
            <View style={styles.rejectCard}>
            <ThemedText variant="h3">Reject Leave</ThemedText>
            <Input label="Reason" required placeholder="Let the employee know why..." value={rejectReason} onChangeText={setRejectReason} multiline />
            <View style={styles.actions}>
              <Button label="Cancel" variant="secondary" onPress={() => { setRejecting(false); setSelectedLeave(null); }} style={styles.action} />
              <Button label="Reject" loadingLabel="Rejecting..." loading={decideLeave.isPending} variant="danger" onPress={() => rejectReason.trim() ? decide('REJECT', rejectReason.trim()) : Toast.show({ type: 'error', text1: 'Rejection reason is required' })} style={styles.action} />
            </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      ) : null}

      <ConfirmDialog
        visible={!!selectedPermission && !permissionRejecting}
        title="Approve Permission?"
        description="The requested permission interval will be approved for this employee."
        confirmLabel="Approve"
        confirmingLabel="Approving..."
        loading={decidePermission.isPending}
        onConfirm={() => permissionApproveFrom && permissionApproveTo ? decidePermissionRequest('APPROVE') : Toast.show({ type: 'error', text1: 'Approved times are required' })}
        onCancel={() => setSelectedPermission(null)}
      />

      {permissionRejecting && selectedPermission ? (
        <View style={styles.rejectOverlay}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.rejectAvoidingView}>
            <View style={styles.rejectCard}>
            <ThemedText variant="h3">Reject Permission</ThemedText>
            <Input label="Reason" required placeholder="Let the employee know why..." value={rejectReason} onChangeText={setRejectReason} multiline />
            <View style={styles.actions}>
              <Button label="Cancel" variant="secondary" onPress={() => { setPermissionRejecting(false); setSelectedPermission(null); }} style={styles.action} />
              <Button label="Reject" loadingLabel="Rejecting..." loading={decidePermission.isPending} variant="danger" onPress={() => rejectReason.trim() ? decidePermissionRequest('REJECT', rejectReason.trim()) : Toast.show({ type: 'error', text1: 'Rejection reason is required' })} style={styles.action} />
            </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      ) : null}

      <ConfirmDialog
        visible={!!selectedWorkoff && !workoffRejecting}
        title="Approve Sunday Work?"
        description="This will approve the employee's Sunday work request as a workoff attendance record."
        confirmLabel="Approve"
        confirmingLabel="Approving..."
        loading={decideWorkoff.isPending}
        onConfirm={() => decideWorkoffRequest('APPROVE')}
        onCancel={() => setSelectedWorkoff(null)}
      />

      {workoffRejecting && selectedWorkoff ? (
        <View style={styles.rejectOverlay}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.rejectAvoidingView}>
            <View style={styles.rejectCard}>
              <ThemedText variant="h3">Reject Sunday Work</ThemedText>
              <Input label="Reason" required placeholder="Let the employee know why..." value={rejectReason} onChangeText={setRejectReason} multiline />
              <View style={styles.actions}>
                <Button label="Cancel" variant="secondary" onPress={() => { setWorkoffRejecting(false); setSelectedWorkoff(null); }} style={styles.action} />
                <Button label="Reject" loadingLabel="Rejecting..." loading={decideWorkoff.isPending} variant="danger" onPress={() => rejectReason.trim() ? decideWorkoffRequest('REJECT', rejectReason.trim()) : Toast.show({ type: 'error', text1: 'Rejection reason is required' })} style={styles.action} />
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      ) : null}

      <FilterSheet
        visible={filterSheetOpen}
        fields={filterFields}
        values={historyFilters}
        onApply={(values) => {
          const nextPeriod = (values.period as ApprovalHistoryPeriod | undefined) ?? 'today';
          setHistoryFilters({ period: nextPeriod, month: values.month ?? currentMonthValue() });
        }}
        onClose={() => setFilterSheetOpen(false)}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { padding: Spacing.xl },
  list: { paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xxxl },
  headerActions: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: Spacing.sm, marginTop: Spacing.md, flexWrap: 'wrap' },
  workoffButton: { minHeight: 42 },
  historyButton: { minHeight: 42, justifyContent: 'center', borderWidth: 1, borderRadius: 8, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm },
  tabs: { flexDirection: 'row', borderWidth: 1, borderRadius: 8, marginTop: Spacing.md, overflow: 'hidden' },
  tab: { flex: 1, alignItems: 'center', paddingVertical: Spacing.sm },
  rejectOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center', padding: Spacing.xl },
  rejectAvoidingView: { width: '100%', flex: 1, alignItems: 'center', justifyContent: 'center' },
  rejectCard: { width: '100%', maxWidth: 400, padding: Spacing.xl, backgroundColor: '#fff', borderRadius: 12 },
  actions: { flexDirection: 'row', gap: Spacing.md },
  action: { flex: 1 },
  filterButton: { minHeight: 42, flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, borderWidth: 1, borderRadius: 8, paddingHorizontal: Spacing.md },
});
