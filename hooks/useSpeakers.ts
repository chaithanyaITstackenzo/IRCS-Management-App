import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as speakersApi from '@/api/speakers';
import { SpeakerPayload } from '@/types/speaker';

const key = ['speakers'] as const;

export function useSpeakers() {
  return useQuery({ queryKey: key, queryFn: speakersApi.listSpeakers, staleTime: 1000 * 30 });
}

export function useSpeaker(id: string) {
  return useQuery({ queryKey: [...key, id], queryFn: () => speakersApi.getSpeaker(id), enabled: !!id });
}

export function useCreateSpeaker() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: SpeakerPayload) => speakersApi.createSpeaker(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });
}

export function useUpdateSpeaker(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<SpeakerPayload>) => speakersApi.updateSpeaker(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: key });
      qc.invalidateQueries({ queryKey: [...key, id] });
    },
  });
}

export function useSetSpeakerStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: boolean }) => speakersApi.setSpeakerStatus(id, status),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: key });
      qc.invalidateQueries({ queryKey: [...key, vars.id] });
    },
  });
}

export function useTestSpeaker() {
  return useMutation({ mutationFn: (id: string) => speakersApi.testSpeaker(id) });
}
