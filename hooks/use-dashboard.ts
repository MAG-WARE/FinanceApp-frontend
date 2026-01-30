import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard.service";
import { ViewContextType } from "@/lib/types";

interface DashboardQueryParams {
  context?: ViewContextType;
  memberUserId?: string;
}

export function useDashboardSummary(params?: DashboardQueryParams) {
  return useQuery({
    queryKey: ["dashboard", "summary", params],
    queryFn: () => dashboardService.getSummary(params),
  });
}

export function useDashboardSummaryByMonth(year: number, month: number, params?: DashboardQueryParams) {
  return useQuery({
    queryKey: ["dashboard", "summary", year, month, params],
    queryFn: () => dashboardService.getSummaryByMonth(year, month, params),
  });
}
