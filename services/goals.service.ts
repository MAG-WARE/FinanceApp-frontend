import api from "@/lib/api";
import { Goal, CreateGoalDto, UpdateGoalDto } from "@/lib/types";

export const goalsService = {
  getAll: async (): Promise<Goal[]> => {
    const response = await api.get<Goal[]>("/goal");
    return response.data;
  },

  getById: async (id: string): Promise<Goal> => {
    const response = await api.get<Goal>(`/goal/${id}`);
    return response.data;
  },

  create: async (data: CreateGoalDto): Promise<Goal> => {
    const response = await api.post<Goal>("/goal", data);
    return response.data;
  },

  update: async (id: string, data: UpdateGoalDto): Promise<Goal> => {
    const response = await api.put<Goal>(`/goal/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/goal/${id}`);
  },
};
