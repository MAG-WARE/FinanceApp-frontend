import { z } from "zod";
import { TransactionType } from "@/lib/types";

export const transactionSchema = z.object({
  accountId: z.string().min(1, "Selecione uma conta"),
  categoryId: z.string().min(1, "Selecione uma categoria"),
  amount: z.number().positive("Valor deve ser maior que zero"),
  date: z.string().min(1, "Selecione uma data"),
  description: z.string().min(3, "Descrição deve ter no mínimo 3 caracteres"),
  type: z.nativeEnum(TransactionType),
  notes: z.string().optional(),
  isRecurring: z.boolean().default(false),
  destinationAccountId: z.string().optional(),
  goalId: z.string().optional().nullable(),
}).refine((data) => {
  // Para transferências, a conta de destino é obrigatória
  if (data.type === TransactionType.Transfer && !data.destinationAccountId) {
    return false;
  }
  return true;
}, {
  message: "Conta de destino é obrigatória para transferências",
  path: ["destinationAccountId"],
}).refine((data) => {
  // Para transferências, a conta de destino deve ser diferente da conta de origem
  if (data.type === TransactionType.Transfer && data.destinationAccountId === data.accountId) {
    return false;
  }
  return true;
}, {
  message: "A conta de destino deve ser diferente da conta de origem",
  path: ["destinationAccountId"],
});

export type TransactionFormData = z.infer<typeof transactionSchema>;
