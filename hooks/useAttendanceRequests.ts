import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as requestsApi from '@/api/attendanceRequests';
import { AttendanceRequestRejectPayload } from '@/types/request';

const key = ['attendance-requests'] as const;

export function usePendingRequests(status: 'PENDING' | 'ALL' = 'PENDING', params: Record<string, string | number | undefined> = {}) {
  return useQuery({ queryKey: [...key, status.toLowerCase(), params], queryFn: () => requestsApi.listRequests(status, params), staleTime: 1000 * 20 });
}

export function useRequest(id: string) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: [...key, id],
    queryFn: async () => {
      const cachedQueries = queryClient.getQueriesData<import('@/types/request').AttendanceRequest[]>({
        queryKey: [...key, 'pending'],
      });
      const request = cachedQueries
        .flatMap(([, requests]) => requests ?? [])
        .find((item) => item.id === id);
      if (!request) throw new Error('Request details are not available. Return to the request list and try again.');
      return request;
    },
    enabled: !!id,
  });
}

function invalidateAfterDecision(qc: ReturnType<typeof useQueryClient>, id: string) {
  qc.invalidateQueries({ queryKey: key });
  qc.invalidateQueries({ queryKey: [...key, id] });
  qc.invalidateQueries({ queryKey: ['dashboard', 'management'] });
}

export function useApproveRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => requestsApi.approveRequest(id),
    onSuccess: (_data, id) => invalidateAfterDecision(qc, id),
  });
}

export function useRejectRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload?: AttendanceRequestRejectPayload }) =>
      requestsApi.rejectRequest(id, payload),
    onSuccess: (_data, vars) => invalidateAfterDecision(qc, vars.id),
  });
}
