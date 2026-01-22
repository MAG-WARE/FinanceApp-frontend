import api from "@/lib/api";
import {
  DashboardSummary,
  CategorySpending,
  BalanceEvolution,
} from "@/lib/types";

export const dashboardService = {
  getSummary: async (): Promise<DashboardSummary> => {
    const response = await api.get<DashboardSummary>("/dashboard/summary");
    return response.data;
  },

  getByCategory: async (): Promise<CategorySpending[]> => {
    const response = await api.get<CategorySpending[]>(
      "/dashboard/by-category"
    );
    return response.data;
  },

  getBalanceEvolution: async (): Promise<BalanceEvolution[]> => {
    const response = await api.get<BalanceEvolution[]>(
      "/dashboard/balance-evolution"
    );
    return response.data;
  },
};
