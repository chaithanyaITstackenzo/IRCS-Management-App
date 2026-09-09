export interface Camera {
  id: string;
  name: string;
  camera_code: string;
  ip_address: string;
  rtsp_url: string;
  username: string;
  /** Never populated by the backend in list/detail responses — write-only field. */
  password?: never;
  location: string;
  status: boolean;
  created_at: string;
  updated_at: string;
}

export interface CameraPayload {
  name: string;
  camera_code: string;
  ip_address: string;
  rtsp_url: string;
  username: string;
  password: string;
  location: string;
}

export interface CameraTestResult {
  success: boolean;
  message: string;
  latency_ms?: number;
}
