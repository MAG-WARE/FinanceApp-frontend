import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userGroupService } from "@/services/usergroup.service";
import { toast } from "@/hooks/use-toast";
import { formatApiError, getErrorDescription } from "@/lib/error-handler";
import { CreateUserGroupDto, UpdateUserGroupDto, JoinGroupDto, ShareGoalDto, UnshareGoalDto } from "@/lib/types";

export function useUserGroups() {
  return useQuery({
    queryKey: ["userGroups"],
    queryFn: userGroupService.getAll,
  });
}

export function useUserGroup(id: string) {
  return useQuery({
    queryKey: ["userGroups", id],
    queryFn: () => userGroupService.getById(id),
    enabled: !!id,
  });
}

export function useGroupMembers(groupId: string) {
  return useQuery({
    queryKey: ["userGroups", groupId, "members"],
    queryFn: () => userGroupService.getMembers(groupId),
    enabled: !!groupId,
  });
}

export function useCreateGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserGroupDto) => userGroupService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userGroups"] });
      toast({
        title: "Grupo criado!",
        description: "O grupo foi criado com sucesso.",
      });
    },
    onError: (error) => {
      const apiError = formatApiError(error);
      toast({
        variant: "destructive",
        title: "Erro ao criar grupo",
        description: getErrorDescription(apiError),
      });
    },
  });
}

export function useUpdateGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserGroupDto }) =>
      userGroupService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userGroups"] });
      toast({
        title: "Grupo atualizado!",
        description: "O grupo foi atualizado com sucesso.",
      });
    },
    onError: (error) => {
      const apiError = formatApiError(error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar grupo",
        description: getErrorDescription(apiError),
      });
    },
  });
}

export function useDeleteGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userGroupService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userGroups"] });
      toast({
        title: "Grupo excluído!",
        description: "O grupo foi excluído com sucesso.",
      });
    },
    onError: (error) => {
      const apiError = formatApiError(error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir grupo",
        description: getErrorDescription(apiError),
      });
    },
  });
}

export function useJoinGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: JoinGroupDto) => userGroupService.join(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userGroups"] });
      toast({
        title: "Entrou no grupo!",
        description: "Você agora faz parte do grupo.",
      });
    },
    onError: (error) => {
      const apiError = formatApiError(error);
      toast({
        variant: "destructive",
        title: "Erro ao entrar no grupo",
        description: getErrorDescription(apiError),
      });
    },
  });
}

export function useLeaveGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (groupId: string) => userGroupService.leave(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userGroups"] });
      toast({
        title: "Saiu do grupo!",
        description: "Você saiu do grupo com sucesso.",
      });
    },
    onError: (error) => {
      const apiError = formatApiError(error);
      toast({
        variant: "destructive",
        title: "Erro ao sair do grupo",
        description: getErrorDescription(apiError),
      });
    },
  });
}

export function useRemoveMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ groupId, memberUserId }: { groupId: string; memberUserId: string }) =>
      userGroupService.removeMember(groupId, memberUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userGroups"] });
      toast({
        title: "Membro removido!",
        description: "O membro foi removido do grupo.",
      });
    },
    onError: (error) => {
      const apiError = formatApiError(error);
      toast({
        variant: "destructive",
        title: "Erro ao remover membro",
        description: getErrorDescription(apiError),
      });
    },
  });
}

export function useRegenerateInviteCode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (groupId: string) => userGroupService.regenerateInviteCode(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userGroups"] });
      toast({
        title: "Código regenerado!",
        description: "O código de convite foi atualizado.",
      });
    },
    onError: (error) => {
      const apiError = formatApiError(error);
      toast({
        variant: "destructive",
        title: "Erro ao regenerar código",
        description: getErrorDescription(apiError),
      });
    },
  });
}

// Goal sharing hooks
export function useGoalUsers(goalId: string) {
  return useQuery({
    queryKey: ["goalUsers", goalId],
    queryFn: () => userGroupService.getGoalUsers(goalId),
    enabled: !!goalId,
  });
}

export function useShareGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ShareGoalDto) => userGroupService.shareGoal(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      queryClient.invalidateQueries({ queryKey: ["goalUsers"] });
      toast({
        title: "Meta compartilhada!",
        description: "A meta foi compartilhada com os membros selecionados.",
      });
    },
    onError: (error) => {
      const apiError = formatApiError(error);
      toast({
        variant: "destructive",
        title: "Erro ao compartilhar meta",
        description: getErrorDescription(apiError),
      });
    },
  });
}

export function useUnshareGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UnshareGoalDto) => userGroupService.unshareGoal(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      queryClient.invalidateQueries({ queryKey: ["goalUsers"] });
      toast({
        title: "Compartilhamento removido!",
        description: "O compartilhamento foi removido com sucesso.",
      });
    },
    onError: (error) => {
      const apiError = formatApiError(error);
      toast({
        variant: "destructive",
        title: "Erro ao remover compartilhamento",
        description: getErrorDescription(apiError),
      });
    },
  });
}

export function useSharedGoals() {
  return useQuery({
    queryKey: ["goals", "shared"],
    queryFn: async () => {
      const { goalsService } = await import("@/services/goals.service");
      return goalsService.getShared();
    },
  });
}
