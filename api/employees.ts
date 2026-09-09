import { hrApi } from './axios';
import {
  Employee,
  EmployeeCreatePayload,
  EmployeeListItemSummary,
  EmployeeListParams,
  EmployeeUpdatePayload,
} from '@/types/employee';
import { MOCK_AUTH_ENABLED } from '@/constants/api';
import * as mock from './mockData';

interface BackendEmployee {
  id: string;
  employee_code: string;
  first_name: string;
  middle_name?: string | null;
  last_name?: string | null;
  gender?: string;
  date_of_birth?: string | null;
  email: string;
  mobile: string;
  department_id: string;
  department?: string | null;
  designation_id: string;
  designation?: string | null;
  role_id: string;
  role?: string | null;
  shift_id: string;
  shift?: string | null;
  start_time?: string;
  end_time?: string;
  employment_type?: string;
  joining_date?: string;
  salary?: number | string;
  status: boolean;
  embedding_got?: boolean;
  verified?: boolean;
  profile_completed?: boolean;
  profile_photo_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

function normalizeEmployee(employee: BackendEmployee): Employee {
  return {
    ...employee,
    middle_name: employee.middle_name ?? null,
    last_name: employee.last_name ?? null,
    gender: employee.gender ?? '',
    date_of_birth: employee.date_of_birth ?? null,
    employment_type: employee.employment_type ?? '',
    joining_date: employee.joining_date ?? '',
    salary: Number(employee.salary ?? 0),
    profile_photo_url: employee.profile_photo_url ?? null,
    created_at: employee.created_at ?? '',
    updated_at: employee.updated_at ?? '',
    department: employee.department ? { id: employee.department_id, name: employee.department } : undefined,
    designation: employee.designation ? { id: employee.designation_id, name: employee.designation } : undefined,
    role: employee.role ? { id: employee.role_id, role_name: employee.role } : undefined,
    shift: employee.shift ? {
      id: employee.shift_id,
      name: employee.shift,
      start_time: employee.start_time ?? '',
      end_time: employee.end_time ?? '',
    } : undefined,
  };
}

export async function listEmployees(params: EmployeeListParams): Promise<EmployeeListItemSummary[]> {
  if (MOCK_AUTH_ENABLED) return mock.mockListEmployees(params);
  const { data } = await hrApi.get<{ message: string; count: number; data: BackendEmployee[] }>('/employees', { params });
  return data.data.map(normalizeEmployee);
}

export async function getEmployee(id: string): Promise<Employee> {
  if (MOCK_AUTH_ENABLED) return mock.mockListEmployees({}).then((items) => items.find((item) => item.id === id) as Employee);
  throw new Error(`Employee details are available from the loaded employee list only (requested ${id}).`);
}

export interface EmployeeCreatedResponse { employee_id: string; employee_code: string; email: string; verified: boolean; embedding_got: boolean; profile_completed: boolean }
export async function createEmployee(payload: EmployeeCreatePayload): Promise<EmployeeCreatedResponse> {
  if (MOCK_AUTH_ENABLED) return mock.mockCreateEmployee(payload);
  const { data } = await hrApi.post<{ message: string; data: EmployeeCreatedResponse }>('/createEmployee', payload);
  return data.data;
}

export async function updateEmployee(id: string, payload: EmployeeUpdatePayload): Promise<Employee> {
  if (MOCK_AUTH_ENABLED) return mock.mockUpdateEmployee(id, payload);
  const { data } = await hrApi.put<{ message: string; data: BackendEmployee }>(`/employees/${id}`, payload);
  return normalizeEmployee(data.data);
}

export async function deactivateEmployee(id: string): Promise<Employee> {
  if (MOCK_AUTH_ENABLED) return mock.mockDeactivateEmployee(id);
  const { data } = await hrApi.put<{ message: string; data: BackendEmployee }>(`/employees/${id}/deactivate`);
  return normalizeEmployee(data.data);
}

export async function verifyEmployee(payload: { otp: string; email: string }) {
  if (MOCK_AUTH_ENABLED) return mock.mockVerifyEmployee(payload);
  const { data } = await hrApi.put('/verifyuserRegister', payload);
  return data;
}

export async function resendEmployeeOTP(employee_id: string) {
  if (MOCK_AUTH_ENABLED) return mock.mockResendOTP(employee_id);
  const { data } = await hrApi.post('/resendEmployeeOTP', { employee_id });
  return data;
}
