import { z } from "zod";
import { AccountType } from "@/lib/types";

export const accountSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  type: z.nativeEnum(AccountType, {
    errorMap: () => ({ message: "Selecione um tipo de conta" }),
  }),
  initialBalance: z.number().min(0, "Saldo inicial não pode ser negativo"),
  isActive: z.boolean().optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
});

export type AccountFormData = z.infer<typeof accountSchema>;
