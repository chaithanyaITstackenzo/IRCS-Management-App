import { useMutation } from '@tanstack/react-query';
import * as reportsApi from '@/api/reports';
import { handleReportResponse } from '@/services/reportDownload';
import { DailyReportParams, MonthlyReportParams, PayrollReportParams, ReportRequestResult } from '@/types/report';
import { MOCK_AUTH_ENABLED } from '@/constants/api';
import { mockReport } from '@/api/mockData';

export function useDailyReport() {
  return useMutation({
    mutationFn: async (params: DailyReportParams) => {
      if (MOCK_AUTH_ENABLED) return await mockReport('daily', params) as ReportRequestResult;
      const response = await reportsApi.fetchDailyReport(params);
      return handleReportResponse(response, `daily-report-${params.date}`);
    },
  });
}

export function useMonthlyReport() {
  return useMutation({
    mutationFn: async (params: MonthlyReportParams) => {
      if (MOCK_AUTH_ENABLED) return await mockReport('monthly', params) as ReportRequestResult;
      const response = await reportsApi.fetchMonthlyReport(params);
      return handleReportResponse(response, `monthly-report-${params.month}`);
    },
  });
}

export function usePayrollReport() {
  return useMutation({
    mutationFn: async (params: PayrollReportParams) => {
      if (MOCK_AUTH_ENABLED) return await mockReport('payroll', params) as ReportRequestResult;
      const response = await reportsApi.fetchPayrollReport(params);
      return handleReportResponse(response, `payroll-report-${params.month}`);
    },
  });
}
