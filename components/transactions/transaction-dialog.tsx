"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { transactionSchema, TransactionFormData } from "@/lib/validations/transaction";
import { useCreateTransaction, useUpdateTransaction } from "@/hooks/use-transactions";
import { useAccounts } from "@/hooks/use-accounts";
import { useCategories } from "@/hooks/use-categories";
import { useGoalsForTransaction } from "@/hooks/use-goals";
import { Transaction, TransactionType, TransactionTypeLabels, CategoryType, GoalForTransactionDto } from "@/lib/types";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Target, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils/format";

interface TransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: Transaction | null;
}

export function TransactionDialog({ open, onOpenChange, transaction }: TransactionDialogProps) {
  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();
  const { data: accounts } = useAccounts();
  const { data: categories } = useCategories();
  const { data: goalsForTransaction } = useGoalsForTransaction();
  const isEditing = !!transaction;

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: TransactionType.Expense,
      date: format(new Date(), "yyyy-MM-dd"),
      isRecurring: false,
    },
  });

  const transactionType = watch("type");
  const selectedAccountId = watch("accountId");
  const selectedGoalId = watch("goalId");
  const amount = watch("amount");

  // Determine category type based on transaction type
  const selectedCategoryType = useMemo(() => {
    if (transactionType === TransactionType.Income || transactionType === TransactionType.GoalWithdraw) {
      return CategoryType.Income;
    }
    return CategoryType.Expense;
  }, [transactionType]);

  const filteredCategories = categories?.filter(c => c.type === selectedCategoryType);
  const isTransfer = transactionType === TransactionType.Transfer;
  const isGoalTransaction = transactionType === TransactionType.GoalDeposit || transactionType === TransactionType.GoalWithdraw;
  const isGoalDeposit = transactionType === TransactionType.GoalDeposit;
  const isGoalWithdraw = transactionType === TransactionType.GoalWithdraw;

  // Get selected goal for balance validation
  const selectedGoal = useMemo(() => {
    if (!selectedGoalId || !goalsForTransaction) return null;
    return goalsForTransaction.find(g => g.id === selectedGoalId);
  }, [selectedGoalId, goalsForTransaction]);

  // Check if withdrawal amount exceeds goal balance
  const isWithdrawExceedsBalance = isGoalWithdraw && selectedGoal && amount > selectedGoal.currentAmount;

  useEffect(() => {
    if (transaction) {
      setValue("accountId", transaction.accountId);
      setValue("categoryId", transaction.categoryId);
      setValue("amount", transaction.amount);
      setValue("date", format(new Date(transaction.date), "yyyy-MM-dd"));
      setValue("description", transaction.description);
      setValue("type", transaction.type);
      setValue("notes", transaction.notes || "");
      setValue("isRecurring", transaction.isRecurring);
      if (transaction.destinationAccountId) {
        setValue("destinationAccountId", transaction.destinationAccountId);
      }
      if (transaction.goalId) {
        setValue("goalId", transaction.goalId);
      }
    } else {
      reset({
        type: TransactionType.Expense,
        date: format(new Date(), "yyyy-MM-dd"),
        isRecurring: false,
      });
    }
  }, [transaction, setValue, reset]);

  // Reset goalId when changing from goal transaction type to another type
  useEffect(() => {
    if (!isGoalTransaction) {
      setValue("goalId", undefined);
    }
    if (!isTransfer) {
      setValue("destinationAccountId", undefined);
    }
  }, [transactionType, isGoalTransaction, isTransfer, setValue]);

  const onSubmit = async (data: TransactionFormData) => {
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id: transaction.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onOpenChange(false);
      reset();
    } catch (error) {
      // Error handled in mutation
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Transação" : "Nova Transação"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Atualize os dados da transação" : "Preencha os dados da nova transação"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select
                value={transactionType?.toString()}
                onValueChange={(value) => setValue("type", Number(value) as TransactionType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TransactionTypeLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && <p className="text-sm text-red-500">{errors.type.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Valor</Label>
              <Input id="amount" type="number" step="0.01" {...register("amount", { valueAsNumber: true })} />
              {errors.amount && <p className="text-sm text-red-500">{errors.amount.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input id="description" placeholder="Ex: Salário, Compras, etc" {...register("description")} />
            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="accountId">
                {isTransfer ? "Conta de Origem" : isGoalDeposit ? "Conta de Origem" : isGoalWithdraw ? "Conta de Destino" : "Conta"}
              </Label>
              <Select
                value={watch("accountId")}
                onValueChange={(value) => setValue("accountId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {accounts?.filter(a => a.isActive).map(account => (
                    <SelectItem key={account.id} value={account.id}>{account.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.accountId && <p className="text-sm text-red-500">{errors.accountId.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoryId">Categoria</Label>
              <Select
                value={watch("categoryId")}
                onValueChange={(value) => setValue("categoryId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {filteredCategories?.map(category => (
                    <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && <p className="text-sm text-red-500">{errors.categoryId.message}</p>}
            </div>
          </div>

          {isTransfer && (
            <div className="space-y-2">
              <Label htmlFor="destinationAccountId">Conta de Destino</Label>
              <Select
                value={watch("destinationAccountId")}
                onValueChange={(value) => setValue("destinationAccountId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a conta de destino" />
                </SelectTrigger>
                <SelectContent>
                  {accounts
                    ?.filter(a => a.isActive && a.id !== selectedAccountId)
                    .map(account => (
                      <SelectItem key={account.id} value={account.id}>{account.name}</SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
              {errors.destinationAccountId && <p className="text-sm text-red-500">{errors.destinationAccountId.message}</p>}
            </div>
          )}

          {isGoalTransaction && (
            <div className="space-y-2">
              <Label htmlFor="goalId" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                {isGoalDeposit ? "Meta de Destino" : "Meta de Origem"}
              </Label>
              <Select
                value={watch("goalId")}
                onValueChange={(value) => setValue("goalId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma meta" />
                </SelectTrigger>
                <SelectContent>
                  {goalsForTransaction?.map(goal => (
                    <SelectItem key={goal.id} value={goal.id}>
                      <div className="flex flex-col">
                        <span>{goal.name} {!goal.isOwner && "(Compartilhada)"}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.goalId && <p className="text-sm text-red-500">{errors.goalId.message}</p>}

              {selectedGoal && (
                <div className="text-sm text-muted-foreground bg-muted p-2 rounded">
                  <p>Saldo da meta: <span className="font-medium">{formatCurrency(selectedGoal.currentAmount)}</span></p>
                  <p>Objetivo: <span className="font-medium">{formatCurrency(selectedGoal.targetAmount)}</span></p>
                </div>
              )}

              {isWithdrawExceedsBalance && (
                <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 p-2 rounded border border-amber-200 dark:border-amber-800">
                  <AlertCircle className="h-4 w-4" />
                  <span>O valor solicitado excede o saldo da meta ({formatCurrency(selectedGoal?.currentAmount || 0)})</span>
                </div>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="date">Data</Label>
            <Input id="date" type="date" {...register("date")} />
            {errors.date && <p className="text-sm text-red-500">{errors.date.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações (opcional)</Label>
            <Input id="notes" placeholder="Notas adicionais" {...register("notes")} />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => { onOpenChange(false); reset(); }}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
              {(createMutation.isPending || updateMutation.isPending) ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Salvando...</>
              ) : (
                <>{isEditing ? "Atualizar" : "Criar"}</>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
