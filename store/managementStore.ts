import { create } from 'zustand';

/**
 * Small piece of genuinely global, non-server UI state.
 * Server data (employees, attendance, etc.) belongs in React Query, not here (spec §38).
 */
interface ManagementState {
  isOffline: boolean;
  setOffline: (offline: boolean) => void;

  activeEmployeeFilters: {
    department_id?: string;
    designation_id?: string;
    shift_id?: string;
    status?: boolean;
  };
  setActiveEmployeeFilters: (filters: ManagementState['activeEmployeeFilters']) => void;
  resetActiveEmployeeFilters: () => void;
}

export const useManagementStore = create<ManagementState>((set) => ({
  isOffline: false,
  setOffline: (offline) => set({ isOffline: offline }),

  activeEmployeeFilters: {},
  setActiveEmployeeFilters: (filters) => set({ activeEmployeeFilters: filters }),
  resetActiveEmployeeFilters: () => set({ activeEmployeeFilters: {} }),
}));
