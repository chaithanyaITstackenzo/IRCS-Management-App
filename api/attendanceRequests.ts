import { fillApi } from './axios';
import { AttendanceRequest, AttendanceRequestRejectPayload } from '@/types/request';
import { useAuthStore } from '@/store/authStore';
import { MOCK_AUTH_ENABLED } from '@/constants/api';
import * as mock from './mockData';

interface BackendAttendanceRequest {
  id: string;
  employee_id: string;
  attendance_id: string | null;
  type: AttendanceRequest['request_type'];
  requested_time: string | null;
  reason: string;
  status: AttendanceRequest['status'];
  approved_by: string | null;
  approved_at: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
}

interface BackendAttendanceEmployee {
  id: string;
  employee_code: string;
  name: string;
  email?: string;
  mobile?: string;
}

interface BackendAttendanceLocation {
  latitude: number | string | null;
  longitude: number | string | null;
}

function normalizeRequest(
  request: BackendAttendanceRequest,
  employee?: BackendAttendanceEmployee,
  attendance?: { in_location?: BackendAttendanceLocation | null },
): AttendanceRequest {
  const latitude = attendance?.in_location?.latitude;
  const longitude = attendance?.in_location?.longitude;
  const parsedLatitude = latitude === null || latitude === undefined ? NaN : Number(latitude);
  const parsedLongitude = longitude === null || longitude === undefined ? NaN : Number(longitude);
  const location = Number.isFinite(parsedLatitude)
    && parsedLatitude >= -90
    && parsedLatitude <= 90
    && Number.isFinite(parsedLongitude)
    && parsedLongitude >= -180
    && parsedLongitude <= 180
    ? { latitude: parsedLatitude, longitude: parsedLongitude }
    : null;

  return {
    ...request,
    request_type: request.type,
    location,
    employee: employee
      ? {
          id: employee.id,
          employee_code: employee.employee_code,
          first_name: employee.name,
          last_name: null,
          profile_photo_url: null,
        }
      : undefined,
  };
}

export async function listRequests(status: 'PENDING' | 'ALL' = 'PENDING', params: Record<string, string | number | undefined> = {}): Promise<AttendanceRequest[]> {
  if (MOCK_AUTH_ENABLED) {
    const requests = await mock.mockPendingRequests();
    return status === 'PENDING' ? requests.filter((request) => request.status === 'PENDING') : requests;
  }
  const statuses = status === 'ALL' ? ['APPROVED', 'REJECTED'] : [status];
  const responses = await Promise.all(statuses.map((requestStatus) =>
    fillApi.get<{ requests: { request: BackendAttendanceRequest; employee?: BackendAttendanceEmployee; attendance?: { in_location?: BackendAttendanceLocation | null } }[] }>('/attendanceRequests', { params: { status: requestStatus, page: 1, ...params } }),
  ));
  const requests = responses.flatMap(({ data }) => data.requests.map((item) => normalizeRequest(item.request, item.employee, item.attendance)));
  return status === 'PENDING' ? requests.filter((request) => request.status === 'PENDING') : requests;
}

export async function listPendingRequests(): Promise<AttendanceRequest[]> {
  return listRequests('PENDING');
}

export async function getRequest(id: string): Promise<AttendanceRequest> {
  if (MOCK_AUTH_ENABLED) return mock.mockGetRequest(id);
  void id; throw new Error('Request details are available from the loaded request list only.');
}

export async function approveRequest(id: string): Promise<AttendanceRequest> {
  if (MOCK_AUTH_ENABLED) return mock.mockApproveRequest(id);
  const { data } = await fillApi.put<{ request: BackendAttendanceRequest }>('/attendanceRequest', { requestId: id, action: 'APPROVE', approvedBy: useAuthStore.getState().user?.user_id });
  return normalizeRequest(data.request);
}

// TODO BACKEND CONTRACT REQUIRED (spec §27): rejection payload shape unconfirmed.
// Sends an empty body by default; include rejection_reason only if the caller has one.
export async function rejectRequest(id: string, payload?: AttendanceRequestRejectPayload): Promise<AttendanceRequest> {
  const reason = payload?.rejection_reason?.trim();
  if (!reason) throw new Error('Rejection reason is required.');
  if (MOCK_AUTH_ENABLED) return mock.mockRejectRequest(id, reason);
  const { data } = await fillApi.put<{ request: BackendAttendanceRequest }>('/attendanceRequest', { requestId: id, action: 'REJECT', approvedBy: useAuthStore.getState().user?.user_id, rejectionReason: reason });
  return normalizeRequest(data.request);
}
