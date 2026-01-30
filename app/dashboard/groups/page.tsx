"use client";

import { useState } from "react";
import { useUserGroups } from "@/hooks/use-user-groups";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GroupDialog } from "@/components/groups/group-dialog";
import { JoinGroupDialog } from "@/components/groups/join-group-dialog";
import { GroupDetailsDialog } from "@/components/groups/group-details-dialog";
import { UserGroup, GroupMemberRole } from "@/lib/types";
import { Plus, Users, UserPlus, Crown, Settings } from "lucide-react";
import { formatDate } from "@/lib/utils/format";

export default function GroupsPage() {
  const { user } = useAuth();
  const { data: groups, isLoading } = useUserGroups();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<UserGroup | null>(null);

  const handleOpenDetails = (group: UserGroup) => {
    setSelectedGroup(group);
    setIsDetailsDialogOpen(true);
  };

  const handleEditFromDetails = () => {
    setIsDetailsDialogOpen(false);
    setIsEditDialogOpen(true);
  };

  const handleCloseEdit = () => {
    setIsEditDialogOpen(false);
    setSelectedGroup(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Grupos</h1>
          <p className="text-muted-foreground">
            Gerencie seus grupos e compartilhe metas com outras pessoas
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsJoinDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Entrar em Grupo
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Criar Grupo
          </Button>
        </div>
      </div>

      {groups && groups.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => {
            const isOwner = group.createdByUserId === user?.id;
            const currentMember = group.members.find((m) => m.userId === user?.id);

            return (
              <Card
                key={group.id}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleOpenDetails(group)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {group.name}
                      {isOwner && <Crown className="h-4 w-4 text-yellow-500" />}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDetails(group);
                      }}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                  {group.description && (
                    <CardDescription>{group.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {group.memberCount} {group.memberCount === 1 ? "membro" : "membros"}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {group.members.slice(0, 3).map((member) => (
                      <Badge
                        key={member.id}
                        variant={member.role === GroupMemberRole.Owner ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {member.userName.split(" ")[0]}
                        {member.role === GroupMemberRole.Owner && (
                          <Crown className="ml-1 h-3 w-3" />
                        )}
                      </Badge>
                    ))}
                    {group.members.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{group.members.length - 3}
                      </Badge>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Criado em {formatDate(group.createdAt)}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2">Nenhum grupo encontrado</p>
            <p className="text-sm text-muted-foreground mb-4">
              Crie um grupo ou entre em um existente para compartilhar metas
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsJoinDialogOpen(true)}>
                <UserPlus className="mr-2 h-4 w-4" />
                Entrar em Grupo
              </Button>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Criar Grupo
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <GroupDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />

      <GroupDialog
        open={isEditDialogOpen}
        onOpenChange={handleCloseEdit}
        group={selectedGroup}
      />

      <JoinGroupDialog
        open={isJoinDialogOpen}
        onOpenChange={setIsJoinDialogOpen}
      />

      <GroupDetailsDialog
        open={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
        group={selectedGroup}
        onEdit={handleEditFromDetails}
      />
    </div>
  );
}
