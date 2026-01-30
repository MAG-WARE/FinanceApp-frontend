"use client";

import { useState } from "react";
import { useGoals } from "@/hooks/use-goals";
import { useSharedGoals, useUserGroups } from "@/hooks/use-user-groups";
import { useViewContext } from "@/contexts/ViewContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { Plus, Target, Pencil, Share2, Users } from "lucide-react";
import { GoalDialog } from "@/components/goals/goal-dialog";
import { ShareGoalDialog } from "@/components/goals/share-goal-dialog";
import { Goal } from "@/lib/types";

export default function GoalsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [activeTab, setActiveTab] = useState("my-goals");

  const { canEdit, getQueryParams, isViewingOwn } = useViewContext();
  const queryParams = getQueryParams();

  const { data: goals, isLoading } = useGoals(queryParams);
  const { data: sharedGoals } = useSharedGoals();
  const { data: groups } = useUserGroups();

  const hasGroups = groups && groups.length > 0;

  const handleOpenDialog = (goal?: Goal) => {
    if (goal) {
      setSelectedGoal(goal);
    } else {
      setSelectedGoal(null);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedGoal(null);
  };

  const handleOpenShareDialog = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsShareDialogOpen(true);
  };

  const handleCloseShareDialog = () => {
    setIsShareDialogOpen(false);
    setSelectedGoal(null);
  };

  const renderGoalCard = (goal: Goal, canModify: boolean) => {
    const percentage = (goal.currentAmount / goal.targetAmount) * 100;
    const isCompleted = goal.isCompleted || percentage >= 100;
    const isOwner = goal.isOwner !== false;
    const isShared = goal.isShared || (goal.sharedWith && goal.sharedWith.length > 0);

    return (
      <Card key={goal.id}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">{goal.name}</CardTitle>
              {isShared && (
                <Badge variant="outline" className="gap-1">
                  <Users className="h-3 w-3" />
                  Compartilhada
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              {isCompleted && <Badge className="bg-green-500">Concluída</Badge>}
              {canModify && isOwner && hasGroups && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOpenShareDialog(goal)}
                  className="h-8 w-8 p-0"
                  title="Compartilhar"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              )}
              {canModify && isOwner && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOpenDialog(goal)}
                  className="h-8 w-8 p-0"
                  title="Editar"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          {goal.description && (
            <p className="text-sm text-muted-foreground">{goal.description}</p>
          )}
          {!isOwner && goal.ownerName && (
            <p className="text-xs text-muted-foreground">
              Proprietário: {goal.ownerName}
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Atual</span>
            <span className="font-bold text-green-500">
              {formatCurrency(goal.currentAmount)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Meta</span>
            <span className="font-bold">{formatCurrency(goal.targetAmount)}</span>
          </div>
          <div className="space-y-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${isCompleted ? "bg-green-500" : "bg-indigo-500"}`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
            <p className="text-xs text-center text-muted-foreground">
              {percentage.toFixed(0)}% concluído
            </p>
          </div>
          {goal.targetDate && (
            <p className="text-xs text-muted-foreground text-center">
              Data alvo: {formatDate(goal.targetDate)}
            </p>
          )}
          {isShared && goal.sharedWith && goal.sharedWith.length > 0 && (
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground mb-1">Compartilhada com:</p>
              <div className="flex flex-wrap gap-1">
                {goal.sharedWith
                  .filter((u) => !u.isOwner)
                  .slice(0, 3)
                  .map((user) => (
                    <Badge key={user.userId} variant="secondary" className="text-xs">
                      {user.userName.split(" ")[0]}
                    </Badge>
                  ))}
                {goal.sharedWith.filter((u) => !u.isOwner).length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{goal.sharedWith.filter((u) => !u.isOwner).length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Metas</h1>
          <p className="text-muted-foreground">
            Acompanhe o progresso das suas metas financeiras
          </p>
        </div>
        {canEdit && (
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Meta
          </Button>
        )}
      </div>

      {!isViewingOwn && (
        <div className="bg-muted/50 border rounded-lg p-3 text-sm text-muted-foreground">
          Visualizando dados de outro contexto. Edição desabilitada.
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="my-goals">Minhas Metas</TabsTrigger>
          {hasGroups && (
            <TabsTrigger value="shared-goals">
              Compartilhadas Comigo
              {sharedGoals && sharedGoals.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                  {sharedGoals.length}
                </Badge>
              )}
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="my-goals" className="mt-4">
          {goals && goals.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {goals.map((goal) => renderGoalCard(goal, canEdit))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Target className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Nenhuma meta cadastrada</p>
                {canEdit && (
                  <Button className="mt-4" onClick={() => handleOpenDialog()}>
                    <Plus className="mr-2 h-4 w-4" />
                    Criar primeira meta
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {hasGroups && (
          <TabsContent value="shared-goals" className="mt-4">
            {sharedGoals && sharedGoals.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {sharedGoals.map((goal) => renderGoalCard(goal, false))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Nenhuma meta foi compartilhada com você
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Peça para membros do seu grupo compartilharem metas
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        )}
      </Tabs>

      <GoalDialog
        open={isDialogOpen}
        onOpenChange={handleCloseDialog}
        goal={selectedGoal}
      />

      <ShareGoalDialog
        open={isShareDialogOpen}
        onOpenChange={handleCloseShareDialog}
        goal={selectedGoal}
      />
    </div>
  );
}
