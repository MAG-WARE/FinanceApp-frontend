import api from "@/lib/api";
import { DashboardSummary } from "@/lib/types";

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

  getSummaryByMonth: async (
    year: number,
    month: number
  ): Promise<DashboardSummary> => {
    console.log(
      `🔍 [dashboardService] Fetching summary for ${year}/${month}...`
    );
    try {
      const response = await api.get<DashboardSummary>(
        `/dashboard/summary/${year}/${month}`
      );
      console.log(
        "✅ [dashboardService] Summary by month fetched:",
        response.data
      );
      return response.data;
    } catch (error) {
      console.error(
        "❌ [dashboardService] Error fetching summary by month:",
        error
      );
      throw error;
    }
  },
};
