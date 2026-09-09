import { fillApi } from './axios';
import { PermissionRequestItem, RequestListResponse } from '@/types/managementRequests';
import { useAuthStore } from '@/store/authStore';
import { MOCK_AUTH_ENABLED } from '@/constants/api';

export async function listPermissionRequests(params: Record<string, string | number | undefined> = {}) {
  if (MOCK_AUTH_ENABLED) return { success: true, filters: params, pagination: { total_records: 0 }, requests: [] };
  const { data } = await fillApi.get<RequestListResponse<PermissionRequestItem>>('/getpermissionRequests', { params: { status: 'PENDING', page: 1, ...params } });
  return data;
}

export async function decidePermissionRequest(requestId: string, action: 'APPROVE' | 'REJECT', details: { approved_from?: string; approved_to?: string; rejection_reason?: string } = {}) {
  if (action === 'REJECT' && !details.rejection_reason?.trim()) throw new Error('Rejection reason is required.');
  if (MOCK_AUTH_ENABLED) return { success: true, status: `PERMISSION_${action}`, requestId };
  const { data } = await fillApi.put(`/permissionRequest/${requestId}`, { action, approved_by: useAuthStore.getState().user?.user_id, ...details });
  return data;
}
