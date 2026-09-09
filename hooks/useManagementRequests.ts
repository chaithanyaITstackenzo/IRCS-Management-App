import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as permissionApi from '@/api/permissionRequests';
import * as leaveApi from '@/api/leaveRequests';
import * as notificationsApi from '@/api/notifications';
import * as workoffApi from '@/api/workoffRequests';

export function usePermissionRequests(params: Record<string, string | number | undefined> = {}) {
  return useQuery({ queryKey: ['permission-requests', params], queryFn: () => permissionApi.listPermissionRequests(params) });
}

export function useDecidePermissionRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ requestId, action, details }: { requestId: string; action: 'APPROVE' | 'REJECT'; details?: { approved_from?: string; approved_to?: string; rejection_reason?: string } }) => permissionApi.decidePermissionRequest(requestId, action, details),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['permission-requests'] }),
  });
}

export function useLeaveRequests(params: Record<string, string | number | undefined> = {}) {
  return useQuery({ queryKey: ['leave-requests', params], queryFn: () => leaveApi.listLeaveRequests(params) });
}

export function useDecideLeaveRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ requestId, action, rejection_reason }: { requestId: string; action: 'APPROVE' | 'REJECT'; rejection_reason?: string }) => leaveApi.decideLeaveRequest(requestId, action, rejection_reason),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['leave-requests'] }),
  });
}

export function useWorkoffRequests(params: Record<string, string | number | undefined> = {}) {
  return useQuery({ queryKey: ['workoff-requests', params], queryFn: () => workoffApi.listWorkoffRequests(params) });
}

export function useDecideWorkoffRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ requestId, action, rejectionReason }: { requestId: string; action: 'APPROVE' | 'REJECT'; rejectionReason?: string }) =>
      workoffApi.decideWorkoffRequest(requestId, action, rejectionReason),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['workoff-requests'] }),
  });
}

export function useNotifications() {
  return useQuery({ queryKey: ['notifications'], queryFn: notificationsApi.listNotifications, retry: false });
}
