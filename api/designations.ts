import { Designation, DesignationPayload } from '@/types/designation';
import { createMaster, deactivateMaster, listDesignations as list } from './master';
import { MOCK_AUTH_ENABLED } from '@/constants/api';
import * as mock from './mockData';

export async function listDesignations(): Promise<Designation[]> {
  return list();
}

export async function getDesignation(id: string): Promise<Designation> {
  if (MOCK_AUTH_ENABLED) return (await mock.mockListDesignations()).find((item) => item.id === id) as Designation;
  throw new Error(`Designation details are available from the designation list only (requested ${id}).`);
}

export async function createDesignation(payload: DesignationPayload): Promise<Designation> {
  return createMaster({ type: 'designation', ...payload }) as Promise<Designation>;
}

export async function updateDesignation(id: string, payload: DesignationPayload): Promise<Designation> {
  throw new Error(`Designation editing is not supported by the backend (requested ${id}).`);
}

export async function setDesignationStatus(id: string, status: boolean): Promise<Designation> {
  if (status) throw new Error('Designation reactivation is not supported by the backend.');
  return deactivateMaster('designation', id) as Promise<Designation>;
}
