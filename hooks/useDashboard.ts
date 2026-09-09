import { useQuery } from '@tanstack/react-query';
import { getManagementDashboard } from '@/api/dashboard';

export function useManagementDashboard() {
  return useQuery({
    queryKey: ['dashboard', 'management'],
    queryFn: getManagementDashboard,
    staleTime: 1000 * 30,
    refetchOnReconnect: true,
  });
}
