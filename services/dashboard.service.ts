import api from "@/lib/api";
import {
  DashboardSummary,
  CategorySpending,
  BalanceEvolution,
} from "@/lib/types";

export const dashboardService = {
  getSummary: async (): Promise<DashboardSummary> => {
    console.log("🔍 [dashboardService] Fetching summary...");
    try {
      const response = await api.get<DashboardSummary>("/dashboard/summary");
      console.log("✅ [dashboardService] Summary fetched:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ [dashboardService] Error fetching summary:", error);
      throw error;
    }
  },

  getByCategory: async (): Promise<CategorySpending[]> => {
    console.log("🔍 [dashboardService] Fetching by-category...");
    try {
      const response = await api.get<CategorySpending[]>(
        "/dashboard/by-category"
      );
      console.log("✅ [dashboardService] By-category fetched:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ [dashboardService] Error fetching by-category:", error);
      throw error;
    }
  },

  getBalanceEvolution: async (): Promise<BalanceEvolution[]> => {
    console.log("🔍 [dashboardService] Fetching balance-evolution...");
    try {
      const response = await api.get<BalanceEvolution[]>(
        "/dashboard/balance-evolution"
      );
      console.log("✅ [dashboardService] Balance-evolution fetched:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ [dashboardService] Error fetching balance-evolution:", error);
      throw error;
    }
  },
};
