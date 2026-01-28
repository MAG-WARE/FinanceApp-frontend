"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { accountSchema, AccountFormData } from "@/lib/validations/account";
import { useCreateAccount, useUpdateAccount } from "@/hooks/use-accounts";
import { Account, AccountType, AccountTypeLabels } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface AccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account?: Account | null;
}

export function AccountDialog({ open, onOpenChange, account }: AccountDialogProps) {
  const createAccountMutation = useCreateAccount();
  const updateAccountMutation = useUpdateAccount();
  const isEditing = !!account;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      type: AccountType.CheckingAccount,
      initialBalance: 0,
      isActive: true,
      color: "#6366f1",
    },
  });

  useEffect(() => {
    if (account) {
      setValue("name", account.name);
      setValue("type", account.type);
      setValue("initialBalance", account.initialBalance);
      setValue("isActive", account.isActive);
      setValue("color", account.color || "#6366f1");
    } else {
      reset({
        name: "",
        type: AccountType.CheckingAccount,
        initialBalance: 0,
        isActive: true,
        color: "#6366f1",
      });
    }
  }, [account, setValue, reset]);

  const onSubmit = async (data: AccountFormData) => {
    try {
      if (isEditing) {
        await updateAccountMutation.mutateAsync({
          id: account.id,
          data,
        });
      } else {
        await createAccountMutation.mutateAsync(data);
      }
      onOpenChange(false);
      reset();
    } catch (error) {
      // Error already handled in the mutation
    }
  };

  const accountType = watch("type");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Conta" : "Nova Conta"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize as informações da conta"
              : "Preencha os dados para criar uma nova conta"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Conta</Label>
            <Input
              id="name"
              placeholder="Ex: Nubank, Banco do Brasil"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tipo de Conta</Label>
            <Select
              value={accountType?.toString()}
              onValueChange={(value) => setValue("type", Number(value) as AccountType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(AccountTypeLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-red-500">{errors.type.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="initialBalance">Saldo Inicial</Label>
            <Input
              id="initialBalance"
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register("initialBalance", { valueAsNumber: true })}
            />
            {errors.initialBalance && (
              <p className="text-sm text-red-500">{errors.initialBalance.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Cor (opcional)</Label>
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

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                reset();
              }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={createAccountMutation.isPending || updateAccountMutation.isPending}
            >
              {(createAccountMutation.isPending || updateAccountMutation.isPending) ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
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
