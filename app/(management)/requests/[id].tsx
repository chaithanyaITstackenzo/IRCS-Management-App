import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { useApproveRequest, useRejectRequest, useRequest } from '@/hooks/useAttendanceRequests';
import { REQUEST_STATUS, REQUEST_TYPE_LABEL } from '@/constants/status';
import { Spacing } from '@/constants/spacing';
import { formatDateTime } from '@/utils/date';
import { getReadableErrorMessage } from '@/utils/errorMessages';
import { canApproveRequests } from '@/utils/permissions';
import { useAuthStore } from '@/store/authStore';

export default function RequestDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: request, isLoading, isError, error, refetch } = useRequest(id);
  const approve = useApproveRequest();
  const reject = useRejectRequest();
  const { user } = useAuthStore();

  const [approveConfirm, setApproveConfirm] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  if (isLoading) return <LoadingSkeleton rows={4} />;
  if (isError || !request) return <ErrorState error={error} onRetry={refetch} />;

  // Prevent duplicate approval/rejection once a decision has already been made (spec §85).
  const isDecided = request.status !== 'PENDING';
  const name = request.employee
    ? `${request.employee.first_name} ${request.employee.last_name ?? ''}`.trim()
    : 'Employee';

  const handleApprove = () => {
    approve.mutate(request.id, {
      onSuccess: () => {
        Toast.show({ type: 'success', text1: 'Request approved' });
        setApproveConfirm(false);
        router.back();
      },
      onError: (err) => {
        Toast.show({ type: 'error', text1: 'Unable to approve request', text2: getReadableErrorMessage(err) });
        setApproveConfirm(false);
      },
    });
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      Toast.show({ type: 'error', text1: 'Rejection reason is required' });
      return;
    }
    reject.mutate(
      { id: request.id, payload: rejectReason.trim() ? { rejection_reason: rejectReason.trim() } : undefined },
      {
        onSuccess: () => {
          Toast.show({ type: 'success', text1: 'Request rejected' });
          setRejectDialogOpen(false);
          router.back();
        },
        onError: (err) => {
          Toast.show({ type: 'error', text1: 'Unable to reject request', text2: getReadableErrorMessage(err) });
        },
      }
    );
  };

  return (
    <ThemedView style={styles.flex}>
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.section}>
          <View style={styles.rowBetween}>
            <ThemedText variant="h2">{name}</ThemedText>
            <StatusBadge meta={REQUEST_STATUS[request.status]} />
          </View>
          <Row label="Type" value={REQUEST_TYPE_LABEL[request.request_type] ?? request.request_type} />
          <Row label="Requested" value={formatDateTime(request.requested_time)} />
          <Row label="Submitted" value={formatDateTime(request.created_at)} />
        </Card>

        <Card style={styles.section}>
          <ThemedText variant="h3" style={{ marginBottom: Spacing.sm }}>
            Reason
          </ThemedText>
          <ThemedText variant="body">{request.reason}</ThemedText>
        </Card>

        {request.status === 'REJECTED' && request.rejection_reason ? (
          <Card style={styles.section}>
            <ThemedText variant="h3" style={{ marginBottom: Spacing.sm }}>
              Rejection Reason
            </ThemedText>
            <ThemedText variant="body">{request.rejection_reason}</ThemedText>
          </Card>
        ) : null}

        {canApproveRequests(user?.role) && !isDecided ? (
          <View style={styles.actions}>
            <Button
              label="Reject"
              variant="danger"
              style={styles.actionBtn}
              onPress={() => setRejectDialogOpen(true)}
            />
            <Button label="Approve" style={styles.actionBtn} onPress={() => setApproveConfirm(true)} />
          </View>
        ) : null}
      </ScrollView>

      <ConfirmDialog
        visible={approveConfirm}
        title="Approve Request?"
        description={`This will approve the ${REQUEST_TYPE_LABEL[request.request_type]?.toLowerCase() ?? 'attendance'} request for ${name}.`}
        confirmLabel="Approve"
        confirmingLabel="Approving..."
        loading={approve.isPending}
        onConfirm={handleApprove}
        onCancel={() => setApproveConfirm(false)}
      />

      {rejectDialogOpen ? (
        <View style={styles.rejectOverlay}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.rejectAvoidingView}>
            <Card style={styles.rejectCard}>
            <ThemedText variant="h3" style={{ marginBottom: Spacing.md }}>
              Reject Request
            </ThemedText>
            <Input
              label="Reason"
              required
              placeholder="Let the employee know why..."
              value={rejectReason}
              onChangeText={setRejectReason}
              multiline
            />
            <View style={styles.actions}>
              <Button
                label="Cancel"
                variant="secondary"
                style={styles.actionBtn}
                onPress={() => setRejectDialogOpen(false)}
                disabled={reject.isPending}
              />
              <Button
                label="Reject"
                loadingLabel="Rejecting..."
                loading={reject.isPending}
                variant="danger"
                style={styles.actionBtn}
                onPress={handleReject}
              />
            </View>
            </Card>
          </KeyboardAvoidingView>
        </View>
      ) : null}
    </ThemedView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.rowBetween}>
      <ThemedText variant="body" muted>
        {label}
      </ThemedText>
      <ThemedText variant="bodyStrong">{value}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: Spacing.xl, paddingBottom: Spacing.xxxl, gap: Spacing.lg },
  section: { gap: Spacing.sm },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  actions: { flexDirection: 'row', gap: Spacing.md },
  actionBtn: { flex: 1 },
  rejectOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  rejectAvoidingView: { width: '100%', flex: 1, alignItems: 'center', justifyContent: 'center' },
  rejectCard: { width: '100%', maxWidth: 400 },
});
