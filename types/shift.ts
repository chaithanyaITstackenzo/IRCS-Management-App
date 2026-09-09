export interface Shift {
  id: string;
  name: string;
  /** "HH:mm" or "HH:mm:ss" as returned by backend TIME column */
  start_time: string;
  end_time: string;
  status: boolean;
  created_at: string;
  updated_at: string;
}

export interface ShiftPayload {
  name: string;
  start_time: string;
  end_time: string;
}
