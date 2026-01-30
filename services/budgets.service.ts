import api from "@/lib/api";
import { Budget, CreateBudgetDto, UpdateBudgetDto, ViewContextType } from "@/lib/types";

interface BudgetQueryParams {
  context?: ViewContextType;
  memberUserId?: string;
}

export const budgetsService = {
  getAll: async (params?: BudgetQueryParams): Promise<Budget[]> => {
    const response = await api.get<Budget[]>("/budget", { params });
    return response.data;
  },

  getById: async (id: string): Promise<Budget> => {
    const response = await api.get<Budget>(`/budget/${id}`);
    return response.data;
  },

  getByMonth: async (year: number, month: number, params?: BudgetQueryParams): Promise<Budget[]> => {
    const response = await api.get<Budget[]>(`/budget/month/${year}/${month}`, { params });
    return response.data;
  },

  create: async (data: CreateBudgetDto): Promise<Budget> => {
    const response = await api.post<Budget>("/budget", data);
    return response.data;
  },

  update: async (id: string, data: UpdateBudgetDto): Promise<Budget> => {
    const response = await api.put<Budget>(`/budget/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/budget/${id}`);
  },
};
