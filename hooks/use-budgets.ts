import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { budgetsService } from "@/services/budgets.service";
import { toast } from "@/hooks/use-toast";
import { formatApiError, getErrorDescription } from "@/lib/error-handler";

export function useBudgets() {
  return useQuery({
    queryKey: ["budgets"],
    queryFn: () => budgetsService.getAll(),
  });
}

export function useBudgetsByMonth(year: number, month: number) {
  return useQuery({
    queryKey: ["budgets", "month", year, month],
    queryFn: () => budgetsService.getByMonth(year, month),
  });
}

export function useCreateBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: budgetsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      toast({
        title: "Orçamento criado!",
        description: "O orçamento foi criado com sucesso.",
      });
    },
    onError: (error) => {
      const apiError = formatApiError(error);
      toast({
        variant: "destructive",
        title: "Erro ao criar orçamento",
        description: getErrorDescription(apiError),
      });
    },
  });
}

export function useUpdateBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      budgetsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      toast({
        title: "Orçamento atualizado!",
        description: "O orçamento foi atualizado com sucesso.",
      });
    },
    onError: (error) => {
      const apiError = formatApiError(error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar orçamento",
        description: getErrorDescription(apiError),
      });
    },
  });
}

export function useDeleteBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: budgetsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      toast({
        title: "Orçamento deletado!",
        description: "O orçamento foi deletado com sucesso.",
      });
    },
    onError: (error) => {
      const apiError = formatApiError(error);
      toast({
        variant: "destructive",
        title: "Erro ao deletar orçamento",
        description: getErrorDescription(apiError),
      });
    },
  });
}
