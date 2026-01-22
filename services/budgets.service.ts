import api from "@/lib/api";
import { Budget, CreateBudgetDto, UpdateBudgetDto } from "@/lib/types";

export const budgetsService = {
  getAll: async (): Promise<Budget[]> => {
    const response = await api.get<Budget[]>("/budgets");
    return response.data;
  },

  getById: async (id: string): Promise<Budget> => {
    const response = await api.get<Budget>(`/budgets/${id}`);
    return response.data;
  },

  getByMonth: async (year: number, month: number): Promise<Budget[]> => {
    const response = await api.get<Budget[]>(`/budgets/month/${year}/${month}`);
    return response.data;
  },

  create: async (data: CreateBudgetDto): Promise<Budget> => {
    const response = await api.post<Budget>("/budgets", data);
    return response.data;
  },

  update: async (id: string, data: UpdateBudgetDto): Promise<Budget> => {
    const response = await api.put<Budget>(`/budgets/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/budgets/${id}`);
  },
};
