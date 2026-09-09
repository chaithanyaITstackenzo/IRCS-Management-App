import { Shift } from '@/types/shift';
import { formatTimeOnly } from './date';

/**
 * V1 has no is_overnight column. Overnight shifts are derived purely from the
 * time values: if the shift ends before it starts, it spans into the next day.
 * Never send a derived is_overnight field back to the backend.
 */
export function isOvernightShift(startTime: string, endTime: string): boolean {
  return normalizeTime(endTime) < normalizeTime(startTime);
}

function normalizeTime(t: string): string {
  // "09:00" and "09:00:00" must compare equal in the overnight check.
  return t.length === 5 ? `${t}:00` : t;
}

export function shiftTypeLabel(shift: Pick<Shift, 'start_time' | 'end_time'>): 'Overnight' | 'Normal' {
  return isOvernightShift(shift.start_time, shift.end_time) ? 'Overnight' : 'Normal';
}

export function formatShiftRange(shift: Pick<Shift, 'start_time' | 'end_time'>): string {
  return `${formatTimeOnly(shift.start_time)} → ${formatTimeOnly(shift.end_time)}`;
}
