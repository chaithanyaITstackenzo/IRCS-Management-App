export interface PermissionRequestItem {
  permission: Record<string, unknown>;
  employee: { id: string; employee_code: string; name: string; email?: string };
  shift?: Record<string, unknown>;
  attendance?: Record<string, unknown>;
}

export interface LeaveRequestItem {
  leave: Record<string, unknown>;
  employee: { id: string; employee_code: string; name: string; email?: string };
}

export interface WorkoffRequest {
  id: string;
  employee_id: string;
  attendance_id: string;
  worked_date: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approved_by?: string | null;
  approved_at?: string | null;
  rejection_reason?: string | null;
  created_at: string;
  updated_at?: string;
  employee_code: string;
  employee_name: string;
  email?: string;
  department?: string | null;
  attendance_date?: string | null;
  in_time?: string | null;
  out_time?: string | null;
  total_hours_worked?: string | null;
}

export interface WorkoffRequestListResponse {
  success: boolean;
  total: number;
  requests: WorkoffRequest[];
}

export interface RequestListResponse<T> {
  success: boolean;
  filters: Record<string, unknown>;
  pagination: Record<string, unknown>;
  requests: T[];
}

export interface Notification {
  id: string;
  from_user_id?: string;
  from_name?: string;
  to_user_id?: string;
  to_name?: string;
  type?: string;
  action?: 'APPROVE' | 'REJECT';
  attendance_request_id?: string;
  attendance_id?: string;
  request_id?: string;
  requestId?: string;
  reference_id?: string;
  referenceId?: string;
  screen?: string;
  message: string;
  rejection_reason?: string;
  is_read: boolean;
  timestamp: number;
}
