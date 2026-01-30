"use client";

import { useState } from "react";
import { useTransactions, useDeleteTransaction } from "@/hooks/use-transactions";
import { useViewContext } from "@/contexts/ViewContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { Transaction, TransactionType, TransactionTypeLabels } from "@/lib/types";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { TransactionDialog } from "@/components/transactions/transaction-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function TransactionsPage() {
  const { data: transactions, isLoading } = useTransactions();
  const deleteTransactionMutation = useDeleteTransaction();
  const { canEdit, isViewingOwn, viewContext } = useViewContext();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);

  const handleEdit = (transaction: Transaction) => {
    if (!canEdit) return;
    setEditingTransaction(transaction);
    setIsDialogOpen(true);
  };

  const handleDelete = async () => {
    if (transactionToDelete && canEdit) {
      await deleteTransactionMutation.mutateAsync(transactionToDelete);
      setTransactionToDelete(null);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingTransaction(null);
  };

  const getTransactionBadgeColor = (type: TransactionType) => {
    switch (type) {
      case TransactionType.Income:
        return "bg-green-500 hover:bg-green-600";
      case TransactionType.Expense:
        return "bg-red-500 hover:bg-red-600";
      case TransactionType.Transfer:
        return "bg-blue-500 hover:bg-blue-600";
    }
  };

  const getViewContextLabel = () => {
    if (isViewingOwn) return null;
    if (viewContext.memberUserName) return `Visualizando: ${viewContext.memberUserName}`;
    return "Visualizando: Todos os membros";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transações</h1>
          <p className="text-muted-foreground">
            Visualize e gerencie todas as suas transações
          </p>
        </div>
        {canEdit && (
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Transação
          </Button>
        )}
      </div>

      {!isViewingOwn && (
        <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 rounded-lg p-3">
          <Eye className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <span className="text-sm text-indigo-700 dark:text-indigo-300">
            {getViewContextLabel()} - Somente visualização
          </span>
        </div>
      )}

      <Card>
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[...Array(10)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : transactions && transactions.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Conta</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                {canEdit && <TableHead className="text-right">Ações</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{formatDate(transaction.date)}</TableCell>
                  <TableCell className="font-medium">
                    {transaction.description}
                  </TableCell>
                  <TableCell>{transaction.categoryName}</TableCell>
                  <TableCell>{transaction.accountName}</TableCell>
                  <TableCell>
                    <Badge className={getTransactionBadgeColor(transaction.type)}>
                      {TransactionTypeLabels[transaction.type]}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className={`text-right font-bold ${
                      transaction.type === TransactionType.Income
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {transaction.type === TransactionType.Income ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </TableCell>
                  {canEdit && (
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(transaction)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setTransactionToDelete(transaction.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="p-12 text-center">
            <p className="text-muted-foreground">Nenhuma transação encontrada</p>
            {canEdit && (
              <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Criar primeira transação
              </Button>
            )}
          </div>
        )}
      </Card>

      {canEdit && (
        <TransactionDialog
          open={isDialogOpen}
          onOpenChange={handleCloseDialog}
          transaction={editingTransaction}
        />
      )}

      <AlertDialog open={!!transactionToDelete} onOpenChange={() => setTransactionToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso irá deletar permanentemente a transação.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
