import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createRole, deactivateRole, listRoles } from '@/api/roles';

export function useRoles() {
  return useQuery({ queryKey: ['roles'], queryFn: listRoles, staleTime: 1000 * 60 * 5 });
}

export function useCreateRole() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: createRole, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['roles'] }) });
}

export function useDeactivateRole() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: deactivateRole, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['roles'] }) });
}
