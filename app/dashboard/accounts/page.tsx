"use client";

import { useState } from "react";
import { useAccounts, useDeleteAccount, useUpdateAccount } from "@/hooks/use-accounts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils/format";
import { Account, AccountType, AccountTypeLabels } from "@/lib/types";
import { Plus, CreditCard, Eye, EyeOff, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { AccountDialog } from "@/components/accounts/account-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

export default function AccountsPage() {
  const { data: accounts, isLoading } = useAccounts();
  const deleteAccountMutation = useDeleteAccount();
  const updateAccountMutation = useUpdateAccount();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [accountToDelete, setAccountToDelete] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");

  const filteredAccounts = accounts?.filter((account) => {
    if (filter === "active") return account.isActive;
    if (filter === "inactive") return !account.isActive;
    return true;
  });

  const handleEdit = (account: Account) => {
    setEditingAccount(account);
    setIsDialogOpen(true);
  };

  const handleDelete = async () => {
    if (accountToDelete) {
      await deleteAccountMutation.mutateAsync(accountToDelete);
      setAccountToDelete(null);
    }
  };

  const handleToggleActive = async (account: Account) => {
    await updateAccountMutation.mutateAsync({
      id: account.id,
      data: { isActive: !account.isActive },
    });
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingAccount(null);
  };

  const getAccountIcon = (type: AccountType) => {
    return <CreditCard className="h-6 w-6" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contas</h1>
          <p className="text-muted-foreground">
            Gerencie suas contas bancárias e carteiras
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Conta
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
        >
          Todas
        </Button>
        <Button
          variant={filter === "active" ? "default" : "outline"}
          onClick={() => setFilter("active")}
        >
          Ativas
        </Button>
        <Button
          variant={filter === "inactive" ? "default" : "outline"}
          onClick={() => setFilter("inactive")}
        >
          Inativas
        </Button>
      </div>

      {/* Lista de Contas */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      ) : filteredAccounts && filteredAccounts.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredAccounts.map((account) => (
            <Card key={account.id} className={!account.isActive ? "opacity-60" : ""}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="flex items-center gap-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{
                      backgroundColor: account.color || "#6366f1",
                      opacity: 0.1,
                    }}
                  >
                    {getAccountIcon(account.type)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{account.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {AccountTypeLabels[account.type]}
                    </p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(account)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleToggleActive(account)}>
                      {account.isActive ? (
                        <>
                          <EyeOff className="mr-2 h-4 w-4" />
                          Desativar
                        </>
                      ) : (
                        <>
                          <Eye className="mr-2 h-4 w-4" />
                          Ativar
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setAccountToDelete(account.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Deletar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Saldo Atual</span>
                    {!account.isActive && (
                      <Badge variant="secondary">Inativa</Badge>
                    )}
                  </div>
                  <p className="text-2xl font-bold">
                    {formatCurrency(account.currentBalance)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Saldo inicial: {formatCurrency(account.initialBalance)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhuma conta encontrada</p>
            <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Criar primeira conta
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Dialog de Criação/Edição */}
      <AccountDialog
        open={isDialogOpen}
        onOpenChange={handleCloseDialog}
        account={editingAccount}
      />

      {/* Dialog de Confirmação de Deleção */}
      <AlertDialog open={!!accountToDelete} onOpenChange={() => setAccountToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso irá deletar permanentemente a conta
              e todas as transações associadas.
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
