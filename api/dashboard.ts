import { ManagementDashboardStats } from '@/types/dashboard';
import { listEmployees } from './employees';
import { getTodayAttendance } from './attendance';
import { listPendingRequests } from './attendanceRequests';
import { listWorkoffRequests } from './workoffRequests';

export async function getManagementDashboard(): Promise<ManagementDashboardStats> {
  const [employees, attendance, requests, workoffRequests] = await Promise.all([
    listEmployees({}),
    getTodayAttendance(),
    listPendingRequests(),
    listWorkoffRequests(),
  ]);
  return {
    total_employees: employees.length,
    present: attendance.filter((record) => !!record.in_time).length,
    absent: Math.max(0, employees.length - attendance.filter((record) => !!record.in_time).length),
    late: attendance.filter((record) => record.in_time_late).length,
    currently_inside: attendance.filter((record) => !!record.in_time && !record.out_time).length,
    pending_requests: requests.length + workoffRequests.requests.length,
  };
}
