"use client";

import { useViewContext } from "@/contexts/ViewContext";
import { useUserGroups } from "@/hooks/use-user-groups";
import { useAuth } from "@/contexts/AuthContext";
import { GroupMember, GroupMemberRole, ViewContextType } from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Eye, User, Users, ChevronDown, Check } from "lucide-react";

export function ViewContextSwitcher() {
  const { user } = useAuth();
  const { viewContext, setViewOwn, setViewMember, setViewAll, isViewingOwn, isViewingMember, isViewingAll } = useViewContext();
  const { data: groups } = useUserGroups();

  // Collect all unique members from all groups (excluding current user)
  const allMembers = groups?.reduce<GroupMember[]>((acc, group) => {
    group.members.forEach((member) => {
      if (member.userId !== user?.id && !acc.find((m) => m.userId === member.userId)) {
        acc.push(member);
      }
    });
    return acc;
  }, []) ?? [];

  const hasGroups = groups && groups.length > 0;
  const hasMembers = allMembers.length > 0;

  const getDisplayLabel = () => {
    if (isViewingOwn) return "Meus dados";
    if (isViewingMember && viewContext.memberUserName) return viewContext.memberUserName;
    if (isViewingAll) return "Todos";
    return "Visualizar";
  };

  const getDisplayIcon = () => {
    if (isViewingOwn) return <User className="h-4 w-4" />;
    if (isViewingMember) return <User className="h-4 w-4" />;
    if (isViewingAll) return <Users className="h-4 w-4" />;
    return <Eye className="h-4 w-4" />;
  };

  if (!hasGroups) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="w-full justify-between gap-2">
          <div className="flex items-center gap-2">
            {getDisplayIcon()}
            <span className="truncate">{getDisplayLabel()}</span>
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Visualizar dados de</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={setViewOwn} className="gap-2">
          <User className="h-4 w-4" />
          <span>Meus dados</span>
          {isViewingOwn && <Check className="h-4 w-4 ml-auto" />}
        </DropdownMenuItem>

        {hasMembers && (
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="gap-2">
              <User className="h-4 w-4" />
              <span>Membro específico</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {allMembers.map((member) => (
                <DropdownMenuItem
                  key={member.userId}
                  onClick={() => setViewMember(member)}
                  className="gap-2"
                >
                  <span className="truncate">{member.userName}</span>
                  {isViewingMember && viewContext.memberUserId === member.userId && (
                    <Check className="h-4 w-4 ml-auto" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        )}

        {hasMembers && (
          <DropdownMenuItem onClick={setViewAll} className="gap-2">
            <Users className="h-4 w-4" />
            <span>Todos os membros</span>
            {isViewingAll && <Check className="h-4 w-4 ml-auto" />}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
