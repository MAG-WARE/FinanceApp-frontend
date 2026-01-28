import api from "@/lib/api";
import {
  Transaction,
  CreateTransactionDto,
  UpdateTransactionDto,
  TransactionFilters,
} from "@/lib/types";

export const transactionsService = {
  getAll: async (filters?: TransactionFilters): Promise<Transaction[]> => {
    console.log("🔍 [transactionsService] Fetching transactions with filters:", filters);
    try {
      const response = await api.get<Transaction[]>("/transaction", {
        params: filters,
      });
      console.log("✅ [transactionsService] Transactions fetched:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ [transactionsService] Error fetching transactions:", error);
      throw error;
    }
  },

  getById: async (id: string): Promise<Transaction> => {
    const response = await api.get<Transaction>(`/transaction/${id}`);
    return response.data;
  },

  create: async (data: CreateTransactionDto): Promise<Transaction> => {
    const response = await api.post<Transaction>("/transaction", data);
    return response.data;
  },

  update: async (
    id: string,
    data: UpdateTransactionDto
  ): Promise<Transaction> => {
    console.log("🔄 Updating transaction:", id, data);
    const response = await api.put<Transaction>(`/transaction/${id}`, data);
    console.log("✅ Transaction updated response:", response.data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/transaction/${id}`);
  },
};
