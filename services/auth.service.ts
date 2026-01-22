import api from "@/lib/api";
import { AuthResponse, LoginDto, RegisterDto } from "@/lib/types";

export const authService = {
  login: async (data: LoginDto): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", data);
    return response.data;
  },

  register: async (data: RegisterDto): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/register", data);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("@financeapp:token");
    localStorage.removeItem("@financeapp:user");
  },

  getStoredToken: (): string | null => {
    return localStorage.getItem("@financeapp:token");
  },

  getStoredUser: () => {
    const user = localStorage.getItem("@financeapp:user");
    return user ? JSON.parse(user) : null;
  },

  storeAuth: (token: string, user: any) => {
    localStorage.setItem("@financeapp:token", token);
    localStorage.setItem("@financeapp:user", JSON.stringify(user));
  },
};
