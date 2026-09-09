/** The backend wraps responses as { success, data }. Confirmed shape (section 63 of spec). */
export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiErrorBody {
  success: false;
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
}

/** Only used where the backend is confirmed to paginate — see api docs per module. */
export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
