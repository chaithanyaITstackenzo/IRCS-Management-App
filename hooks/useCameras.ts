import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as camerasApi from '@/api/cameras';
import { CameraPayload } from '@/types/camera';

const key = ['cameras'] as const;

export function useCameras() {
  return useQuery({ queryKey: key, queryFn: camerasApi.listCameras, staleTime: 1000 * 30 });
}

export function useCamera(id: string) {
  return useQuery({ queryKey: [...key, id], queryFn: () => camerasApi.getCamera(id), enabled: !!id });
}

export function useCreateCamera() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CameraPayload) => camerasApi.createCamera(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: key });
      qc.invalidateQueries({ queryKey: ['dashboard', 'management'] });
    },
  });
}

export function useUpdateCamera(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<CameraPayload>) => camerasApi.updateCamera(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: key });
      qc.invalidateQueries({ queryKey: [...key, id] });
    },
  });
}

export function useSetCameraStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: boolean }) => camerasApi.setCameraStatus(id, status),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: key });
      qc.invalidateQueries({ queryKey: [...key, vars.id] });
      qc.invalidateQueries({ queryKey: ['dashboard', 'management'] });
    },
  });
}

export function useTestCamera() {
  return useMutation({ mutationFn: (id: string) => camerasApi.testCamera(id) });
}
