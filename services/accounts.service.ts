import api from "@/lib/api";
import { Account, CreateAccountDto, UpdateAccountDto } from "@/lib/types";

export const accountsService = {
  getAll: async (): Promise<Account[]> => {
    const response = await api.get<Account[]>("/account");
    return response.data;
  },

  getById: async (id: string): Promise<Account> => {
    const response = await api.get<Account>(`/account/${id}`);
    return response.data;
  },

  create: async (data: CreateAccountDto): Promise<Account> => {
    const response = await api.post<Account>("/account", data);
    return response.data;
  },

  update: async (id: string, data: UpdateAccountDto): Promise<Account> => {
    const response = await api.put<Account>(`/account/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/account/${id}`);
  },
};
