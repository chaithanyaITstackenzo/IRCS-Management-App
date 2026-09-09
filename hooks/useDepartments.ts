import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as departmentsApi from '@/api/departments';
import { DepartmentPayload } from '@/types/department';

const key = ['departments'] as const;

export function useDepartments() {
  return useQuery({ queryKey: key, queryFn: departmentsApi.listDepartments, staleTime: 1000 * 60 });
}

export function useDepartment(id: string) {
  return useQuery({
    queryKey: [...key, id],
    queryFn: () => departmentsApi.getDepartment(id),
    enabled: !!id,
  });
}

export function useCreateDepartment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: DepartmentPayload) => departmentsApi.createDepartment(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });
}

export function useUpdateDepartment(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: DepartmentPayload) => departmentsApi.updateDepartment(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: key });
      qc.invalidateQueries({ queryKey: [...key, id] });
    },
  });
}

export function useSetDepartmentStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: boolean }) =>
      departmentsApi.setDepartmentStatus(id, status),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: key });
      qc.invalidateQueries({ queryKey: [...key, vars.id] });
      qc.invalidateQueries({ queryKey: ['dashboard', 'management'] });
    },
  });
}
