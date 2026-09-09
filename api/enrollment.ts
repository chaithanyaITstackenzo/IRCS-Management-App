import { EnrollmentCaptureImage, FaceEnrollment } from '@/types/enrollment';
import { MOCK_AUTH_ENABLED } from '@/constants/api';
import * as mock from './mockData';

/**
 * ============================================================================
 * The backend does not expose a face-enrollment management API.
 * ============================================================================
 */

const ENROLLMENT_NOT_CONFIGURED =
  'Face enrollment is not yet connected to the backend. Ask Thoufiq for the finalized enrollment API contract, then implement it in api/enrollment.ts.';

export async function getEnrollmentStatus(_employeeId: string): Promise<FaceEnrollment | null> {
  if (MOCK_AUTH_ENABLED) return mock.mockEnrollmentStatus(_employeeId);
  throw new Error(ENROLLMENT_NOT_CONFIGURED);
}

export async function submitEnrollmentImages(
  _employeeId: string,
  _images: EnrollmentCaptureImage[]
): Promise<FaceEnrollment> {
  if (MOCK_AUTH_ENABLED) return mock.mockSubmitEnrollment(_employeeId, _images);
  throw new Error(ENROLLMENT_NOT_CONFIGURED);
}
