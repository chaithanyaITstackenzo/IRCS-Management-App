import { Employee } from '@/types/employee';

export function formatEmployeeName(
  employee: Pick<Employee, 'first_name' | 'middle_name' | 'last_name'>
): string {
  return [employee.first_name, employee.middle_name, employee.last_name]
    .filter(Boolean)
    .join(' ')
    .trim();
}

export function formatCurrencyINR(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || Number.isNaN(amount)) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatEmploymentType(value: string): string {
  return value
    .toLowerCase()
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join('');
}
