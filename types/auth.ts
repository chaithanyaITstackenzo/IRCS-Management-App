export type AppRole = 'SUPER_ADMIN' | 'HR_ADMIN';

export interface AuthUser {
  id: string;
  employee_id: string;
  role_id?: string;
  role: string;
  user_id?: string;
  employee_code?: string;
  first_name?: string;
  middle_name?: string | null;
  last_name?: string | null;
  email?: string;
  mobile?: string;
  department?: string | null;
  designation?: string | null;
  shift?: { id: string; name: string; start_time: string; end_time: string } | null;
  embedding_got?: boolean;
  verified?: boolean;
  profile_completed?: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponseData {
  token: string;
  user: AuthUser;
}
