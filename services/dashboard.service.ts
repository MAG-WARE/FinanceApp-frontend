import api from "@/lib/api";
import { DashboardSummary } from "@/lib/types";

export const dashboardService = {
  getSummary: async (): Promise<DashboardSummary> => {
    const response = await api.get<DashboardSummary>("/dashboard/summary");
    return response.data;
  },

  getSummaryByMonth: async (
    year: number,
    month: number
  ): Promise<DashboardSummary> => {
    const response = await api.get<DashboardSummary>(
      `/dashboard/summary/${year}/${month}`
    );
    return response.data;
  },
};
