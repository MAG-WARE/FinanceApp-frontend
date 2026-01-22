import { useQuery } from "@tanstack/react-query";
import { budgetsService } from "@/services/budgets.service";

export function useBudgetsByMonth(year: number, month: number) {
  return useQuery({
    queryKey: ["budgets", "month", year, month],
    queryFn: () => budgetsService.getByMonth(year, month),
  });
}
