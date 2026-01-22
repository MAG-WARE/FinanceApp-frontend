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
});

export type TransactionFormData = z.infer<typeof transactionSchema>;
