"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  useDeleteGroup,
  useLeaveGroup,
  useRemoveMember,
  useRegenerateInviteCode,
} from "@/hooks/use-user-groups";
import { UserGroup, GroupMemberRole, GroupMemberRoleLabels } from "@/lib/types";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { Copy, RefreshCw, UserMinus, Trash2, LogOut, Pencil, Crown, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/utils/format";

interface GroupDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group: UserGroup | null;
  onEdit: () => void;
}

export function GroupDetailsDialog({ open, onOpenChange, group, onEdit }: GroupDetailsDialogProps) {
  const { user } = useAuth();
  const deleteMutation = useDeleteGroup();
  const leaveMutation = useLeaveGroup();
  const removeMemberMutation = useRemoveMember();
  const regenerateCodeMutation = useRegenerateInviteCode();
  const [memberToRemove, setMemberToRemove] = useState<string | null>(null);

  if (!group) return null;

  const isOwner = group.createdByUserId === user?.id;
  const currentMember = group.members.find((m) => m.userId === user?.id);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(group.inviteCode);
      toast({
        title: "Copiado!",
        description: "Código de convite copiado para a área de transferência.",
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível copiar o código.",
      });
    }
  };

  const handleRegenerateCode = async () => {
    try {
      await regenerateCodeMutation.mutateAsync(group.id);
    } catch {
      // Error handled in mutation
    }
  };

  const handleLeave = async () => {
    try {
      await leaveMutation.mutateAsync(group.id);
      onOpenChange(false);
    } catch {
      // Error handled in mutation
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(group.id);
      onOpenChange(false);
    } catch {
      // Error handled in mutation
    }
  };

  const handleRemoveMember = async (memberUserId: string) => {
    try {
      await removeMemberMutation.mutateAsync({ groupId: group.id, memberUserId });
      setMemberToRemove(null);
    } catch {
      // Error handled in mutation
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>{group.name}</DialogTitle>
              {group.description && (
                <DialogDescription>{group.description}</DialogDescription>
              )}
            </div>
            {isOwner && (
              <Button variant="ghost" size="icon" onClick={onEdit}>
                <Pencil className="h-4 w-4" />
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Invite Code Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Código de Convite</label>
            <div className="flex gap-2">
              <div className="flex-1 flex items-center justify-between px-3 py-2 bg-muted rounded-md">
                <code className="font-mono text-sm">{group.inviteCode}</code>
                <Button variant="ghost" size="icon" onClick={handleCopyCode}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              {isOwner && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleRegenerateCode}
                  disabled={regenerateCodeMutation.isPending}
                >
                  {regenerateCodeMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Compartilhe este código para convidar outras pessoas
            </p>
          </div>

          {/* Members Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Membros ({group.memberCount})
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {group.members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs bg-indigo-100 text-indigo-700">
                        {getInitials(member.userName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{member.userName}</span>
                        {member.role === GroupMemberRole.Owner && (
                          <Crown className="h-3 w-3 text-yellow-500" />
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">{member.userEmail}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {GroupMemberRoleLabels[member.role]}
                    </Badge>
                    {isOwner && member.userId !== user?.id && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          >
                            <UserMinus className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remover membro</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja remover {member.userName} do grupo?
                              Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={() => handleRemoveMember(member.userId)}
                            >
                              Remover
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Info Section */}
          <div className="text-xs text-muted-foreground">
            <p>Criado por {group.createdByUserName} em {formatDate(group.createdAt)}</p>
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-4 border-t">
            {isOwner ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir Grupo
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Excluir grupo</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja excluir o grupo &quot;{group.name}&quot;?
                      Todos os membros serão removidos e as metas compartilhadas serão desvinculadas.
                      Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={handleDelete}
                    >
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair do Grupo
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Sair do grupo</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja sair do grupo &quot;{group.name}&quot;?
                      Você não terá mais acesso aos dados compartilhados.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLeave}>
                      Sair
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
