import { fillApi } from './axios';
import { LeaveRequestItem, RequestListResponse } from '@/types/managementRequests';
import { useAuthStore } from '@/store/authStore';
import { MOCK_AUTH_ENABLED } from '@/constants/api';

export async function listLeaveRequests(params: Record<string, string | number | undefined> = {}) {
  if (MOCK_AUTH_ENABLED) return { success: true, filters: params, pagination: { total_records: 0 }, requests: [] };
  const { data } = await fillApi.get<RequestListResponse<LeaveRequestItem>>('/leaveRequests', { params: { status: 'PENDING', page: 1, limit: 50, ...params } });
  return data;
}

export async function decideLeaveRequest(requestId: string, action: 'APPROVE' | 'REJECT', rejection_reason?: string) {
  if (action === 'REJECT' && !rejection_reason?.trim()) throw new Error('Rejection reason is required.');
  if (MOCK_AUTH_ENABLED) return { success: true, status: `LEAVE_${action}`, requestId };
  const { data } = await fillApi.put('/leaveRequest', { requestId, action, approvedBy: useAuthStore.getState().user?.user_id, ...(rejection_reason ? { rejection_reason } : {}) });
  return data;
}
