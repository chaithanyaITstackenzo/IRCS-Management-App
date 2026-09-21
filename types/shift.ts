export interface Shift {
  id: string;
  name: string;
  /** ISO timestamp or a time string as returned by the backend. */
  start_time: string;
  end_time: string;
  status: boolean;
  grace_period_minutes?: number;
  second_window_start?: string | null;
  second_window_grace_period_minutes?: number;
  employee_count?: number;
  created_at: string;
  updated_at: string;
}

export interface ShiftPayload {
  name: string;
  start_time: string;
  end_time: string;
  grace_period_minutes?: number;
  second_window_start?: string | null;
  second_window_grace_period_minutes?: number;
  status?: boolean;
}
