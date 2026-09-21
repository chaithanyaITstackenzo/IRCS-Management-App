import { Shift, ShiftPayload } from '@/types/shift';
import { shiftsApi } from './axios';
import { MOCK_AUTH_ENABLED } from '@/constants/api';
import * as mock from './mockData';

export async function listShifts(): Promise<Shift[]> {
  if (MOCK_AUTH_ENABLED) return mock.mockListShifts() as Promise<Shift[]>;
  const { data } = await shiftsApi.get<{ count: number; data: Shift[] }>('/get');
  return data.data;
}

export async function getShift(id: string): Promise<Shift> {
  if (MOCK_AUTH_ENABLED) return (await mock.mockListShifts()).find((item) => item.id === id) as Shift;
  const { data } = await shiftsApi.get<{ data: Shift }>(`/get/${id}`);
  return data.data;
}

export async function createShift(payload: ShiftPayload): Promise<Shift> {
  if (MOCK_AUTH_ENABLED) throw new Error('Shift creation requires the backend shift route.');
  const { data } = await shiftsApi.post<{ message: string; data: Shift }>('/add', withDefaults(payload));
  return data.data;
}

export async function updateShift(id: string, payload: ShiftPayload): Promise<Shift> {
  if (MOCK_AUTH_ENABLED) throw new Error('Shift editing requires the backend shift route.');
  const { data } = await shiftsApi.put<{ message: string; data: Shift }>(`/update/${id}`, payload);
  return data.data;
}

export async function setShiftStatus(id: string, status: boolean): Promise<Shift> {
  if (MOCK_AUTH_ENABLED) throw new Error('Shift status changes require the backend shift route.');
  const { data } = await shiftsApi.put<{ message: string; data: Shift }>(`/update/${id}`, { status });
  return data.data;
}

export async function deleteShift(id: string): Promise<void> {
  if (MOCK_AUTH_ENABLED) throw new Error('Shift deletion requires the backend shift route.');
  await shiftsApi.delete(`/delete/${id}`);
}

function withDefaults(payload: ShiftPayload): Required<Pick<ShiftPayload, 'name' | 'start_time' | 'end_time' | 'grace_period_minutes' | 'second_window_start' | 'second_window_grace_period_minutes' | 'status'>> {
  return {
    name: payload.name,
    start_time: payload.start_time,
    end_time: payload.end_time,
    grace_period_minutes: payload.grace_period_minutes ?? 0,
    second_window_start: payload.second_window_start ?? null,
    second_window_grace_period_minutes: payload.second_window_grace_period_minutes ?? 10,
    status: payload.status ?? true,
  };
}
