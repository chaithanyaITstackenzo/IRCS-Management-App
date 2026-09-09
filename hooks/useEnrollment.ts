import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as enrollmentApi from '@/api/enrollment';
import { EnrollmentCaptureImage } from '@/types/enrollment';

// This hook layer is ready; api/enrollment.ts intentionally throws until
// Thoufiq's enrollment contract is confirmed (spec §17/§96).
export function useEnrollmentStatus(employeeId: string) {
  return useQuery({
    queryKey: ['enrollment', employeeId],
    queryFn: () => enrollmentApi.getEnrollmentStatus(employeeId),
    enabled: !!employeeId,
    retry: false,
  });
}

export function useSubmitEnrollment(employeeId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (images: EnrollmentCaptureImage[]) => enrollmentApi.submitEnrollmentImages(employeeId, images),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['enrollment', employeeId] });
      qc.invalidateQueries({ queryKey: ['employees', employeeId] });
    },
  });
}
