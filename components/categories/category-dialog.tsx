"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateCategory, useUpdateCategory } from "@/hooks/use-categories";
import { Category, CategoryType } from "@/lib/types";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const categorySchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  type: z.nativeEnum(CategoryType),
  color: z.string().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category | null;
  defaultType?: CategoryType;
}

export function CategoryDialog({ open, onOpenChange, category, defaultType }: CategoryDialogProps) {
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const isEditing = !!category;

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      type: defaultType || CategoryType.Expense,
      color: "#6366f1",
    },
  });

  useEffect(() => {
    if (category) {
      setValue("name", category.name);
      setValue("type", category.type);
      setValue("color", category.color || "#6366f1");
    } else {
      reset({ type: defaultType || CategoryType.Expense, color: "#6366f1" });
    }
  }, [category, defaultType, setValue, reset]);

  const onSubmit = async (data: CategoryFormData) => {
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id: category.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onOpenChange(false);
      reset();
    } catch (error) {}
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Categoria" : "Nova Categoria"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Atualize os dados da categoria" : "Crie uma nova categoria"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" placeholder="Ex: Alimentação, Salário" {...register("name")} />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tipo</Label>
            <Select value={watch("type")?.toString()} onValueChange={(value) => setValue("type", Number(value) as CategoryType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={CategoryType.Income.toString()}>Receita</SelectItem>
                <SelectItem value={CategoryType.Expense.toString()}>Despesa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Cor</Label>
            <div className="flex gap-2">
              <Input
                id="color"
                type="color"
                className="h-10 w-20 cursor-pointer"
                value={watch("color") || "#6366f1"}
                onChange={(e) => setValue("color", e.target.value)}
              />
              <Input
                type="text"
                placeholder="#6366f1"
                value={watch("color") || ""}
                onChange={(e) => setValue("color", e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
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
