"use client";

import { useState } from "react";
import { useGoals } from "@/hooks/use-goals";
import { useTransactions } from "@/hooks/use-transactions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { Plus, Target, Pencil, ChevronDown, ChevronUp, ArrowUpRight } from "lucide-react";
import { GoalDialog } from "@/components/goals/goal-dialog";
import { Goal } from "@/lib/types";

export default function GoalsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [expandedGoalId, setExpandedGoalId] = useState<string | null>(null);
  const { data: goals, isLoading } = useGoals();
  const { data: transactions } = useTransactions();

  // Agrupar transações por meta
  const getTransactionsForGoal = (goalId: string) => {
    return transactions?.filter(t => t.goalId === goalId) || [];
  };

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Metas</h1>
          <p className="text-muted-foreground">
            Acompanhe o progresso das suas metas financeiras
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Meta
        </Button>
      </div>

      {goals && goals.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => {
            const percentage = (goal.currentAmount / goal.targetAmount) * 100;
            const isCompleted = goal.isCompleted || percentage >= 100;

            return (
              <Card key={goal.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{goal.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      {isCompleted && <Badge className="bg-green-500">Concluída</Badge>}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDialog(goal)}
                        className="h-8 w-8 p-0"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {goal.description && (
                    <p className="text-sm text-muted-foreground">{goal.description}</p>
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

                  {/* Transações vinculadas */}
                  {getTransactionsForGoal(goal.id).length > 0 && (
                    <div className="pt-2 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-between text-xs"
                        onClick={() => setExpandedGoalId(expandedGoalId === goal.id ? null : goal.id)}
                      >
                        <span className="flex items-center gap-1">
                          <ArrowUpRight className="h-3 w-3" />
                          {getTransactionsForGoal(goal.id).length} transação(ões) vinculada(s)
                        </span>
                        {expandedGoalId === goal.id ? (
                          <ChevronUp className="h-3 w-3" />
                        ) : (
                          <ChevronDown className="h-3 w-3" />
                        )}
                      </Button>

                      {expandedGoalId === goal.id && (
                        <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                          {getTransactionsForGoal(goal.id).map(transaction => (
                            <div key={transaction.id} className="flex justify-between items-center text-xs p-2 bg-muted rounded">
                              <div>
                                <p className="font-medium">{transaction.description}</p>
                                <p className="text-muted-foreground">{formatDate(transaction.date)}</p>
                              </div>
                              <span className="font-bold text-green-500">
                                +{formatCurrency(transaction.amount)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Target className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhuma meta cadastrada</p>
            <Button className="mt-4" onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Criar primeira meta
            </Button>
          </CardContent>
        </Card>
      )}

      <GoalDialog
        open={isDialogOpen}
        onOpenChange={handleCloseDialog}
        goal={selectedGoal}
      />
    </div>
  );
}
