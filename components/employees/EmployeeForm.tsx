import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Input } from '../ui/Input';
import { Select, SelectOption } from '../ui/Select';
import { DateField } from '../ui/DateField';
import { Button } from '../ui/Button';
import { ThemedText } from '../ui/ThemedText';
import { useDepartments } from '@/hooks/useDepartments';
import { useDesignations } from '@/hooks/useDesignations';
import { useShifts } from '@/hooks/useShifts';
import { useRoles } from '@/hooks/useRoles';
import { Employee, EmployeeCreatePayload } from '@/types/employee';
import { Spacing } from '@/constants/spacing';
import { formatShiftRange, shiftTypeLabel } from '@/utils/shift';

const GENDER_OPTIONS: SelectOption[] = [
  { label: 'Male', value: 'MALE' },
  { label: 'Female', value: 'FEMALE' },
  { label: 'Other', value: 'OTHER' },
];

const EMPLOYMENT_TYPE_OPTIONS: SelectOption[] = [
  { label: 'Full Time', value: 'FULL_TIME' },
  { label: 'Part Time', value: 'PART_TIME' },
  { label: 'Contract', value: 'CONTRACT' },
  { label: 'Intern', value: 'INTERN' },
];

export type EmployeeFormValues = EmployeeCreatePayload;

interface EmployeeFormProps {
  initial?: Partial<Employee>;
  submitLabel: string;
  submittingLabel: string;
  submitting: boolean;
  onSubmit: (values: EmployeeFormValues) => void;
}

