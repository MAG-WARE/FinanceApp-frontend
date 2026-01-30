"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useJoinGroup } from "@/hooks/use-user-groups";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

const joinGroupSchema = z.object({
  inviteCode: z.string().min(1, "Informe o código de convite"),
});

type JoinGroupFormData = z.infer<typeof joinGroupSchema>;

interface JoinGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function JoinGroupDialog({ open, onOpenChange }: JoinGroupDialogProps) {
  const joinMutation = useJoinGroup();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<JoinGroupFormData>({
    resolver: zodResolver(joinGroupSchema),
    defaultValues: {
      inviteCode: "",
    },
  });

  const onSubmit = async (data: JoinGroupFormData) => {
    try {
      await joinMutation.mutateAsync(data);
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
          <DialogTitle>Entrar em um Grupo</DialogTitle>
          <DialogDescription>
            Insira o código de convite que você recebeu para entrar no grupo
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="inviteCode">Código de Convite</Label>
            <Input
              id="inviteCode"
              placeholder="Ex: ABC123XYZ"
              {...register("inviteCode")}
            />
            {errors.inviteCode && <p className="text-sm text-red-500">{errors.inviteCode.message}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => { onOpenChange(false); reset(); }}>
              Cancelar
            </Button>
            <Button type="submit" disabled={joinMutation.isPending}>
              {joinMutation.isPending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Entrando...</>
              ) : (
                <>Entrar no Grupo</>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
