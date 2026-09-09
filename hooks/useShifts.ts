import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as shiftsApi from '@/api/shifts';
import { ShiftPayload } from '@/types/shift';

const key = ['shifts'] as const;

export function useShifts() {
  return useQuery({ queryKey: key, queryFn: shiftsApi.listShifts, staleTime: 1000 * 60 });
}

export function useShift(id: string) {
  return useQuery({ queryKey: [...key, id], queryFn: () => shiftsApi.getShift(id), enabled: !!id });
}

export function useCreateShift() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ShiftPayload) => shiftsApi.createShift(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });
}

export function useUpdateShift(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ShiftPayload) => shiftsApi.updateShift(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: key });
      qc.invalidateQueries({ queryKey: [...key, id] });
    },
  });
}

export function useSetShiftStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: boolean }) => shiftsApi.setShiftStatus(id, status),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: key });
      qc.invalidateQueries({ queryKey: [...key, vars.id] });
    },
  });
}
