"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateGoal, useUpdateGoal } from "@/hooks/use-goals";
import { Goal } from "@/lib/types";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

const goalSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  description: z.string().optional(),
  targetAmount: z.number().positive("Valor deve ser maior que zero"),
  currentAmount: z.number().min(0, "Valor atual não pode ser negativo").optional(),
  startDate: z.string().min(1, "Selecione a data de início"),
  targetDate: z.string().optional(),
  color: z.string().optional(),
});

type GoalFormData = z.infer<typeof goalSchema>;

interface GoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal?: Goal | null;
}

export function GoalDialog({ open, onOpenChange, goal }: GoalDialogProps) {
  const createMutation = useCreateGoal();
  const updateMutation = useUpdateGoal();
  const isEditing = !!goal;

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      startDate: format(new Date(), "yyyy-MM-dd"),
      currentAmount: 0,
      color: "#6366f1",
    },
  });

  useEffect(() => {
    if (goal) {
      setValue("name", goal.name);
      setValue("description", goal.description || "");
      setValue("targetAmount", goal.targetAmount);
      setValue("currentAmount", goal.currentAmount);
      setValue("startDate", format(new Date(goal.startDate), "yyyy-MM-dd"));
      if (goal.targetDate) {
        setValue("targetDate", format(new Date(goal.targetDate), "yyyy-MM-dd"));
      }
      setValue("color", goal.color || "#6366f1");
    } else {
      reset({
        startDate: format(new Date(), "yyyy-MM-dd"),
        currentAmount: 0,
        color: "#6366f1",
      });
    }
  }, [goal, setValue, reset]);

  const onSubmit = async (data: GoalFormData) => {
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id: goal.id, data });
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
          <DialogTitle>{isEditing ? "Editar Meta" : "Nova Meta"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Atualize os dados da meta" : "Defina uma nova meta financeira"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Meta</Label>
            <Input
              id="name"
              placeholder="Ex: Comprar um carro, Viagem para Europa"
              {...register("name")}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Input
              id="description"
              placeholder="Detalhes sobre a meta"
              {...register("description")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="targetAmount">Valor da Meta</Label>
              <Input
                id="targetAmount"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register("targetAmount", { valueAsNumber: true })}
              />
              {errors.targetAmount && <p className="text-sm text-red-500">{errors.targetAmount.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentAmount">Valor Atual</Label>
              <Input
                id="currentAmount"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register("currentAmount", { valueAsNumber: true })}
              />
              {errors.currentAmount && <p className="text-sm text-red-500">{errors.currentAmount.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Data de Início</Label>
              <Input id="startDate" type="date" {...register("startDate")} />
              {errors.startDate && <p className="text-sm text-red-500">{errors.startDate.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetDate">Data Alvo (opcional)</Label>
              <Input id="targetDate" type="date" {...register("targetDate")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Cor (opcional)</Label>
            <div className="flex gap-2">
              <Input
                id="color"
                type="color"
                className="h-10 w-20"
                {...register("color")}
              />
              <Input
                type="text"
                placeholder="#6366f1"
                {...register("color")}
              />
            </div>
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
