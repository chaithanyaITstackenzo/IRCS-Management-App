import { Employee, EmployeeCreatePayload, EmployeeListItemSummary, EmployeeListParams, EmployeeUpdatePayload } from '@/types/employee';
import { Department } from '@/types/department';
import { Designation } from '@/types/designation';
import { Role } from '@/types/role';
import { Shift } from '@/types/shift';
import { AttendanceRecord, AttendanceListParams, AttendanceSummary } from '@/types/attendance';
import { AttendanceRequest } from '@/types/request';
import { Camera, CameraPayload, CameraTestResult } from '@/types/camera';
import { Speaker, SpeakerPayload, SpeakerTestResult } from '@/types/speaker';
import { EmployeeCreatedResponse } from './employees';
import { FaceEnrollment, EnrollmentCaptureImage } from '@/types/enrollment';

const now = () => new Date().toISOString();
const departments: Department[] = [
  { id: 'dep-1', name: 'Nursing', description: 'Clinical nursing services', status: true, employee_count: 3, created_at: now(), updated_at: now() },
  { id: 'dep-2', name: 'Administration', description: 'Hospital administration', status: true, employee_count: 2, created_at: now(), updated_at: now() },
];
const designations: Designation[] = [
  { id: 'des-1', name: 'Staff Nurse', description: 'Ward nursing', status: true, employee_count: 3, created_at: now(), updated_at: now() },
  { id: 'des-2', name: 'Administrator', description: 'Hospital administration', status: true, employee_count: 2, created_at: now(), updated_at: now() },
];
const roles: Role[] = [
  { id: 'role-1', role_name: 'SUPER_ADMIN', description: 'Full system access', status: true, created_at: now(), updated_at: now() },
  { id: 'role-2', role_name: 'HR_ADMIN', description: 'Human resources management', status: true, created_at: now(), updated_at: now() },
];
const shifts: Shift[] = [
  { id: 'shift-1', name: 'Morning Shift', start_time: '09:00:00', end_time: '17:00:00', status: true, created_at: now(), updated_at: now() },
  { id: 'shift-2', name: 'Night Shift', start_time: '19:00:00', end_time: '08:00:00', status: true, created_at: now(), updated_at: now() },
];
const employees: Employee[] = [
  { id: 'emp-1', employee_code: 'EMP001', first_name: 'Ravi', middle_name: null, last_name: 'Kumar', gender: 'MALE', date_of_birth: '1992-04-15', email: 'ravi@example.com', mobile: '9876543210', department_id: 'dep-1', designation_id: 'des-1', role_id: 'role-2', shift_id: 'shift-1', employment_type: 'FULL_TIME', joining_date: '2023-01-10', salary: 32000, status: true, profile_photo_url: null, created_at: now(), updated_at: now(), department: departments[0], designation: designations[0], role: roles[1], shift: shifts[0], enrollment_status: 'COMPLETED' },
  { id: 'emp-2', employee_code: 'EMP002', first_name: 'Priya', middle_name: null, last_name: 'Sharma', gender: 'FEMALE', date_of_birth: '1994-06-20', email: 'priya@example.com', mobile: '9876543211', department_id: 'dep-2', designation_id: 'des-2', role_id: 'role-2', shift_id: 'shift-1', employment_type: 'FULL_TIME', joining_date: '2024-02-01', salary: 35000, status: true, profile_photo_url: null, created_at: now(), updated_at: now(), department: departments[1], designation: designations[1], role: roles[1], shift: shifts[0], enrollment_status: 'NOT_STARTED' },
];
const attendance: AttendanceRecord[] = employees.map((employee, index) => ({
  id: `att-${index + 1}`, emp_id: employee.id, attendance_date: now().slice(0, 10), in_time: '2026-08-26T09:05:00+05:30', out_time: index ? null : '2026-08-26T17:10:00+05:30', in_time_outside: false, out_time_outside: false, in_time_outside_approved: null, out_time_outside_approved: null, in_time_outside_reason: null, out_time_outside_reason: null, in_time_late: index === 0, in_time_late_reason: index === 0 ? 'Traffic' : null, out_time_permission: false, out_time_permission_approved: null, out_time_permission_reason: null, total_hours_worked: index ? null : '08:05:00', in_latitude: null, in_longitude: null, out_latitude: null, out_longitude: null, cctv_in: true, cctv_out: !index, early_going: false, early_going_reason: null, early_going_approved: null, created_at: now(), updated_at: now(), employee: { id: employee.id, employee_code: employee.employee_code, first_name: employee.first_name, last_name: employee.last_name, profile_photo_url: null },
}));
const requests: AttendanceRequest[] = [{ id: 'req-1', employee_id: 'emp-1', attendance_id: 'att-1', request_type: 'LATE_ARRIVAL', requested_time: attendance[0].in_time, reason: 'Traffic delay', status: 'PENDING', approved_by: null, approved_at: null, rejection_reason: null, created_at: now(), updated_at: now(), employee: { id: 'emp-1', employee_code: 'EMP001', first_name: 'Ravi', last_name: 'Kumar', profile_photo_url: null } }];
const cameras: Camera[] = [{ id: 'cam-1', name: 'Main Entrance', camera_code: 'CAM001', ip_address: '192.168.1.10', rtsp_url: 'rtsp://192.168.1.10/stream', username: 'admin', location: 'Main Entrance', status: true, created_at: now(), updated_at: now() }];
const speakers: Speaker[] = [{ id: 'spk-1', name: 'Main Speaker', speaker_code: 'SPK001', camera_id: 'cam-1', ip_address: '192.168.1.20', location: 'Main Entrance', status: true, created_at: now(), updated_at: now(), camera: { id: 'cam-1', name: 'Main Entrance', camera_code: 'CAM001' } }];
const enrollments = new Map<string, FaceEnrollment>();
const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));
const id = (prefix: string) => `${prefix}-${Date.now()}`;

