import api from "@/lib/api";
import { Goal, CreateGoalDto, UpdateGoalDto } from "@/lib/types";

export const goalsService = {
  getAll: async (): Promise<Goal[]> => {
    const response = await api.get<Goal[]>("/goals");
    return response.data;
  },

  getById: async (id: string): Promise<Goal> => {
    const response = await api.get<Goal>(`/goals/${id}`);
    return response.data;
  },

  create: async (data: CreateGoalDto): Promise<Goal> => {
    const response = await api.post<Goal>("/goals", data);
    return response.data;
  },

  update: async (id: string, data: UpdateGoalDto): Promise<Goal> => {
    const response = await api.put<Goal>(`/goals/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/goals/${id}`);
  },
};
