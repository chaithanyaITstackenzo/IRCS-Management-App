import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as employeesApi from '@/api/employees';
import { Employee, EmployeeCreatePayload, EmployeeListItemSummary, EmployeeListParams, EmployeeUpdatePayload } from '@/types/employee';

const key = ['employees'] as const;

export function useEmployees(params: EmployeeListParams) {
  return useQuery({
    queryKey: [...key, 'list', params],
    queryFn: () => employeesApi.listEmployees(params),
    staleTime: 1000 * 30,
  });
}

export function useEmployee(id: string) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: [...key, id],
    queryFn: async () => {
      const cached = queryClient.getQueriesData<EmployeeListItemSummary[]>({ queryKey: [...key, 'list'] });
      const employee = cached.flatMap(([, data]) => data ?? []).find((item) => item.id === id);
      if (employee) return employee as Employee;

      const employees = await employeesApi.listEmployees({});
      const fetchedEmployee = employees.find((item) => item.id === id);
      if (fetchedEmployee) return fetchedEmployee as Employee;

      throw new Error('Employee details are not available. Return to the employee list and try again.');
    },
    enabled: !!id,
  });
}

export function useCreateEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: EmployeeCreatePayload) => employeesApi.createEmployee(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: key });
      qc.invalidateQueries({ queryKey: ['dashboard', 'management'] });
    },
  });
}

export function useUpdateEmployee(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: EmployeeUpdatePayload) => employeesApi.updateEmployee(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: key });
      qc.invalidateQueries({ queryKey: [...key, id] });
    },
  });
}

export function useDeactivateEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => employeesApi.deactivateEmployee(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: key });
      qc.invalidateQueries({ queryKey: [...key, id] });
      qc.invalidateQueries({ queryKey: ['dashboard', 'management'] });
    },
  });
}

export function useVerifyEmployee() {
  return useMutation({ mutationFn: employeesApi.verifyEmployee });
}

export function useResendEmployeeOTP() {
  return useMutation({ mutationFn: (employeeId: string) => employeesApi.resendEmployeeOTP(employeeId) });
}