// Shared by Add and Edit Employee screens so validation/field logic lives in one place.
export function EmployeeForm({ initial, submitLabel, submittingLabel, submitting, onSubmit }: EmployeeFormProps) {
  const [values, setValues] = useState<EmployeeFormValues>({
    employee_code: initial?.employee_code ?? '',
    first_name: initial?.first_name ?? '',
    middle_name: initial?.middle_name ?? '',
    last_name: initial?.last_name ?? '',
    gender: initial?.gender ?? '',
    date_of_birth: initial?.date_of_birth ?? '',
    email: initial?.email ?? '',
    mobile: initial?.mobile ?? '',
    department_id: initial?.department_id ?? '',
    designation_id: initial?.designation_id ?? '',
    role_id: initial?.role_id ?? '',
    shift_id: initial?.shift_id ?? '',
    employment_type: initial?.employment_type ?? '',
    joining_date: initial?.joining_date ?? '',
    salary: initial?.salary ?? 0,
    password: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof EmployeeFormValues, string>>>({});

  const departments = useDepartments();
  const designations = useDesignations();
  const shifts = useShifts();
  const roles = useRoles();

  const set = <K extends keyof EmployeeFormValues>(key: K, value: EmployeeFormValues[K]) =>
    setValues((v) => ({ ...v, [key]: value }));

  const validate = () => {
    const next: typeof errors = {};
    if (!values.employee_code.trim()) next.employee_code = 'Employee code is required.';
    if (!values.first_name.trim()) next.first_name = 'First name is required.';
    if (!values.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
      next.email = 'Please enter a valid email address.';
    if (!values.mobile.trim() || !/^\d{7,15}$/.test(values.mobile)) next.mobile = 'Please enter a valid mobile number.';
    if (!values.department_id) next.department_id = 'Department is required.';
    if (!values.designation_id) next.designation_id = 'Designation is required.';
    if (!values.role_id) next.role_id = 'Role is required.';
    if (!values.shift_id) next.shift_id = 'Shift is required.';
    if (!initial && !values.password?.trim()) next.password = 'Password is required.';
    if (!values.joining_date.trim()) next.joining_date = 'Joining date is required (YYYY-MM-DD).';
    if (values.salary === null || values.salary === undefined || Number.isNaN(Number(values.salary)))
      next.salary = 'Salary must be a number.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({ ...values, salary: Number(values.salary) });
  };

  const shiftOptions: SelectOption[] = (shifts.data ?? []).map((s) => ({
    label: `${s.name} · ${formatShiftRange(s)} (${shiftTypeLabel(s)})`,
    value: s.id,
  }));

  return (
    <View>
      <ThemedText variant="captionStrong" muted style={styles.groupLabel}>
        BASIC INFORMATION
      </ThemedText>
      <Input
        label="Employee Code"
        required
        value={values.employee_code}
        onChangeText={(t) => set('employee_code', t)}
        error={errors.employee_code}
        autoCapitalize="characters"
      />
      <Input label="First Name" required value={values.first_name} onChangeText={(t) => set('first_name', t)} error={errors.first_name} />
      <Input label="Middle Name" value={values.middle_name} onChangeText={(t) => set('middle_name', t)} />
      <Input label="Last Name" value={values.last_name} onChangeText={(t) => set('last_name', t)} />
      <Select label="Gender" options={GENDER_OPTIONS} value={values.gender} onChange={(v) => set('gender', v)} />
      <DateField
        label="Date of Birth"
        value={values.date_of_birth ?? ''}
        onChange={(v) => set('date_of_birth', v)}
        maximumDate={new Date()}
      />

      <ThemedText variant="captionStrong" muted style={styles.groupLabel}>
        CONTACT
      </ThemedText>
      <Input
        label="Email"
        required
        keyboardType="email-address"
        autoCapitalize="none"
        value={values.email}
        onChangeText={(t) => set('email', t)}
        error={errors.email}
        editable={!initial}
      />
      {!initial ? (
        <Input label="Initial Password" required secureTextEntry value={values.password} onChangeText={(t) => set('password', t)} error={errors.password} />
      ) : null}
      <Input
        label="Mobile"
        required
        keyboardType="phone-pad"
        value={values.mobile}
        onChangeText={(t) => set('mobile', t)}
        error={errors.mobile}
      />

      <ThemedText variant="captionStrong" muted style={styles.groupLabel}>
        ASSIGNMENT
      </ThemedText>
      <Select
        label="Department"
        required
        loading={departments.isLoading}
        options={(departments.data ?? []).map((d) => ({ label: d.name, value: d.id }))}
        value={values.department_id}
        onChange={(v) => set('department_id', v)}
        error={errors.department_id}
      />
      <Select
        label="Designation"
        required
        loading={designations.isLoading}
        options={(designations.data ?? []).map((d) => ({ label: d.name, value: d.id }))}
        value={values.designation_id}
        onChange={(v) => set('designation_id', v)}
        error={errors.designation_id}
      />
      <Select
        label="Role"
        required
        loading={roles.isLoading}
        options={(roles.data ?? [])
          .filter((r) => r.role_name !== 'DEPARTMENT_HEAD')
          .map((r) => ({ label: r.role_name, value: r.id }))}
        value={values.role_id}
        onChange={(v) => set('role_id', v)}
        error={errors.role_id}
      />
      <Select
        label="Shift"
        required
        loading={shifts.isLoading}
        options={shiftOptions}
        value={values.shift_id}
        onChange={(v) => set('shift_id', v)}
        error={errors.shift_id}
      />
      <Select
        label="Employment Type"
        required
        options={EMPLOYMENT_TYPE_OPTIONS}
        value={values.employment_type}
        onChange={(v) => set('employment_type', v)}
      />
      <DateField
        label="Joining Date"
        required
        value={values.joining_date}
        onChange={(v) => set('joining_date', v)}
        error={errors.joining_date}
      />
      <Input
        label="Salary"
        required
        keyboardType="numeric"
        value={values.salary ? String(values.salary) : ''}
        onChangeText={(t) => set('salary', Number(t.replace(/[^0-9.]/g, '')) as any)}
        error={errors.salary}
      />

      <Button
        label={submitLabel}
        loadingLabel={submittingLabel}
        loading={submitting}
        onPress={handleSubmit}
        style={styles.submit}
        testID="employee-form-submit"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  groupLabel: { marginTop: Spacing.sm, marginBottom: Spacing.md },
  submit: { marginTop: Spacing.md, marginBottom: Spacing.xxxl },
});