export const mockListDepartments = async () => clone(departments);
export const mockListDesignations = async () => clone(designations);
export const mockListRoles = async () => clone(roles);
export const mockListShifts = async () => clone(shifts);
export const mockCreateDepartment = async (p: { name: string; description?: string }) => { const value = { id: id('dep'), ...p, description: p.description ?? null, status: true, employee_count: 0, created_at: now(), updated_at: now() } as Department; departments.push(value); return clone(value); };
export const mockCreateDesignation = async (p: { name: string; description?: string }) => { const value = { id: id('des'), ...p, description: p.description ?? null, status: true, employee_count: 0, created_at: now(), updated_at: now() } as Designation; designations.push(value); return clone(value); };
export const mockCreateRole = async (p: { name: string; description?: string }) => { const value = { id: id('role'), role_name: p.name, description: p.description ?? null, status: true, created_at: now(), updated_at: now() } as Role; roles.push(value); return clone(value); };
export const mockDeactivate = async (type: string, itemId: string) => { const source: any = type === 'department' ? departments : type === 'designation' ? designations : roles; const value = source.find((item: any) => item.id === itemId); if (!value) throw new Error('Not found'); value.status = false; return clone(value); };

export const mockListEmployees = async (params: EmployeeListParams) => { const q = (params.name ?? '').toLowerCase(); return clone(employees.filter((e) => (!q || `${e.first_name} ${e.last_name ?? ''}`.toLowerCase().includes(q)) && (params.status === undefined || e.status === params.status) && (!params.department_id || e.department_id === params.department_id))); };
export const mockCreateEmployee = async (p: EmployeeCreatePayload): Promise<EmployeeCreatedResponse> => { const value = { ...p, id: id('emp'), middle_name: p.middle_name ?? null, last_name: p.last_name ?? null, date_of_birth: p.date_of_birth ?? null, salary: p.salary ?? 0, status: true, profile_photo_url: null, created_at: now(), updated_at: now(), verified: false, embedding_got: false, profile_completed: false }; employees.push(value as Employee); return { employee_id: value.id, employee_code: value.employee_code, email: value.email, verified: false, embedding_got: false, profile_completed: false }; };
export const mockUpdateEmployee = async (employeeId: string, p: EmployeeUpdatePayload) => { const value = employees.find((e) => e.id === employeeId); if (!value) throw new Error('Employee not found'); Object.assign(value, p, { updated_at: now() }); return clone(value); };
export const mockDeactivateEmployee = async (employeeId: string) => { const value = employees.find((e) => e.id === employeeId); if (!value) throw new Error('Employee not found'); value.status = false; return clone(value); };
export const mockVerifyEmployee = async (p: { otp: string; email: string }) => { if (p.otp !== '123456') throw new Error('OTP invalid'); return { message: 'Employee verified successfully', data: { email: p.email, verified: true } }; };
export const mockResendOTP = async (_employeeId: string) => ({ message: 'Verification OTP sent successfully' });

