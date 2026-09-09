export type EnrollmentStatus = 'NOT_STARTED' | 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface FaceEnrollment {
  id: string;
  employee_id: string;
  status: Exclude<EnrollmentStatus, 'NOT_STARTED'>;
  image_count: number;
  model_version: string | null;
  enrolled_at: string | null;
  updated_at: string;
}

export interface FaceEnrollmentImage {
  id: string;
  enrollment_id: string;
  image_reference: string;
  created_at: string;
}

/**
 * TODO BACKEND CONTRACT REQUIRED (spec §17 / §96):
 * The exact enrollment endpoint names and multipart upload payload have not been
 * provided by Thoufiq yet. This type describes the UI-side capture buffer only —
 * it is NOT a confirmed request body. Update once the backend contract lands.
 */
export interface EnrollmentCaptureImage {
  localUri: string;
  width?: number;
  height?: number;
}
