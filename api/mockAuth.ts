import { AuthUser, LoginResponseData } from '@/types/auth';

export const MOCK_CREDENTIALS = [
  { email: 'chaithanyaattirala@gmail.com', password: 'Acg@1234', role: 'SUPER_ADMIN' as const, label: 'Chaithanya - Super Admin' },
  { email: 'admin@ircs.hospital', password: 'Admin@123', role: 'SUPER_ADMIN' as const, label: 'Super Admin' },
  { email: 'hr@ircs.hospital', password: 'Hr@12345', role: 'HR_ADMIN' as const, label: 'HR Admin' },
];

export async function mockLogin(email: string, password: string): Promise<LoginResponseData> {
  const match = MOCK_CREDENTIALS.find(
    (credential) => credential.email === email.trim().toLowerCase() && credential.password === password,
  );

  if (!match) {
    const error: any = new Error('Invalid email or password.');
    error.response = { status: 401, data: { message: 'Invalid email or password.' } };
    throw error;
  }

  const user: AuthUser = {
    id: `mock-${match.role.toLowerCase()}`,
    employee_id: `mock-${match.role.toLowerCase()}`,
    role_id: `mock-${match.role.toLowerCase()}`,
    role: match.role,
    email: match.email,
    first_name: match.label,
    verified: true,
    profile_completed: true,
  };

  return { token: `mock-jwt-token-${match.role.toLowerCase()}`, user };
}
