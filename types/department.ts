export interface Department {
  id: string;
  name: string;
  description: string | null;
  status: boolean;
  employee_count?: number;
  created_at: string;
  updated_at: string;
}

export interface DepartmentPayload {
  name: string;
  description?: string;
}
