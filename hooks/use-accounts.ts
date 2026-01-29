import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { accountsService } from "@/services/accounts.service";
import { toast } from "@/hooks/use-toast";
import { formatApiError, getErrorDescription } from "@/lib/error-handler";

export function useAccounts() {
  return useQuery({
    queryKey: ["accounts"],
    queryFn: accountsService.getAll,
  });
}

export function useCreateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: accountsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast({
        title: "Conta criada!",
        description: "A conta foi criada com sucesso.",
      });
    },
    onError: (error) => {
      const apiError = formatApiError(error);
      toast({
        variant: "destructive",
        title: "Erro ao criar conta",
        description: getErrorDescription(apiError),
      });
    },
  });
}

export function useUpdateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      accountsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast({
        title: "Conta atualizada!",
        description: "A conta foi atualizada com sucesso.",
      });
    },
    onError: (error) => {
      const apiError = formatApiError(error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar conta",
        description: getErrorDescription(apiError),
      });
    },
  });
}

export function useToggleAccountStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: accountsService.toggleActive,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast({
        title: "Status atualizado!",
        description: "O status da conta foi alterado com sucesso.",
      });
    },
    onError: (error) => {
      const apiError = formatApiError(error);
      toast({
        variant: "destructive",
        title: "Erro ao alterar status",
        description: getErrorDescription(apiError),
      });
    },
  });
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: accountsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast({
        title: "Conta deletada!",
        description: "A conta foi deletada com sucesso.",
      });
    },
    onError: (error) => {
      const apiError = formatApiError(error);
      toast({
        variant: "destructive",
        title: "Erro ao deletar conta",
        description: getErrorDescription(apiError),
      });
    },
  });
}
