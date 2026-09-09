/**
 * Centralized role → permission mapping. Components must call these helpers instead
 * of scattering `role === 'HR_ADMIN'` checks throughout the app (spec §9).
 *
 * IMPORTANT: this is a UX convenience layer only. The backend remains the sole
 * source of truth for authorization — every mutation must still be validated
 * server-side, and 403 responses must be handled gracefully regardless of what
 * these helpers return.
 */
function is(role: string | undefined, ...roles: string[]): boolean {
  return !!role && roles.includes(role);
}

export function canAccessManagementApp(role?: string): boolean {
  return is(role, 'SUPER_ADMIN', 'HR_ADMIN');
}

export function canManageEmployees(role?: string): boolean {
  return is(role, 'SUPER_ADMIN', 'HR_ADMIN');
}

export function canManageOrganization(role?: string): boolean {
  return is(role, 'SUPER_ADMIN', 'HR_ADMIN');
}

export function canManageCameras(role?: string): boolean {
  return is(role, 'SUPER_ADMIN', 'HR_ADMIN');
}

export function canManageSpeakers(role?: string): boolean {
  return is(role, 'SUPER_ADMIN', 'HR_ADMIN');
}

export function canApproveRequests(role?: string): boolean {
  return is(role, 'HR_ADMIN');
}

export function canViewPayroll(role?: string): boolean {
  return is(role, 'SUPER_ADMIN', 'HR_ADMIN');
}

export function canStartEnrollment(role?: string): boolean {
  return false;
}
