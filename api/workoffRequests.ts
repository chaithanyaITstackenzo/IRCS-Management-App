import { fillApi } from './axios';
import { useAuthStore } from '@/store/authStore';
import { MOCK_AUTH_ENABLED } from '@/constants/api';
import { WorkoffRequest, WorkoffRequestListResponse } from '@/types/managementRequests';

export async function listWorkoffRequests(params: Record<string, string | number | undefined> = {}) {
  if (MOCK_AUTH_ENABLED) return { success: true, total: 0, requests: [] as WorkoffRequest[] };
  const { data } = await fillApi.get<WorkoffRequestListResponse>('/workoff/requests', { params: { status: 'PENDING', ...params } });
  return data;
}

export async function decideWorkoffRequest(requestId: string, action: 'APPROVE' | 'REJECT', rejectionReason?: string) {
  if (action === 'REJECT' && !rejectionReason?.trim()) throw new Error('Rejection reason is required.');
  if (MOCK_AUTH_ENABLED) return { success: true, status: `WORKOFF_${action}`, requestId };
  const { data } = await fillApi.put('/workoff/manage', {
    workoffId: requestId,
    action,
    userId: useAuthStore.getState().user?.user_id,
    ...(rejectionReason ? { rejectionReason } : {}),
  });
  return data;
}