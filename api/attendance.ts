import { fillApi } from './axios';
import { AttendanceListParams, AttendanceRecord, AttendanceSummary } from '@/types/attendance';
import { MOCK_AUTH_ENABLED } from '@/constants/api';
import * as mock from './mockData';

interface AttendanceAdminRecord {
  attendance_id: string;
  employee?: { id: string; employee_code: string; name: string; email?: string; mobile?: string };
  department?: { id: string; name: string };
  date: string;
  In_Time?: string | null; In_Time_late?: boolean; delay_in_reason?: string | null; In_Time_reason?: string | null;
  In_time_outside?: boolean; In_time_approved?: boolean; Out_time?: string | null; Out_time_reason?: string | null;
  Out_time_outside?: boolean; Out_time_approved?: boolean; Out_time_permission?: boolean;
  Out_time_permission_approved?: boolean | null; Out_time_permission_reason?: string | null;
  Early_going?: boolean; Early_going_reason?: string | null; Early_going_approved?: boolean | null;
  in_location?: { latitude: number; longitude: number } | null; out_location?: { latitude: number; longitude: number } | null;
  CCTV?: { in: boolean; out: boolean }; total_hours?: string | null; total_minutes?: number;
  formatted_total_hours?: string; createdAt?: string; updatedAt?: string;
}

interface AttendanceAdminResponse { attendance: AttendanceAdminRecord[]; pagination: { total_records: number; [key: string]: unknown } }

function toUiRecord(record: AttendanceAdminRecord): AttendanceRecord {
  const employee = record.employee;
  return {
    id: record.attendance_id, emp_id: employee?.id ?? '', attendance_date: record.date,
    in_time: record.In_Time ?? null, out_time: record.Out_time ?? null,
    in_time_outside: !!record.In_time_outside, out_time_outside: !!record.Out_time_outside,
    in_time_outside_approved: record.In_time_approved ?? null, out_time_outside_approved: record.Out_time_approved ?? null,
    in_time_outside_reason: record.In_Time_reason ?? null, out_time_outside_reason: record.Out_time_reason ?? null,
    in_time_late: !!record.In_Time_late, in_time_late_reason: record.delay_in_reason ?? null,
    out_time_permission: !!record.Out_time_permission, out_time_permission_approved: record.Out_time_permission_approved ?? null,
    out_time_permission_reason: record.Out_time_permission_reason ?? null,
    total_hours_worked: record.formatted_total_hours ?? record.total_hours ?? record.total_minutes ?? null,
    in_latitude: record.in_location?.latitude ?? null, in_longitude: record.in_location?.longitude ?? null,
    out_latitude: record.out_location?.latitude ?? null, out_longitude: record.out_location?.longitude ?? null,
    cctv_in: !!record.CCTV?.in, cctv_out: !!record.CCTV?.out, early_going: !!record.Early_going,
    early_going_reason: record.Early_going_reason ?? null, early_going_approved: record.Early_going_approved ?? null,
    created_at: record.createdAt ?? record.date, updated_at: record.updatedAt ?? record.date,
    employee: employee ? { id: employee.id, employee_code: employee.employee_code, first_name: employee.name, last_name: null, profile_photo_url: null } : undefined,
  };
}

async function fetchAdmin(body: Record<string, unknown>) {
  const { data } = await fillApi.post<AttendanceAdminResponse>('/getAttendanceAdmin', body);
  return data;
}

export async function getTodayAttendance(): Promise<AttendanceRecord[]> {
  if (MOCK_AUTH_ENABLED) return mock.mockTodayAttendance();
  const data = await fetchAdmin({ filter: 'today', page: 1, limit: 50 });
  return data.attendance.map(toUiRecord);
}

export async function listAttendance(params: AttendanceListParams): Promise<AttendanceRecord[]> {
  if (MOCK_AUTH_ENABLED) return mock.mockListAttendance(params);
  const { page = 1, limit = 50, ...filters } = params;
  const data = await fetchAdmin({ filter: 'all', page, limit, ...filters });
  return data.attendance.map(toUiRecord);
}

export async function getAttendanceRecord(id: string): Promise<AttendanceRecord> {
  if (MOCK_AUTH_ENABLED) return mock.mockGetAttendanceRecord(id);
  void id; throw new Error('Attendance details are available from the loaded attendance list only.');
}

export async function getAttendanceSummary(params: AttendanceListParams = {}): Promise<AttendanceSummary> {
  if (MOCK_AUTH_ENABLED) return mock.mockAttendanceSummary();
  const data = await fetchAdmin({ filter: 'all', page: 1, limit: 50, ...params });
  const records = data.attendance;
  return { total_employees: data.pagination.total_records, present: records.filter((r) => !!r.In_Time).length, absent: 0, late: records.filter((r) => !!r.In_Time_late).length } satisfies AttendanceSummary;
}
