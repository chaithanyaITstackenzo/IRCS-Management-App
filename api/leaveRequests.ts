import { fillApi } from './axios';
import { LeaveRequestItem, RequestListResponse } from '@/types/managementRequests';
import { useAuthStore } from '@/store/authStore';
import { MOCK_AUTH_ENABLED } from '@/constants/api';

export async function listLeaveRequests(params: Record<string, string | number | undefined> = {}): Promise<RequestListResponse<LeaveRequestItem>> {
  if (MOCK_AUTH_ENABLED) return { success: true, filters: params, pagination: { total_records: 0 }, requests: [] };
  if (params.status === 'ALL') {
    const responses = await Promise.all(['APPROVED', 'REJECTED'].map((status) => listLeaveRequests({ ...params, status })));
    return { ...responses[0], requests: responses.flatMap((response) => response.requests) };
  }
  const { data } = await fillApi.get<RequestListResponse<LeaveRequestItem>>('/leaveRequests', { params: { page: 1, limit: 50, ...params } });
  return data;
}

export async function decideLeaveRequest(requestId: string, action: 'APPROVE' | 'REJECT', rejection_reason?: string) {
  if (action === 'REJECT' && !rejection_reason?.trim()) throw new Error('Rejection reason is required.');
  if (MOCK_AUTH_ENABLED) return { success: true, status: `LEAVE_${action}`, requestId };
  const user = useAuthStore.getState().user;
  const { data } = await fillApi.put('/leaveRequest', { requestId, action, approvedBy: user?.user_id ?? user?.id, ...(rejection_reason ? { rejectionReason: rejection_reason } : {}) });
  return data;
}
