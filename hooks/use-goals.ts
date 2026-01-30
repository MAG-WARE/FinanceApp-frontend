import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { goalsService } from "@/services/goals.service";
import { toast } from "@/hooks/use-toast";
import { formatApiError, getErrorDescription } from "@/lib/error-handler";
import { ViewContextType } from "@/lib/types";

interface GoalQueryParams {
  context?: ViewContextType;
  memberUserId?: string;
}

export function useGoals(params?: GoalQueryParams) {
  return useQuery({
    queryKey: ["goals", params],
    queryFn: () => goalsService.getAll(params),
  });
}

export function useCreateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: goalsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      toast({
        title: "Meta criada!",
        description: "A meta foi criada com sucesso.",
      });
    },
    onError: (error) => {
      const apiError = formatApiError(error);
      toast({
        variant: "destructive",
        title: "Erro ao criar meta",
        description: getErrorDescription(apiError),
      });
    },
  });
}

export function useUpdateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      goalsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      toast({
        title: "Meta atualizada!",
        description: "A meta foi atualizada com sucesso.",
      });
    },
    onError: (error) => {
      const apiError = formatApiError(error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar meta",
        description: getErrorDescription(apiError),
      });
    },
  });
}

export function useDeleteGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: goalsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      toast({
        title: "Meta deletada!",
        description: "A meta foi deletada com sucesso.",
      });
    },
    onError: (error) => {
      const apiError = formatApiError(error);
      toast({
        variant: "destructive",
        title: "Erro ao deletar meta",
        description: getErrorDescription(apiError),
      });
    },
  });
}
