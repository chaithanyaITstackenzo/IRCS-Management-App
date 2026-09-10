import { AxiosError } from 'axios';

/**
 * Converts raw Axios/network errors into short, human-readable copy.
 * Never surface raw AxiosError text or backend stack traces to the user (spec §41/§100).
 */
export function getReadableErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  const err = error as AxiosError<{ message?: string; error?: string }>;

  if (!err?.isAxiosError) {
    return fallback;
  }

  if (err.code === 'ECONNABORTED') {
    return 'The request timed out. Please try again.';
  }

  if (!err.response) {
    return 'Unable to connect. Please check your internet connection.';
  }

  const status = err.response.status;
  const responseData = err.response.data;
  const backendMessage = typeof responseData === 'string'
    ? undefined
    : responseData?.message || responseData?.error;

  switch (status) {
    case 400:
    case 422:
      return backendMessage || 'Please check the information you entered and try again.';
    case 401:
      return 'Your session has expired. Please log in again.';
    case 403:
      return "You don't have permission to perform this action.";
    case 404:
      if (typeof responseData === 'string' && String(err.config?.url ?? '').includes('speaker/upload-audio')) {
        const baseUrl = err.config?.baseURL ?? '';
        const requestUrl = `${baseUrl}${err.config?.url ?? ''}`;
        return `Audio upload endpoint was not found at ${requestUrl}. Ask the backend team to deploy or mount POST /speaker/upload-audio.`;
      }
      return backendMessage || 'The requested information could not be found.';
    case 500:
    case 502:
    case 503:
      return 'The server is having trouble right now. Please try again shortly.';
    default:
      return backendMessage || fallback;
  }
}
