import { DailyReportParams, MonthlyReportParams, PayrollReportParams } from '@/types/report';
import { MOCK_AUTH_ENABLED } from '@/constants/api';
import { mockReport } from './mockData';
const UNSUPPORTED = 'Reports are not available from the backend.';

export function fetchDailyReport(params: DailyReportParams): Promise<never> {
  if (MOCK_AUTH_ENABLED) return mockReport('daily', params) as Promise<never>; void params; return Promise.reject(new Error(UNSUPPORTED));
}

export function fetchMonthlyReport(params: MonthlyReportParams): Promise<never> {
  if (MOCK_AUTH_ENABLED) return mockReport('monthly', params) as Promise<never>; void params; return Promise.reject(new Error(UNSUPPORTED));
}

export function fetchPayrollReport(params: PayrollReportParams): Promise<never> {
  if (MOCK_AUTH_ENABLED) return mockReport('payroll', params) as Promise<never>; void params; return Promise.reject(new Error(UNSUPPORTED));
}
