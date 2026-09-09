import { useQuery, useQueryClient } from '@tanstack/react-query';
import * as attendanceApi from '@/api/attendance';
import { AttendanceListParams } from '@/types/attendance';

export function useTodayAttendance() {
  return useQuery({
    queryKey: ['attendance', 'today'],
    queryFn: attendanceApi.getTodayAttendance,
    staleTime: 1000 * 15,
  });
}

export function useAttendanceHistory(params: AttendanceListParams) {
  return useQuery({
    queryKey: ['attendance', 'history', params],
    queryFn: () => attendanceApi.listAttendance(params),
    staleTime: 1000 * 30,
  });
}

export function useAttendanceRecord(id: string) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ['attendance', 'record', id],
    queryFn: async () => {
      const cached = queryClient.getQueriesData<import('@/types/attendance').AttendanceRecord[]>({ queryKey: ['attendance'] });
      const record = cached.flatMap(([, data]) => data ?? []).find((item) => item.id === id);
      if (!record) throw new Error('Attendance details are not available. Return to the attendance list and try again.');
      return record;
    },
    enabled: !!id,
  });
}

export function useAttendanceSummary(params: AttendanceListParams = {}) {
  return useQuery({
    queryKey: ['attendance', 'summary', params],
    queryFn: () => attendanceApi.getAttendanceSummary(params),
    staleTime: 1000 * 30,
  });
}
