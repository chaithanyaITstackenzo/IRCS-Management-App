import { ManagementDashboardStats } from '@/types/dashboard';
import { listEmployees } from './employees';
import { getTodayAttendance } from './attendance';
import { listPendingRequests } from './attendanceRequests';
import { listWorkoffRequests } from './workoffRequests';
import { listLeaveRequests } from './leaveRequests';
import { listPermissionRequests } from './permissionRequests';

export async function getManagementDashboard(): Promise<ManagementDashboardStats> {
  const [employees, attendance, requests, workoffRequests, leaveRequests, permissionRequests] = await Promise.all([
    listEmployees({}),
    getTodayAttendance(),
    listPendingRequests(),
    listWorkoffRequests(),
    listLeaveRequests({ status: 'PENDING' }),
    listPermissionRequests({ status: 'PENDING' }),
  ]);
  return {
    total_employees: employees.length,
    present: attendance.filter((record) => !!record.in_time).length,
    absent: Math.max(0, employees.length - attendance.filter((record) => !!record.in_time).length),
    late: attendance.filter((record) => record.in_time_late).length,
    currently_inside: attendance.filter((record) => !!record.in_time && !record.out_time).length,
    pending_requests: requests.filter((request) => request.status === 'PENDING').length
      + workoffRequests.requests.filter((request) => request.status === 'PENDING').length
      + leaveRequests.requests.filter((request) => String(request.leave.status) === 'PENDING').length
      + permissionRequests.requests.filter((request) => String(request.permission.status) === 'PENDING').length,
  };
}
