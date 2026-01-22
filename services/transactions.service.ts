import api from "@/lib/api";
import {
  Transaction,
  CreateTransactionDto,
  UpdateTransactionDto,
  TransactionFilters,
} from "@/lib/types";

export const transactionsService = {
  getAll: async (filters?: TransactionFilters): Promise<Transaction[]> => {
    const response = await api.get<Transaction[]>("/transactions", {
      params: filters,
    });
    return response.data;
  },

  getById: async (id: string): Promise<Transaction> => {
    const response = await api.get<Transaction>(`/transactions/${id}`);
    return response.data;
  },

  create: async (data: CreateTransactionDto): Promise<Transaction> => {
    const response = await api.post<Transaction>("/transactions", data);
    return response.data;
  },

  update: async (
    id: string,
    data: UpdateTransactionDto
  ): Promise<Transaction> => {
    const response = await api.put<Transaction>(`/transactions/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/transactions/${id}`);
  },
};
