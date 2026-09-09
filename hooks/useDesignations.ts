import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as designationsApi from '@/api/designations';
import { DesignationPayload } from '@/types/designation';

const key = ['designations'] as const;

export function useDesignations() {
  return useQuery({ queryKey: key, queryFn: designationsApi.listDesignations, staleTime: 1000 * 60 });
}

export function useDesignation(id: string) {
  return useQuery({
    queryKey: [...key, id],
    queryFn: () => designationsApi.getDesignation(id),
    enabled: !!id,
  });
}

export function useCreateDesignation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: DesignationPayload) => designationsApi.createDesignation(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });
}

export function useUpdateDesignation(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: DesignationPayload) => designationsApi.updateDesignation(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: key });
      qc.invalidateQueries({ queryKey: [...key, id] });
    },
  });
}

export function useSetDesignationStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: boolean }) =>
      designationsApi.setDesignationStatus(id, status),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: key });
      qc.invalidateQueries({ queryKey: [...key, vars.id] });
    },
  });
}
