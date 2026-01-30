import api from "@/lib/api";
import {
  UserGroup,
  GroupMember,
  CreateUserGroupDto,
  UpdateUserGroupDto,
  JoinGroupDto,
  ShareGoalDto,
  UnshareGoalDto,
  GoalUser,
} from "@/lib/types";

export const userGroupService = {
  // Group CRUD
  getAll: async (): Promise<UserGroup[]> => {
    const response = await api.get<UserGroup[]>("/usergroup");
    return response.data;
  },

  getById: async (id: string): Promise<UserGroup> => {
    const response = await api.get<UserGroup>(`/usergroup/${id}`);
    return response.data;
  },

  create: async (data: CreateUserGroupDto): Promise<UserGroup> => {
    const response = await api.post<UserGroup>("/usergroup", data);
    return response.data;
  },

  update: async (id: string, data: UpdateUserGroupDto): Promise<UserGroup> => {
    const response = await api.put<UserGroup>(`/usergroup/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/usergroup/${id}`);
  },

  // Group membership
  join: async (data: JoinGroupDto): Promise<UserGroup> => {
    const response = await api.post<UserGroup>("/usergroup/join", data);
    return response.data;
  },

  leave: async (groupId: string): Promise<void> => {
    await api.post(`/usergroup/${groupId}/leave`);
  },

  removeMember: async (groupId: string, memberUserId: string): Promise<void> => {
    await api.delete(`/usergroup/${groupId}/members/${memberUserId}`);
  },

  regenerateInviteCode: async (groupId: string): Promise<string> => {
    const response = await api.post<{ inviteCode: string }>(`/usergroup/${groupId}/regenerate-invite`);
    return response.data.inviteCode;
  },

  getMembers: async (groupId: string): Promise<GroupMember[]> => {
    const response = await api.get<GroupMember[]>(`/usergroup/${groupId}/members`);
    return response.data;
  },

  // Goal sharing
  shareGoal: async (data: ShareGoalDto): Promise<void> => {
    await api.post("/usergroup/share-goal", data);
  },

  unshareGoal: async (data: UnshareGoalDto): Promise<void> => {
    await api.post("/usergroup/unshare-goal", data);
  },

  getGoalUsers: async (goalId: string): Promise<GoalUser[]> => {
    const response = await api.get<GoalUser[]>(`/usergroup/goal/${goalId}/users`);
    return response.data;
  },
};
