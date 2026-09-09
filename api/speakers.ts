import { Speaker, SpeakerPayload, SpeakerTestResult } from '@/types/speaker';
import { MOCK_AUTH_ENABLED } from '@/constants/api';
import * as mock from './mockData';
const UNSUPPORTED = 'Speaker management is not available from the backend.';

export async function listSpeakers(): Promise<Speaker[]> {
  if (MOCK_AUTH_ENABLED) return mock.mockListSpeakers(); throw new Error(UNSUPPORTED);
}

export async function getSpeaker(id: string): Promise<Speaker> {
  if (MOCK_AUTH_ENABLED) return mock.mockGetSpeaker(id); void id; throw new Error(UNSUPPORTED);
}

// Camera selection must always be populated from api/cameras.ts — never hardcoded.
export async function createSpeaker(payload: SpeakerPayload): Promise<Speaker> {
  if (MOCK_AUTH_ENABLED) return mock.mockCreateSpeaker(payload); void payload; throw new Error(UNSUPPORTED);
}

export async function updateSpeaker(id: string, payload: Partial<SpeakerPayload>): Promise<Speaker> {
  if (MOCK_AUTH_ENABLED) return mock.mockUpdateSpeaker(id, payload); void id; void payload; throw new Error(UNSUPPORTED);
}

export async function setSpeakerStatus(id: string, status: boolean): Promise<Speaker> {
  if (MOCK_AUTH_ENABLED) return mock.mockSetSpeakerStatus(id, status); void id; void status; throw new Error(UNSUPPORTED);
}

export async function testSpeaker(id: string): Promise<SpeakerTestResult> {
  if (MOCK_AUTH_ENABLED) return mock.mockTestSpeaker(id); void id; throw new Error(UNSUPPORTED);
}
