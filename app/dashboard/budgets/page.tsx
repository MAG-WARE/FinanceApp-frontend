"use client";

import { useState } from "react";
import { useBudgetsByMonth } from "@/hooks/use-budgets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils/format";
import { Plus, PiggyBank } from "lucide-react";
import { BudgetDialog } from "@/components/budgets/budget-dialog";

export default function BudgetsPage() {
  const currentDate = new Date();
  const [year, setYear] = useState(currentDate.getFullYear());
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: budgets, isLoading } = useBudgetsByMonth(year, month);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orçamentos</h1>
          <p className="text-muted-foreground">
            Acompanhe seus gastos mensais por categoria
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Orçamento
        </Button>
      </div>

      {budgets && budgets.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {budgets.map((budget) => {
            const percentage = (budget.spentAmount / budget.limitAmount) * 100;
            const isOverBudget = percentage > 100;

            return (
              <Card key={budget.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{budget.categoryName}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Gasto</span>
                    <span className={`font-bold ${isOverBudget ? "text-red-500" : "text-green-500"}`}>
                      {formatCurrency(budget.spentAmount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Limite</span>
                    <span className="font-bold">{formatCurrency(budget.limitAmount)}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${isOverBudget ? "bg-red-500" : "bg-green-500"}`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-center text-muted-foreground">
                      {percentage.toFixed(0)}% utilizado
                      {isOverBudget && " - Orçamento ultrapassado!"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <PiggyBank className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhum orçamento configurado para este mês</p>
            <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Criar primeiro orçamento
            </Button>
          </CardContent>
        </Card>
      )}

      <BudgetDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        defaultMonth={month}
        defaultYear={year}
      />
    </div>
  );
}
