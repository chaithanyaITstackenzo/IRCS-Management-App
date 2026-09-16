import { DailyReportParams, MonthlyReportParams, PayrollReportParams } from '@/types/report';
import { MOCK_AUTH_ENABLED } from '@/constants/api';
import { mockReport } from './mockData';
import { fillApi } from './axios';
import { AxiosResponse } from 'axios';
const UNSUPPORTED = 'Reports are not available from the backend.';

export function fetchDailyReport(params: DailyReportParams): Promise<never> {
  if (MOCK_AUTH_ENABLED) return mockReport('daily', params) as Promise<never>; void params; return Promise.reject(new Error(UNSUPPORTED));
}

export function fetchMonthlyReport(params: MonthlyReportParams): Promise<never> {
  if (MOCK_AUTH_ENABLED) return mockReport('monthly', params) as Promise<never>; void params; return Promise.reject(new Error(UNSUPPORTED));
}

export function fetchPayrollReport(params: PayrollReportParams): Promise<AxiosResponse<ArrayBuffer>> {
  const [year, month] = params.month.split('-').map(Number);
  return fillApi.post<ArrayBuffer>('/salary/generate', {
    employeeId: params.employee_id,
    year,
    month,
  }, { responseType: 'arraybuffer' });
}
