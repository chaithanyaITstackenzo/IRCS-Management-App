export type AttendanceRequestType =
  | 'LATE_ARRIVAL'
  | 'OUTSIDE_WORK'
  | 'EARLY_GOING'
  | 'PERMISSION_END_LATE';

export type AttendanceRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface AttendanceRequest {
  id: string;
  employee_id: string;
  attendance_id: string | null;
  request_type: AttendanceRequestType;
  requested_time: string | null;
  reason: string;
  status: AttendanceRequestStatus;
  approved_by: string | null;
  approved_at: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;

  employee?: {
    id: string;
    employee_code: string;
    first_name: string;
    last_name: string | null;
    profile_photo_url: string | null;
  };
}

// TODO BACKEND CONTRACT REQUIRED: exact reject payload (rejection reason field name) is not confirmed.
export interface AttendanceRequestRejectPayload {
  rejection_reason?: string;
}
