import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '../ui/ThemedText';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { StatCard } from './StatCard';
import { Spacing } from '@/constants/spacing';
import { ReportRequestResult } from '@/types/report';
import { shareDownloadedReport } from '@/services/reportDownload';
import { formatCurrencyINR } from '@/utils/formatters';

// Renders whatever the backend actually returned — file or JSON — instead of
// assuming a fixed format (spec §35/§97).
export function ReportResultView({ result }: { result: ReportRequestResult }) {
  if (result.localFileUri) {
    return (
      <Card style={styles.card}>
        <ThemedText variant="bodyStrong">Report ready</ThemedText>
        <ThemedText variant="caption" muted style={{ marginTop: Spacing.xs }}>
          {result.contentType}
        </ThemedText>
        <Button
          label="View / Share"
          style={{ marginTop: Spacing.md }}
          onPress={() => shareDownloadedReport(result.localFileUri!)}
        />
      </Card>
    );
  }

  if (result.json) {
    if (isSalaryReport(result.json)) return <SalaryOverview data={result.json} />;

    return (
      <Card style={styles.card}>
        <ThemedText variant="bodyStrong" style={{ marginBottom: Spacing.sm }}>
          Report Data
        </ThemedText>
        <ThemedText variant="caption" muted style={{ fontFamily: 'monospace' }}>
          {JSON.stringify(result.json, null, 2)}
        </ThemedText>
      </Card>
    );
  }

  return null;
}

function isSalaryReport(value: unknown): value is SalaryReportData {
  if (!value || typeof value !== 'object') return false;
  const data = value as Record<string, unknown>;
  const breakdown = data.breakdown;
  return !!breakdown && typeof breakdown === 'object' && 'salary' in breakdown;
}

function SalaryOverview({ data }: { data: SalaryReportData }) {
  const report = data.report;
  const breakdown = data.breakdown;
  const salary = breakdown.salary;
  const attendance = breakdown.attendance;
  const leave = breakdown.leave;
  const workoff = breakdown.workoff;
  const period = breakdown.payrollPeriod;
  const employeeName = [report.first_name, report.last_name].filter(Boolean).join(' ') || 'Employee';

  return (
    <View style={styles.overview}>
      <View style={styles.heading}>
        <ThemedText variant="h2">Salary Overview</ThemedText>
        <ThemedText variant="body" muted>
          {employeeName}{report.employee_code ? ` · ${report.employee_code}` : ''}
        </ThemedText>
        <ThemedText variant="caption" muted>
          {period.monthStart ?? '—'} to {period.monthEnd ?? '—'}
        </ThemedText>
      </View>

      <View style={styles.stats}>
        <StatCard label="Net salary" value={formatCurrencyINR(numberValue(salary.netSalary))} icon="cash-outline" tone="success" />
        <StatCard label="Monthly salary" value={formatCurrencyINR(numberValue(salary.monthlySalary))} icon="wallet-outline" />
        <StatCard label="Salary deduction" value={formatCurrencyINR(numberValue(salary.salaryDeduction))} icon="remove-circle-outline" tone="error" />
        <StatCard label="Present days" value={numberValue(attendance.presentDays)} icon="checkmark-circle-outline" tone="info" />
        <StatCard label="Paid leave" value={numberValue(leave.paidLeaveDays)} icon="calendar-outline" tone="success" />
        <StatCard label="Workoff days" value={numberValue(workoff.totalWorkoffDays)} icon="briefcase-outline" tone="warning" />
      </View>

      <Card style={styles.detailsCard}>
        <ThemedText variant="h3" style={styles.detailsTitle}>Attendance Details</ThemedText>
        <DetailRow label="Half days" value={attendance.halfDayDays} />
        <DetailRow label="Late arrivals" value={attendance.lateCount} />
        <DetailRow label="Early going" value={attendance.earlyGoingCount} />
        <DetailRow label="Unpaid leave" value={leave.unpaidLeaveDays} />
        <DetailRow label="Absent days" value={breakdown.absence.absentDays} />
        <DetailRow label="Leave balance" value={leave.closingBalance} />
      </Card>
    </View>
  );
}

function DetailRow({ label, value }: { label: string; value: unknown }) {
  return (
    <View style={styles.detailRow}>
      <ThemedText variant="body" muted>{label}</ThemedText>
      <ThemedText variant="bodyStrong">{value === undefined || value === null ? '—' : String(value)}</ThemedText>
    </View>
  );
}

function numberValue(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

interface SalaryReportData {
  report: Record<string, unknown>;
  breakdown: {
    payrollPeriod: { monthStart?: string; monthEnd?: string };
    attendance: { presentDays?: unknown; halfDayDays?: unknown; lateCount?: unknown; earlyGoingCount?: unknown };
    leave: { paidLeaveDays?: unknown; unpaidLeaveDays?: unknown; closingBalance?: unknown };
    workoff: { totalWorkoffDays?: unknown };
    absence: { absentDays?: unknown };
    salary: { monthlySalary?: unknown; salaryDeduction?: unknown; netSalary?: unknown };
  };
}

const styles = StyleSheet.create({
  card: { marginTop: Spacing.lg },
  overview: { marginTop: Spacing.lg, gap: Spacing.md },
  heading: { gap: Spacing.xs },
  stats: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
  detailsCard: { gap: Spacing.md },
  detailsTitle: { marginBottom: Spacing.xs },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
