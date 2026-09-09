import { AxiosError } from 'axios';

/**
 * Converts raw Axios/network errors into short, human-readable copy.
 * Never surface raw AxiosError text or backend stack traces to the user (spec §41/§100).
 */
export function getReadableErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  const err = error as AxiosError<{ message?: string }>;

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
  const backendMessage = err.response.data?.message;

  switch (status) {
    case 400:
    case 422:
      return backendMessage || 'Please check the information you entered and try again.';
    case 401:
      return 'Your session has expired. Please log in again.';
    case 403:
      return "You don't have permission to perform this action.";
    case 404:
      return 'The requested information could not be found.';
    case 500:
    case 502:
    case 503:
      return 'The server is having trouble right now. Please try again shortly.';
    default:
      return backendMessage || fallback;
  }
}
