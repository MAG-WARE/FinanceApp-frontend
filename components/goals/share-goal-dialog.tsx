"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserGroups, useShareGoal, useUnshareGoal, useGoalUsers } from "@/hooks/use-user-groups";
import { Goal, GroupMember } from "@/lib/types";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Users, UserMinus } from "lucide-react";
import { formatDate } from "@/lib/utils/format";

interface ShareGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal: Goal | null;
}

export function ShareGoalDialog({ open, onOpenChange, goal }: ShareGoalDialogProps) {
  const { user } = useAuth();
  const { data: groups } = useUserGroups();
  const { data: goalUsers, isLoading: isLoadingUsers } = useGoalUsers(goal?.id ?? "");
  const shareMutation = useShareGoal();
  const unshareMutation = useUnshareGoal();

  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  // Get all unique members from all groups (excluding current user)
  const allMembers = groups?.reduce<GroupMember[]>((acc, group) => {
    group.members.forEach((member) => {
      if (member.userId !== user?.id && !acc.find((m) => m.userId === member.userId)) {
        acc.push(member);
      }
    });
    return acc;
  }, []) ?? [];

  // Get currently shared user IDs
  const sharedUserIds = goalUsers?.filter((gu) => !gu.isOwner).map((gu) => gu.userId) ?? [];

  useEffect(() => {
    if (open && goalUsers) {
      setSelectedMembers(sharedUserIds);
    }
  }, [open, goalUsers]);

  if (!goal) return null;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleToggleMember = (userId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSave = async () => {
    // Find members to add (in selected but not in current)
    const toAdd = selectedMembers.filter((id) => !sharedUserIds.includes(id));
    // Find members to remove (in current but not in selected)
    const toRemove = sharedUserIds.filter((id) => !selectedMembers.includes(id));

    try {
      // Share with new members
      if (toAdd.length > 0) {
        await shareMutation.mutateAsync({ goalId: goal.id, userIds: toAdd });
      }

      // Unshare from removed members
      for (const userId of toRemove) {
        await unshareMutation.mutateAsync({ goalId: goal.id, userId });
      }

      onOpenChange(false);
    } catch {
      // Error handled in mutation
    }
  };

  const hasChanges =
    selectedMembers.some((id) => !sharedUserIds.includes(id)) ||
    sharedUserIds.some((id) => !selectedMembers.includes(id));

  const isPending = shareMutation.isPending || unshareMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Compartilhar Meta</DialogTitle>
          <DialogDescription>
            Selecione os membros do grupo com quem deseja compartilhar a meta &quot;{goal.name}&quot;
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {allMembers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Você ainda não faz parte de nenhum grupo.
              </p>
              <p className="text-sm text-muted-foreground">
                Crie ou entre em um grupo para compartilhar metas.
              </p>
            </div>
          ) : isLoadingUsers ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {allMembers.map((member) => {
                  const isSelected = selectedMembers.includes(member.userId);
                  const goalUser = goalUsers?.find((gu) => gu.userId === member.userId);

                  return (
                    <div
                      key={member.userId}
                      className="flex items-center justify-between p-3 rounded-md hover:bg-muted/50 cursor-pointer"
                      onClick={() => handleToggleMember(member.userId)}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleToggleMember(member.userId)}
                        />
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs bg-indigo-100 text-indigo-700">
                            {getInitials(member.userName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <span className="text-sm font-medium">{member.userName}</span>
                          <p className="text-xs text-muted-foreground">{member.userEmail}</p>
                        </div>
                      </div>
                      {goalUser && (
                        <Badge variant="outline" className="text-xs">
                          Compartilhada
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>

              {goalUsers && goalUsers.length > 1 && (
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium mb-2">Compartilhado com:</p>
                  <div className="flex flex-wrap gap-2">
                    {goalUsers
                      .filter((gu) => !gu.isOwner)
                      .map((gu) => (
                        <Badge key={gu.userId} variant="secondary" className="gap-1">
                          {gu.userName}
                          <span className="text-xs text-muted-foreground">
                            ({formatDate(gu.addedAt)})
                          </span>
                        </Badge>
                      ))}
                  </div>
                </div>
              )}
            </>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            {allMembers.length > 0 && (
              <Button
                onClick={handleSave}
                disabled={!hasChanges || isPending}
              >
                {isPending ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Salvando...</>
                ) : (
                  <>Salvar</>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
