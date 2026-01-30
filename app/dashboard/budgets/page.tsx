"use client";

import { useState, useMemo } from "react";
import { useBudgets } from "@/hooks/use-budgets";
import { useViewContext } from "@/contexts/ViewContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils/format";
import { Plus, PiggyBank, Eye } from "lucide-react";
import { BudgetDialog } from "@/components/budgets/budget-dialog";
import { Budget } from "@/lib/types";

type BudgetGroup = {
  year: number;
  month: number;
  budgets: Budget[];
};

export default function BudgetsPage() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedMonth, setSelectedMonth] = useState<string>("all");

  const { canEdit, canAddOwn, isViewingOwn, isViewingAll, viewContext, getQueryParams } = useViewContext();
  const queryParams = getQueryParams();

  const { data: budgets, isLoading } = useBudgets(queryParams);

  const months = [
    { value: 1, label: "Janeiro" },
    { value: 2, label: "Fevereiro" },
    { value: 3, label: "Março" },
    { value: 4, label: "Abril" },
    { value: 5, label: "Maio" },
    { value: 6, label: "Junho" },
    { value: 7, label: "Julho" },
    { value: 8, label: "Agosto" },
    { value: 9, label: "Setembro" },
    { value: 10, label: "Outubro" },
    { value: 11, label: "Novembro" },
    { value: 12, label: "Dezembro" },
  ];

  const getMonthName = (month: number) => {
    return months.find(m => m.value === month)?.label || "";
  };

  const getViewContextLabel = () => {
    if (isViewingOwn) return null;
    if (viewContext.memberUserName) return `Visualizando: ${viewContext.memberUserName}`;
    return "Visualizando: Todos os membros";
  };

  // Agrupar orçamentos por mês/ano e ordenar
  const groupedBudgets = useMemo(() => {
    if (!budgets) return [];

    // Filtrar por ano e mês se selecionado
    let filtered = budgets;
    if (selectedYear !== "all") {
      filtered = filtered.filter(b => b.year === Number(selectedYear));
    }
    if (selectedMonth !== "all") {
      filtered = filtered.filter(b => b.month === Number(selectedMonth));
    }

    // Agrupar por ano e mês
    const groups = filtered.reduce((acc, budget) => {
      const key = `${budget.year}-${budget.month}`;
      if (!acc[key]) {
        acc[key] = {
          year: budget.year,
          month: budget.month,
          budgets: [],
        };
      }
      acc[key].budgets.push(budget);
      return acc;
    }, {} as Record<string, BudgetGroup>);

    // Converter para array e ordenar por data (mais recente primeiro)
    return Object.values(groups).sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });
  }, [budgets, selectedYear, selectedMonth]);

  // Separar orçamentos ativos e finalizados
  const { activeBudgets, finishedBudgets } = useMemo(() => {
    const active: BudgetGroup[] = [];
    const finished: BudgetGroup[] = [];

    groupedBudgets.forEach(group => {
      // Orçamento é ativo se for do mês atual ou futuro
      if (group.year > currentYear || (group.year === currentYear && group.month >= currentMonth)) {
        active.push(group);
      } else {
        finished.push(group);
      }
    });

    return { activeBudgets: active, finishedBudgets: finished };
  }, [groupedBudgets, currentYear, currentMonth]);

  // Obter anos disponíveis
  const availableYears = useMemo(() => {
    if (!budgets) return [];
    const years = [...new Set(budgets.map(b => b.year))];
    return years.sort((a, b) => b - a);
  }, [budgets]);

  const renderBudgetCard = (budget: Budget) => {
    const percentage = (budget.spentAmount / budget.limitAmount) * 100;
    const isOverBudget = percentage > 100;

    return (
      <Card key={budget.id}>
        <CardHeader>
          <CardTitle className="text-lg">
            {isViewingAll && budget.userName
              ? `${budget.categoryName} (${budget.userName})`
              : budget.categoryName}
          </CardTitle>
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
  };

  const renderBudgetGroup = (group: BudgetGroup) => (
    <div key={`${group.year}-${group.month}`} className="space-y-4">
      <h2 className="text-xl font-semibold">
        {getMonthName(group.month)} de {group.year}
      </h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {group.budgets.map(renderBudgetCard)}
      </div>
    </div>
  );

  const renderEmptyState = (message: string) => (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <PiggyBank className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">{message}</p>
        {canAddOwn && (
          <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Criar primeiro orçamento
          </Button>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orçamentos</h1>
          <p className="text-muted-foreground">
            Acompanhe seus gastos mensais por categoria
          </p>
        </div>
        {canAddOwn && (
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Orçamento
          </Button>
        )}
      </div>

      {!isViewingOwn && (
        <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 rounded-lg p-3">
          <Eye className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <span className="text-sm text-indigo-700 dark:text-indigo-300">
            {getViewContextLabel()}{!isViewingAll && " - Somente visualização"}
          </span>
        </div>
      )}

      {/* Filtros */}
      <div className="flex gap-4">
        <div className="w-40">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger>
              <SelectValue placeholder="Ano" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os anos</SelectItem>
              {availableYears.map(year => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-40">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger>
              <SelectValue placeholder="Mês" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os meses</SelectItem>
              {months.map(month => (
                <SelectItem key={month.value} value={month.value.toString()}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Abas */}
      <Tabs defaultValue="active" className="space-y-6">
        <TabsList>
          <TabsTrigger value="active">
            Ativos ({activeBudgets.length})
          </TabsTrigger>
          <TabsTrigger value="finished">
            Finalizados ({finishedBudgets.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6">
          {activeBudgets.length > 0 ? (
            activeBudgets.map(renderBudgetGroup)
          ) : (
            renderEmptyState("Nenhum orçamento ativo encontrado")
          )}
        </TabsContent>

        <TabsContent value="finished" className="space-y-6">
          {finishedBudgets.length > 0 ? (
            finishedBudgets.map(renderBudgetGroup)
          ) : (
            renderEmptyState("Nenhum orçamento finalizado encontrado")
          )}
        </TabsContent>
      </Tabs>

      {canAddOwn && (
        <BudgetDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          defaultMonth={currentMonth}
          defaultYear={currentYear}
        />
      )}
    </div>
  );
}
