"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDashboardSummary } from "@/hooks/use-dashboard";
import { useTransactions } from "@/hooks/use-transactions";
import { useBudgetsByMonth } from "@/hooks/use-budgets";
import { useViewContext } from "@/contexts/ViewContext";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { TransactionType, TransactionTypeLabels } from "@/lib/types";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  Wallet,
  Loader2,
  Eye,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { getQueryParams, isViewingOwn, viewContext } = useViewContext();
  const queryParams = getQueryParams();

  const { data: summary, isLoading: summaryLoading } = useDashboardSummary(queryParams);
  const { data: transactions, isLoading: transactionsLoading } =
    useTransactions(queryParams);

  const currentDate = new Date();
  const { data: budgets, isLoading: budgetsLoading } = useBudgetsByMonth(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    queryParams
  );

  const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];

  const getTransactionBadgeColor = (type: TransactionType) => {
    switch (type) {
      case TransactionType.Income:
        return "bg-green-500 hover:bg-green-600";
      case TransactionType.Expense:
        return "bg-red-500 hover:bg-red-600";
      case TransactionType.Transfer:
        return "bg-blue-500 hover:bg-blue-600";
      default:
        return "bg-gray-500";
    }
  };

  // Preparar dados do gráfico de evolução de saldo
  const balanceEvolutionData =
    summary?.balanceHistory?.map((item) => ({
      date: `${item.month}/${item.year}`,
      balance: item.balance,
    })) || [];

  // Preparar dados do gráfico de categorias
  const categorySpendingData = summary?.topSpendingCategories || [];

  const getViewContextLabel = () => {
    if (isViewingOwn) return null;
    if (viewContext.memberUserName) return `Visualizando: ${viewContext.memberUserName}`;
    return "Visualizando: Todos os membros";
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral das suas finanças
        </p>
      </div>

      {!isViewingOwn && (
        <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 rounded-lg p-3">
          <Eye className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <span className="text-sm text-indigo-700 dark:text-indigo-300">
            {getViewContextLabel()}
          </span>
        </div>
      )}

      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Receitas</CardTitle>
            <ArrowUpIcon className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            {summaryLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <div className="text-2xl font-bold text-green-500">
                {formatCurrency(summary?.totalIncome || 0)}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Despesas</CardTitle>
            <ArrowDownIcon className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            {summaryLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <div className="text-2xl font-bold text-red-500">
                {formatCurrency(summary?.totalExpenses || 0)}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo do Mês</CardTitle>
            <Wallet className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            {summaryLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <div
                className={`text-2xl font-bold ${
                  (summary?.balance || 0) >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {formatCurrency(summary?.balance || 0)}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Gastos por Categoria */}
        <Card>
          <CardHeader>
            <CardTitle>Gastos por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            {summaryLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
              </div>
            ) : categorySpendingData && categorySpendingData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categorySpendingData.slice(0, 5)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${((percent || 0) * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="amount"
                    nameKey="categoryName"
                  >
                    {categorySpendingData.slice(0, 5).map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color || COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                Nenhum dado disponível
              </div>
            )}
          </CardContent>
        </Card>

        {/* Evolução do Saldo */}
        <Card>
          <CardHeader>
            <CardTitle>Evolução do Saldo</CardTitle>
          </CardHeader>
          <CardContent>
            {summaryLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
              </div>
            ) : balanceEvolutionData && balanceEvolutionData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={balanceEvolutionData}>
                  <XAxis dataKey="date" />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                    labelFormatter={(label) => `Período: ${label}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="balance"
                    stroke="#6366f1"
                    strokeWidth={2}
                    name="Saldo"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                Nenhum dado disponível
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Últimas Transações e Orçamentos */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Últimas Transações */}
        <Card>
          <CardHeader>
            <CardTitle>Últimas Transações</CardTitle>
          </CardHeader>
          <CardContent>
            {transactionsLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : transactions && transactions.length > 0 ? (
              <div className="space-y-3">
                {transactions.slice(0, 5).map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{transaction.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getTransactionBadgeColor(transaction.type)}>
                          {TransactionTypeLabels[transaction.type]}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {transaction.categoryName}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-bold ${
                          transaction.type === TransactionType.Income
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {transaction.type === TransactionType.Income ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(transaction.date)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Nenhuma transação encontrada
              </div>
            )}
          </CardContent>
        </Card>

        {/* Orçamentos */}
        <Card>
          <CardHeader>
            <CardTitle>Orçamentos do Mês</CardTitle>
          </CardHeader>
          <CardContent>
            {budgetsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : budgets && budgets.length > 0 ? (
              <div className="space-y-4">
                {budgets.slice(0, 4).map((budget) => {
                  const percentage = (budget.spentAmount / budget.limitAmount) * 100;
                  const isOverBudget = percentage > 100;

                  return (
                    <div key={budget.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{budget.categoryName}</span>
                        <span
                          className={`text-sm font-medium ${
                            isOverBudget ? "text-red-500" : "text-muted-foreground"
                          }`}
                        >
                          {formatCurrency(budget.spentAmount)} de{" "}
                          {formatCurrency(budget.limitAmount)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            isOverBudget ? "bg-red-500" : "bg-green-500"
                          }`}
                          style={{
                            width: `${Math.min(percentage, 100)}%`,
                          }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {percentage.toFixed(0)}% utilizado
                        {isOverBudget && " - Orçamento ultrapassado!"}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum orçamento configurado
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
