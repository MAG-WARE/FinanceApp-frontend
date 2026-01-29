import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard.service";

export function useDashboardSummary() {
  return useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: dashboardService.getSummary,
  });
}

export function useDashboardSummaryByMonth(year: number, month: number) {
  return useQuery({
    queryKey: ["dashboard", "summary", year, month],
    queryFn: () => dashboardService.getSummaryByMonth(year, month),
  });
}
