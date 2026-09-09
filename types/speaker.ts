export interface Speaker {
  id: string;
  name: string;
  speaker_code: string;
  camera_id: string;
  ip_address: string;
  location: string;
  status: boolean;
  created_at: string;
  updated_at: string;

  camera?: {
    id: string;
    name: string;
    camera_code: string;
  };
}

export interface SpeakerPayload {
  name: string;
  speaker_code: string;
  camera_id: string;
  ip_address: string;
  location: string;
}

export interface SpeakerTestResult {
  success: boolean;
  message: string;
}
