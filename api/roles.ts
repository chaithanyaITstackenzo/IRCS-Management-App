import { Role } from '@/types/role';
import { createMaster, deactivateMaster, listRoles as list } from './master';

/**
 * TODO BACKEND CONTRACT REQUIRED (spec §20 / §95):
 * Thoufiq has not finalized Role CRUD endpoints yet. Only a read is wired up here,
 * using the same REST convention as departments/designations as a best guess for
 * the LIST call, since roles must be readable to populate employee-assignment
 * dropdowns. Do NOT add create/update/status-toggle calls until the endpoints
 * are confirmed — the Roles screen below shows a read-only list and disables
 * management actions until this module is completed.
 */
export async function listRoles(): Promise<Role[]> {
  return list();
}

export const createRole = (payload: { name: string; description?: string }) => createMaster({ type: 'role', ...payload });
export const deactivateRole = (id: string) => deactivateMaster('role', id);
