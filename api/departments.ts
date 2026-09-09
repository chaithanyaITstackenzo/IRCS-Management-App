import { Department, DepartmentPayload } from '@/types/department';
import { createMaster, deactivateMaster, listDepartments as list } from './master';
import { MOCK_AUTH_ENABLED } from '@/constants/api';
import * as mock from './mockData';

export async function listDepartments(): Promise<Department[]> {
  return list();
}

export async function getDepartment(id: string): Promise<Department> {
  if (MOCK_AUTH_ENABLED) return (await mock.mockListDepartments()).find((item) => item.id === id) as Department;
  throw new Error(`Department details are available from the department list only (requested ${id}).`);
}

export async function createDepartment(payload: DepartmentPayload): Promise<Department> {
  return createMaster({ type: 'department', ...payload }) as Promise<Department>;
}

export async function updateDepartment(id: string, payload: DepartmentPayload): Promise<Department> {
  throw new Error(`Department editing is not supported by the backend (requested ${id}).`);
}

export async function setDepartmentStatus(id: string, status: boolean): Promise<Department> {
  if (status) throw new Error('Department reactivation is not supported by the backend.');
  return deactivateMaster('department', id) as Promise<Department>;
}
