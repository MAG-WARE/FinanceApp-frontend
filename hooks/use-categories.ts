import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesService } from "@/services/categories.service";
import { toast } from "@/hooks/use-toast";
import { formatApiError, getErrorDescription } from "@/lib/error-handler";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: categoriesService.getAll,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoriesService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({
        title: "Categoria criada!",
        description: "A categoria foi criada com sucesso.",
      });
    },
    onError: (error) => {
      const apiError = formatApiError(error);
      toast({
        variant: "destructive",
        title: "Erro ao criar categoria",
        description: getErrorDescription(apiError),
      });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      categoriesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({
        title: "Categoria atualizada!",
        description: "A categoria foi atualizada com sucesso.",
      });
    },
    onError: (error) => {
      const apiError = formatApiError(error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar categoria",
        description: getErrorDescription(apiError),
      });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoriesService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({
        title: "Categoria deletada!",
        description: "A categoria foi deletada com sucesso.",
      });
    },
    onError: (error) => {
      const apiError = formatApiError(error);
      toast({
        variant: "destructive",
        title: "Erro ao deletar categoria",
        description: getErrorDescription(apiError),
      });
    },
  });
}
