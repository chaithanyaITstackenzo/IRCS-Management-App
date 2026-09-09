import { useMutation } from '@tanstack/react-query';
import { login } from '@/api/auth';
import { useAuthStore } from '@/store/authStore';
import { LoginPayload } from '@/types/auth';

export function useAuthStatus() {
  const { user, token, isAppReady } = useAuthStore();
  return { user, token, isAppReady, isAuthenticated: !!token };
}

export function useLogin() {
  const setAuthSuccess = useAuthStore((s) => s.setAuthSuccess);

  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: async (data) => {
      await setAuthSuccess(data.token, data.user);
    },
  });
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  return useMutation({ mutationFn: logout });
}
