export type ReportKind = 'daily' | 'monthly' | 'payroll';

export interface DailyReportParams {
  date: string;
  employee_id?: string;
  department_id?: string;
}

export interface MonthlyReportParams {
  month: string; // "YYYY-MM"
  employee_id?: string;
  department_id?: string;
}

export interface PayrollReportParams {
  month: string; // "YYYY-MM"
  employee_id?: string;
  department_id?: string;
}

/**
 * TODO BACKEND CONTRACT REQUIRED (spec §35 / §97):
 * Response content-type (JSON vs PDF vs CSV vs Excel) is not finalized.
 * The report service inspects the actual response Content-Type at runtime
 * instead of assuming a format here.
 */
export interface ReportRequestResult {
  contentType: string;
  /** Present when the backend returned a downloadable file rather than JSON. */
  localFileUri?: string;
  /** Present when the backend returned structured JSON instead of a file. */
  json?: unknown;
}
