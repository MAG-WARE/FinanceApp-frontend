"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateBudget, useUpdateBudget } from "@/hooks/use-budgets";
import { useCategories } from "@/hooks/use-categories";
import { Budget, CategoryType } from "@/lib/types";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const budgetSchema = z.object({
  categoryId: z.string().min(1, "Selecione uma categoria"),
  month: z.number().min(1).max(12),
  year: z.number().min(2000),
  limitAmount: z.number().positive("Valor deve ser maior que zero"),
});

type BudgetFormData = z.infer<typeof budgetSchema>;

interface BudgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  budget?: Budget | null;
  defaultMonth?: number;
  defaultYear?: number;
}

export function BudgetDialog({ open, onOpenChange, budget, defaultMonth, defaultYear }: BudgetDialogProps) {
  const createMutation = useCreateBudget();
  const updateMutation = useUpdateBudget();
  const { data: categories } = useCategories();
  const isEditing = !!budget;

  const currentDate = new Date();
  const expenseCategories = categories?.filter(c => c.type === CategoryType.Expense);

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      month: defaultMonth || currentDate.getMonth() + 1,
      year: defaultYear || currentDate.getFullYear(),
    },
  });

  useEffect(() => {
    if (budget) {
      setValue("categoryId", budget.categoryId);
      setValue("month", budget.month);
      setValue("year", budget.year);
      setValue("limitAmount", budget.limitAmount);
    } else {
      reset({
        month: defaultMonth || currentDate.getMonth() + 1,
        year: defaultYear || currentDate.getFullYear(),
      });
    }
  }, [budget, defaultMonth, defaultYear, setValue, reset, currentDate]);

  const onSubmit = async (data: BudgetFormData) => {
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id: budget.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onOpenChange(false);
      reset();
    } catch (error) {
      // Error handled in mutation
    }
  };

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Orçamento" : "Novo Orçamento"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Atualize os dados do orçamento" : "Defina um limite de gastos para uma categoria"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="categoryId">Categoria</Label>
            <Select
              value={watch("categoryId")}
              onValueChange={(value) => setValue("categoryId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {expenseCategories?.map(category => (
                  <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoryId && <p className="text-sm text-red-500">{errors.categoryId.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="month">Mês</Label>
              <Select
                value={watch("month")?.toString()}
                onValueChange={(value) => setValue("month", Number(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map(month => (
                    <SelectItem key={month.value} value={month.value.toString()}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.month && <p className="text-sm text-red-500">{errors.month.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Ano</Label>
              <Input
                id="year"
                type="number"
                {...register("year", { valueAsNumber: true })}
              />
              {errors.year && <p className="text-sm text-red-500">{errors.year.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="limitAmount">Limite de Gastos</Label>
            <Input
              id="limitAmount"
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register("limitAmount", { valueAsNumber: true })}
            />
            {errors.limitAmount && <p className="text-sm text-red-500">{errors.limitAmount.message}</p>}
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