export const mockTodayAttendance = async () => clone(attendance);
export const mockListAttendance = async (_p: AttendanceListParams) => clone(attendance);
export const mockAttendanceSummary = async (): Promise<AttendanceSummary> => ({ total_employees: employees.length, present: attendance.filter((a) => !!a.in_time).length, absent: 0, late: attendance.filter((a) => a.in_time_late).length, currently_inside: attendance.filter((a) => !!a.in_time && !a.out_time).length });
export const mockGetAttendanceRecord = async (recordId: string) => { const value = attendance.find((a) => a.id === recordId); if (!value) throw new Error('Attendance record not found'); return clone(value); };
export const mockPendingRequests = async () => clone(requests.filter((r) => r.status === 'PENDING'));
export const mockGetRequest = async (requestId: string) => { const value = requests.find((r) => r.id === requestId); if (!value) throw new Error('Request not found'); return clone(value); };
export const mockApproveRequest = async (requestId: string) => { const value = requests.find((r) => r.id === requestId); if (!value) throw new Error('Request not found'); value.status = 'APPROVED'; return clone(value); };
export const mockRejectRequest = async (requestId: string, reason?: string) => { if (!reason) throw new Error('Rejection reason is required.'); const value = requests.find((r) => r.id === requestId); if (!value) throw new Error('Request not found'); value.status = 'REJECTED'; value.rejection_reason = reason; return clone(value); };

export const mockListCameras = async () => clone(cameras);
export const mockGetCamera = async (cameraId: string) => { const value = cameras.find((c) => c.id === cameraId); if (!value) throw new Error('Camera not found'); return clone(value); };
export const mockCreateCamera = async (p: CameraPayload) => { const { password: _password, ...safePayload } = p; const value = { ...safePayload, id: id('cam'), status: true, created_at: now(), updated_at: now() } as Camera; cameras.push(value); return clone(value); };
export const mockUpdateCamera = async (cameraId: string, p: Partial<CameraPayload>) => { const value = cameras.find((c) => c.id === cameraId); if (!value) throw new Error('Camera not found'); Object.assign(value, p, { updated_at: now() }); return clone(value); };
export const mockSetCameraStatus = async (cameraId: string, status: boolean) => { const value = cameras.find((c) => c.id === cameraId); if (!value) throw new Error('Camera not found'); value.status = status; return clone(value); };
export const mockTestCamera = async (_id: string): Promise<CameraTestResult> => ({ success: true, message: 'Camera connection successful', latency_ms: 42 });
export const mockGetCameraStatus = async (cameraId: string) => ({ status: !!cameras.find((c) => c.id === cameraId)?.status });
export const mockListSpeakers = async () => clone(speakers);
export const mockGetSpeaker = async (speakerId: string) => { const value = speakers.find((s) => s.id === speakerId); if (!value) throw new Error('Speaker not found'); return clone(value); };
export const mockCreateSpeaker = async (p: SpeakerPayload) => { const value = { ...p, id: id('spk'), status: true, created_at: now(), updated_at: now() } as Speaker; speakers.push(value); return clone(value); };
export const mockUpdateSpeaker = async (speakerId: string, p: Partial<SpeakerPayload>) => { const value = speakers.find((s) => s.id === speakerId); if (!value) throw new Error('Speaker not found'); Object.assign(value, p, { updated_at: now() }); return clone(value); };
export const mockSetSpeakerStatus = async (speakerId: string, status: boolean) => { const value = speakers.find((s) => s.id === speakerId); if (!value) throw new Error('Speaker not found'); value.status = status; return clone(value); };
export const mockTestSpeaker = async (_id: string): Promise<SpeakerTestResult> => ({ success: true, message: 'Speaker test successful' });

export const mockReport = async (kind: string, params: unknown) => ({ contentType: 'application/json', json: { mock: true, report: kind, params, generated_at: now(), records: clone(attendance) } });
export const mockEnrollmentStatus = async (employeeId: string) => enrollments.get(employeeId) ?? null;
export const mockSubmitEnrollment = async (employeeId: string, images: EnrollmentCaptureImage[]) => { const value: FaceEnrollment = { id: id('enroll'), employee_id: employeeId, status: 'COMPLETED', image_count: images.length, model_version: 'mock-v1', enrolled_at: now(), updated_at: now() }; enrollments.set(employeeId, value); return clone(value); };
