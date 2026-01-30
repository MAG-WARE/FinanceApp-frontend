import api from "@/lib/api";
import { DashboardSummary, ViewContextType } from "@/lib/types";

interface DashboardQueryParams {
  context?: ViewContextType;
  memberUserId?: string;
}

export const dashboardService = {
  getSummary: async (params?: DashboardQueryParams): Promise<DashboardSummary> => {
    const response = await api.get<DashboardSummary>("/dashboard/summary", { params });
    return response.data;
  },

  getSummaryByMonth: async (
    year: number,
    month: number,
    params?: DashboardQueryParams
  ): Promise<DashboardSummary> => {
    const response = await api.get<DashboardSummary>(
      `/dashboard/summary/${year}/${month}`,
      { params }
    );
    return response.data;
  },
};
