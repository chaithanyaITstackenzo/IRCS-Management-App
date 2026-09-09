/**
 * Single source of truth for the backend server origin.
 * Resource clients append their own /api/hr, /api/fill, or /api/notifications prefix.
 */
import Constants from 'expo-constants';

const ENV_URL =
  process.env.EXPO_PUBLIC_API_URL ??
  (Constants.expoConfig?.extra as Record<string, string> | undefined)?.apiUrl;

// Fallback only used if EXPO_PUBLIC_API_URL is not configured — replace via .env for real builds.
export const API_BASE_URL = ENV_URL ?? 'https://ircs-test.stackenzo.com';

export const APP_ENV = process.env.EXPO_PUBLIC_ENV ?? 'development';
export const MOCK_AUTH_ENABLED = APP_ENV === 'development' && process.env.EXPO_PUBLIC_MOCK_AUTH === 'true';

export const ENROLLMENT_REQUIRED_IMAGE_COUNT = 20;
