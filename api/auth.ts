import { api } from './axios';
import { LoginPayload, LoginResponseData } from '@/types/auth';
import { MOCK_AUTH_ENABLED } from '@/constants/api';
import { mockLogin } from './mockAuth';

export async function login(payload: LoginPayload): Promise<LoginResponseData> {
  if (MOCK_AUTH_ENABLED) return mockLogin(payload.email, payload.password);
  const { data } = await api.post<{
    Logintoken: string;
    data: {
      employee_id: string;
      user_id: string;
      employee_code: string;
      first_name: string;
      middle_name: string | null;
      last_name: string | null;
      email: string;
      mobile: string;
      role_id?: string;
      role: string | null;
      department: string | null;
      designation: string | null;
      shift: { id: string; name: string; start_time: string; end_time: string } | null;
      embedding_got: boolean;
      verified: boolean;
      profile_completed: boolean;
    };
  }>('/userLogin', payload);

  return {
    token: data.Logintoken,
    user: {
      id: data.data.user_id,
      employee_id: data.data.employee_id,
      role_id: data.data.role_id,
      role: data.data.role ?? 'UNSUPPORTED',
      user_id: data.data.user_id,
      employee_code: data.data.employee_code,
      first_name: data.data.first_name,
      middle_name: data.data.middle_name,
      last_name: data.data.last_name,
      email: data.data.email,
      mobile: data.data.mobile,
      department: data.data.department,
      designation: data.data.designation,
      shift: data.data.shift,
      embedding_got: data.data.embedding_got,
      verified: data.data.verified,
      profile_completed: data.data.profile_completed,
    },
  };
}
