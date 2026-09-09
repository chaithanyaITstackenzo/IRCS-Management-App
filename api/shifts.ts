import { Shift, ShiftPayload } from '@/types/shift';
import { listShifts as list } from './master';
import { MOCK_AUTH_ENABLED } from '@/constants/api';
import * as mock from './mockData';

export async function listShifts(): Promise<Shift[]> {
  return list();
}

export async function getShift(id: string): Promise<Shift> {
  if (MOCK_AUTH_ENABLED) return (await mock.mockListShifts()).find((item) => item.id === id) as Shift;
  throw new Error(`Shift details are available from the shift list only (requested ${id}).`);
}

// Never send a derived is_overnight flag — see utils/shift.ts.
export async function createShift(payload: ShiftPayload): Promise<Shift> {
  void payload;
  throw new Error('Shift creation is not supported by the backend.');
}

export async function updateShift(id: string, payload: ShiftPayload): Promise<Shift> {
  void id; void payload;
  throw new Error('Shift editing is not supported by the backend.');
}

export async function setShiftStatus(id: string, status: boolean): Promise<Shift> {
  void id; void status;
  throw new Error('Shift activation changes are not supported by the backend.');
}
