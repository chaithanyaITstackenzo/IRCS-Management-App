import { uploadApi } from './axios';

export interface SpeakerAudioUploadResult {
  speakerId: string;
  speakerCode: string;
  ipAddress: string | null;
  success: boolean;
  message: string;
}

export interface SpeakerAudioUploadResponse {
  success: boolean;
  message: string;
  employee: {
    id: string;
    employeeCode: string;
    name: string;
  };
  audio: {
    id: string;
    fileName: string;
    originalFormat: string;
    audioFormat: string;
    fileSize: number;
    masterPath: string;
  };
  uploadType: 'ALL' | 'SINGLE';
  totalSpeakers: number;
  successfulUploads: number;
  failedUploads: number;
  results: SpeakerAudioUploadResult[];
}

export async function uploadEmployeeNameAudio(
  employeeId: string,
  uri: string,
): Promise<SpeakerAudioUploadResponse> {
  const formData = new FormData();
  formData.append('audio', {
    uri,
    name: 'employee-name-recording.m4a',
    type: 'audio/m4a',
  } as unknown as Blob);
  formData.append('employeeId', employeeId);
  formData.append('uploadType', 'ALL');

  const { data } = await uploadApi.post<SpeakerAudioUploadResponse>('/speaker/upload-audio', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60000,
  });
  return data;
}