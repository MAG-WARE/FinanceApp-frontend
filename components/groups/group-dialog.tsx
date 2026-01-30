"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateGroup, useUpdateGroup } from "@/hooks/use-user-groups";
import { UserGroup } from "@/lib/types";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

const groupSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  description: z.string().optional(),
});

type GroupFormData = z.infer<typeof groupSchema>;

interface GroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group?: UserGroup | null;
}

export function GroupDialog({ open, onOpenChange, group }: GroupDialogProps) {
  const createMutation = useCreateGroup();
  const updateMutation = useUpdateGroup();
  const isEditing = !!group;

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<GroupFormData>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (group) {
      setValue("name", group.name);
      setValue("description", group.description || "");
    } else {
      reset({
        name: "",
        description: "",
      });
    }
  }, [group, setValue, reset]);

  const onSubmit = async (data: GroupFormData) => {
    try {
      const payload = {
        ...data,
        description: data.description && data.description.trim() !== "" ? data.description : undefined,
      };

      if (isEditing) {
        await updateMutation.mutateAsync({ id: group.id, data: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      onOpenChange(false);
      reset();
    } catch (error) {
      // Error handled in mutation
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Grupo" : "Novo Grupo"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize as informações do grupo"
              : "Crie um grupo para compartilhar metas com outras pessoas"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Grupo</Label>
            <Input
              id="name"
              placeholder="Ex: Família, Casal, Amigos"
              {...register("name")}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Input
              id="description"
              placeholder="Uma breve descrição do grupo"
              {...register("description")}
            />
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
