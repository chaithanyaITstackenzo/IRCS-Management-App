import { hrApi } from './axios';
import { Department } from '@/types/department';
import { Designation } from '@/types/designation';
import { Role } from '@/types/role';
import { Shift } from '@/types/shift';
import { MOCK_AUTH_ENABLED } from '@/constants/api';
import * as mock from './mockData';

interface MasterListResponse<T> { message: string; count: number; data: T[] }
interface MasterResponse { message: string; data: { departments: Department[]; designations: Designation[]; roles: Role[]; shifts: Shift[] } }

async function list<T>(type: 'departments' | 'designations' | 'roles' | 'shifts'): Promise<T[]> {
  if (MOCK_AUTH_ENABLED) return (type === 'departments' ? mock.mockListDepartments() : type === 'designations' ? mock.mockListDesignations() : type === 'roles' ? mock.mockListRoles() : mock.mockListShifts()) as Promise<T[]>;
  const { data } = await hrApi.get<MasterListResponse<T>>('/get/master', { params: { type } });
  return data.data;
}

export const listDepartments = () => list<Department>('departments');
export const listDesignations = () => list<Designation>('designations');
export const listRoles = () => list<Role>('roles');
export const listShifts = () => list<Shift>('shifts');

export async function getAllMasterData() {
  const { data } = await hrApi.get<MasterResponse>('/get/master');
  return data.data;
}

export type MasterCreatePayload = { type: 'department' | 'designation' | 'role'; name: string; description?: string };
export async function createMaster(payload: MasterCreatePayload) {
  if (MOCK_AUTH_ENABLED) return (payload.type === 'department' ? mock.mockCreateDepartment(payload) : payload.type === 'designation' ? mock.mockCreateDesignation(payload) : mock.mockCreateRole(payload));
  const { data } = await hrApi.post<{ message: string; data: Department | Designation | Role }>('/add/master', payload);
  return data.data;
}

export async function deactivateMaster(type: 'department' | 'designation' | 'role', id: string) {
  if (MOCK_AUTH_ENABLED) return mock.mockDeactivate(type, id);
  const { data } = await hrApi.delete<{ message: string; data: { id: string; status: boolean } }>('/delete/master', { data: { type, id } });
  return data.data;
}
