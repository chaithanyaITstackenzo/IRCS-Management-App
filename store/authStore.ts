import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { AuthUser } from '@/types/auth';

const TOKEN_KEY = 'ircs_mgmt_jwt_token';
const USER_KEY = 'ircs_mgmt_user';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  /** True once we've finished checking SecureStore on startup — gates the router. */
  isAppReady: boolean;

  checkAuth: () => Promise<void>;
  setAuthSuccess: (token: string, user: AuthUser) => Promise<void>;
  logout: () => Promise<void>;
}

// V1 uses a JWT access token only — there is no refresh token (see database spec §7).
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAppReady: false,

  checkAuth: async () => {
    try {
      const [storedToken, storedUser] = await Promise.all([
        SecureStore.getItemAsync(TOKEN_KEY),
        SecureStore.getItemAsync(USER_KEY),
      ]);

      if (storedToken && storedUser) {
        set({ token: storedToken, user: JSON.parse(storedUser) as AuthUser, isAppReady: true });
        return;
      }
    } catch {
      // Corrupted/unavailable secure storage — fall through to unauthenticated state.
    }
    set({ isAppReady: true, token: null, user: null });
  },

  setAuthSuccess: async (token, user) => {
    await Promise.all([
      SecureStore.setItemAsync(TOKEN_KEY, token),
      SecureStore.setItemAsync(USER_KEY, JSON.stringify(user)),
    ]);
    set({ token, user });
  },

  logout: async () => {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(TOKEN_KEY),
        SecureStore.deleteItemAsync(USER_KEY),
      ]);
    } finally {
      set({ token: null, user: null });
    }
  },
}));

/**
 * Called by the Axios 401 interceptor. Kept outside the hook so non-component
 * code (api/axios.ts) can trigger a logout without needing a React render.
 */
export function forceLogout() {
  useAuthStore.getState().logout();
}
