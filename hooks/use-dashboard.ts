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

// Helper hooks that derive data from the main summary
export function useDashboardByCategory() {
  const query = useDashboardSummary();
  return {
    ...query,
    data: query.data?.topSpendingCategories ?? [],
  };
}

export function useDashboardBalanceEvolution() {
  const query = useDashboardSummary();
  return {
    ...query,
    data: query.data?.balanceHistory ?? [],
  };
}

export function useDashboardComparison() {
  const query = useDashboardSummary();
  return {
    ...query,
    data: query.data?.comparison,
  };
}
