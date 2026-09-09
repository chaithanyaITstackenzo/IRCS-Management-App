/**
 * Centralized status → color/label mapping used by StatusBadge everywhere.
 * Only statuses that are actually produced by the V1 backend appear here.
 */
export type StatusTone = 'success' | 'warning' | 'error' | 'info' | 'neutral';

export interface StatusMeta {
  label: string;
  tone: StatusTone;
}

export const EMPLOYEE_STATUS: Record<'true' | 'false', StatusMeta> = {
  true: { label: 'Active', tone: 'success' },
  false: { label: 'Inactive', tone: 'neutral' },
};

export const REQUEST_STATUS: Record<string, StatusMeta> = {
  PENDING: { label: 'Pending', tone: 'warning' },
  APPROVED: { label: 'Approved', tone: 'success' },
  REJECTED: { label: 'Rejected', tone: 'error' },
};

export const ENROLLMENT_STATUS: Record<string, StatusMeta> = {
  NOT_STARTED: { label: 'Not Started', tone: 'neutral' },
  PENDING: { label: 'Pending', tone: 'warning' },
  PROCESSING: { label: 'Processing', tone: 'info' },
  COMPLETED: { label: 'Completed', tone: 'success' },
  FAILED: { label: 'Failed', tone: 'error' },
};

export const CAMERA_SPEAKER_STATUS: Record<'true' | 'false', StatusMeta> = {
  true: { label: 'Online', tone: 'success' },
  false: { label: 'Offline', tone: 'neutral' },
};

export const REQUEST_TYPE_LABEL: Record<string, string> = {
  LATE_ARRIVAL: 'Late Arrival',
  MISSED_IN: 'Missed IN',
  MISSED_OUT: 'Missed OUT',
  OUTSIDE_ATTENDANCE: 'Outside Attendance',
  OUT_PERMISSION: 'Out Permission',
  EARLY_GOING: 'Early Going',
  EMERGENCY: 'Emergency',
};
