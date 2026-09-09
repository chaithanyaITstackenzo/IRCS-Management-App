import { Department } from './department';
import { Designation } from './designation';
import { Role } from './role';
import { Shift } from './shift';
import { EnrollmentStatus } from './enrollment';

export type EmploymentType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERN';
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export interface Employee {
  id: string;
  employee_code: string;
  first_name: string;
  middle_name: string | null;
  last_name: string | null;
  gender: Gender | string;
  date_of_birth: string | null;
  email: string;
  mobile: string;
  department_id: string;
  designation_id: string;
  role_id: string;
  shift_id: string;
  employment_type: string;
  joining_date: string;
  salary: number;
  status: boolean;
  profile_photo_url: string | null;
  created_at: string;
  updated_at: string;

  // Optional expanded relations — only present if the backend chooses to embed them.
  department?: Pick<Department, 'id' | 'name'>;
  designation?: Pick<Designation, 'id' | 'name'>;
  role?: Pick<Role, 'id' | 'role_name'>;
  shift?: Pick<Shift, 'id' | 'name' | 'start_time' | 'end_time'>;
  enrollment_status?: EnrollmentStatus;
}

export interface EmployeeListItemSummary
  extends Pick<
    Employee,
    | 'id'
    | 'employee_code'
    | 'first_name'
    | 'middle_name'
    | 'last_name'
    | 'status'
    | 'profile_photo_url'
    | 'department_id'
    | 'designation_id'
  > {
  department?: Pick<Department, 'id' | 'name'>;
  designation?: Pick<Designation, 'id' | 'name'>;
}

export interface EmployeeCreatePayload {
  employee_code: string;
  first_name: string;
  middle_name?: string;
  last_name?: string;
  gender: string;
  date_of_birth?: string;
  email: string;
  mobile: string;
  department_id: string;
  designation_id: string;
  role_id: string;
  shift_id: string;
  employment_type: string;
  joining_date: string;
  salary?: number;
  password?: string;
}

export type EmployeeUpdatePayload = Partial<Omit<EmployeeCreatePayload, 'email' | 'password'>>;

export interface EmployeeListParams {
  employee_code?: string;
  name?: string;
  email?: string;
  mobile?: string;
  department_id?: string;
  designation_id?: string;
  shift_id?: string;
  role_id?: string;
  status?: boolean;
  employment_type?: string;
  verified?: boolean;
  embedding_got?: boolean;
  profile_completed?: boolean;
}
