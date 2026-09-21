import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '@/constants/api';
import { useAuthStore, forceLogout } from '@/store/authStore';

const createClient = (prefix: string) => axios.create({
  baseURL: `${API_BASE_URL.replace(/\/(api\/hr|api\/fill|api\/notifications|api\/v1)\/?$/, '')}${prefix}`,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const hrApi = createClient('/api/hr');
export const shiftsApi = createClient('/api/shifts');
export const fillApi = createClient('/api/fill');
export const notificationsApi = createClient('/api/notifications');
export const api = hrApi;

// Attach the JWT to every outgoing request. Never log the token itself.
const attachAuth = (config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().token;
  if (token && config.headers) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
};

const handleRequestError = (error: unknown) => Promise.reject(error);

const handleResponseError = (error: AxiosError) => {
  if (error.response?.status === 401 && !String(error.config?.url ?? '').endsWith('/userLogin')) {
    forceLogout();
  }
  return Promise.reject(error);
};

[hrApi, shiftsApi, fillApi, notificationsApi].forEach((client) => {
  client.interceptors.request.use(attachAuth, handleRequestError);
  client.interceptors.response.use((response) => response, handleResponseError);
});

/*
 * Keep the legacy export as the HR client so existing imports continue to work
 * while each service moves to its correct backend prefix.
 */
/* api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
); */

// Normalize 401s into a single logout path so the router guard in app/_layout.tsx
// naturally redirects to /login without any screen needing to know about it.
/* api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      forceLogout();
    }
    return Promise.reject(error);
  }
); */

/** multipart/form-data client for enrollment image uploads (see api/enrollment.ts). */
export const uploadApi = axios.create({
  baseURL: `${API_BASE_URL.replace(/\/(api\/hr|api\/fill|api\/notifications|api\/v1)\/?$/, '')}/api/hr`,
  timeout: 60000,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

uploadApi.interceptors.request.use(attachAuth);

uploadApi.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    return handleResponseError(error);
  }
);

/** Multipart client for hardware routes such as speaker audio uploads. */
export const hardwareUploadApi = axios.create({
  baseURL: `${API_BASE_URL.replace(/\/(api\/hr|api\/fill|api\/notifications|api\/v1)\/?$/, '')}/api/handle`,
  timeout: 60000,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

hardwareUploadApi.interceptors.request.use(attachAuth);
hardwareUploadApi.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => handleResponseError(error),
);
