export interface AttendanceRecord {
  id: string;
  emp_id: string;
  attendance_date: string;
  in_time: string | null;
  out_time: string | null;

  in_time_outside: boolean;
  out_time_outside: boolean;
  in_time_outside_approved: boolean | null;
  out_time_outside_approved: boolean | null;
  in_time_outside_reason: string | null;
  out_time_outside_reason: string | null;

  in_time_late: boolean;
  in_time_late_reason: string | null;

  out_time_permission: boolean;
  out_time_permission_approved: boolean | null;
  out_time_permission_reason: string | null;

  /** Postgres INTERVAL — arrives as an ISO-8601 duration string or "HH:MM:SS", handle both in formatDuration() */
  total_hours_worked: string | number | null;

  in_latitude: number | null;
  in_longitude: number | null;
  out_latitude: number | null;
  out_longitude: number | null;

  cctv_in: boolean;
  cctv_out: boolean;

  early_going: boolean;
  early_going_reason: string | null;
  early_going_approved: boolean | null;

  created_at: string;
  updated_at: string;

  // Optional embed
  employee?: {
    id: string;
    employee_code: string;
    first_name: string;
    last_name: string | null;
    profile_photo_url: string | null;
  };
}

export interface AttendanceListParams {
  filter?: 'today' | 'week' | 'month' | 'all';
  page?: number;
  limit?: number;
  employeeId?: string;
  employeeCode?: string;
  date?: string;
  fromDate?: string;
  toDate?: string;
}

export interface AttendanceSummary {
  total_employees: number;
  present: number;
  absent: number;
  late: number;
  currently_inside?: number;
}
