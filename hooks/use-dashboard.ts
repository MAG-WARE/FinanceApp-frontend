import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard.service";

export function useDashboardSummary() {
  return useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: dashboardService.getSummary,
  });
}

export function useDashboardByCategory() {
  return useQuery({
    queryKey: ["dashboard", "by-category"],
    queryFn: dashboardService.getByCategory,
  });
}

export function useDashboardBalanceEvolution() {
  return useQuery({
    queryKey: ["dashboard", "balance-evolution"],
    queryFn: dashboardService.getBalanceEvolution,
  });
}
