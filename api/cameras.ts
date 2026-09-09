import { Camera, CameraPayload, CameraTestResult } from '@/types/camera';
import { MOCK_AUTH_ENABLED } from '@/constants/api';
import * as mock from './mockData';
const UNSUPPORTED = 'Camera management is not available from the backend.';

// The API is the single source of truth for the camera list — never hardcode
// CAM001..CAM006 in the frontend (spec §29/§65).
export async function listCameras(): Promise<Camera[]> {
  if (MOCK_AUTH_ENABLED) return mock.mockListCameras(); throw new Error(UNSUPPORTED);
}

export async function getCamera(id: string): Promise<Camera> {
  if (MOCK_AUTH_ENABLED) return mock.mockGetCamera(id); void id; throw new Error(UNSUPPORTED);
}

export async function createCamera(payload: CameraPayload): Promise<Camera> {
  if (MOCK_AUTH_ENABLED) return mock.mockCreateCamera(payload); void payload; throw new Error(UNSUPPORTED);
}

export async function updateCamera(id: string, payload: Partial<CameraPayload>): Promise<Camera> {
  if (MOCK_AUTH_ENABLED) return mock.mockUpdateCamera(id, payload); void id; void payload; throw new Error(UNSUPPORTED);
}

export async function setCameraStatus(id: string, status: boolean): Promise<Camera> {
  if (MOCK_AUTH_ENABLED) return mock.mockSetCameraStatus(id, status); void id; void status; throw new Error(UNSUPPORTED);
}

export async function testCamera(id: string): Promise<CameraTestResult> {
  if (MOCK_AUTH_ENABLED) return mock.mockTestCamera(id); void id; throw new Error(UNSUPPORTED);
}

export async function getCameraStatus(id: string): Promise<{ status: boolean }> {
  if (MOCK_AUTH_ENABLED) return mock.mockGetCameraStatus(id); void id; throw new Error(UNSUPPORTED);
}
