import { fillApi } from './axios';
import { useAuthStore } from '@/store/authStore';
import { MOCK_AUTH_ENABLED } from '@/constants/api';
import { WorkoffRequest, WorkoffRequestListResponse } from '@/types/managementRequests';

export async function listWorkoffRequests(params: Record<string, string | number | undefined> = {}): Promise<WorkoffRequestListResponse> {
  if (MOCK_AUTH_ENABLED) return { success: true, total: 0, requests: [] as WorkoffRequest[] };
  if (params.status === 'ALL') {
    const responses = await Promise.all(['APPROVED', 'REJECTED'].map((status) => listWorkoffRequests({ ...params, status })));
    return { ...responses[0], requests: responses.flatMap((response) => response.requests) };
  }
  const { data } = await fillApi.get<WorkoffRequestListResponse>('/workoff/requests', { params });
  return params.status === 'PENDING'
    ? { ...data, requests: data.requests.filter((request) => request.status === 'PENDING') }
    : data;
}

export async function decideWorkoffRequest(requestId: string, action: 'APPROVE' | 'REJECT', rejectionReason?: string) {
  if (action === 'REJECT' && !rejectionReason?.trim()) throw new Error('Rejection reason is required.');
  if (MOCK_AUTH_ENABLED) return { success: true, status: `WORKOFF_${action}`, requestId };
  const user = useAuthStore.getState().user;
  const { data } = await fillApi.put('/workoff/manage', {
    workoffId: requestId,
    action,
    userId: user?.user_id ?? user?.id,
    ...(rejectionReason ? { rejectionReason } : {}),
  });
  return data;
}