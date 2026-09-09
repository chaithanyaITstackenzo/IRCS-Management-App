export interface Designation {
  id: string;
  name: string;
  description: string | null;
  status: boolean;
  employee_count?: number;
  created_at: string;
  updated_at: string;
}

export interface DesignationPayload {
  name: string;
  description?: string;
}
