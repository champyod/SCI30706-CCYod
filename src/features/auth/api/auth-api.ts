import { apiClient } from "@/lib/api-client";
import { API_ROUTES } from "@/lib/constants";
import type { AuthResponse, LoginRequest, RegisterRequest } from "../types";

export const authApi = {
  login: (data: LoginRequest) =>
    apiClient.post<AuthResponse>(
      API_ROUTES.AUTH.LOGIN,
      data as unknown as Record<string, unknown>,
    ),

  register: (data: RegisterRequest) =>
    apiClient.post<AuthResponse>(
      API_ROUTES.AUTH.REGISTER,
      data as unknown as Record<string, unknown>,
    ),

  logout: () => apiClient.post<void>(API_ROUTES.AUTH.LOGOUT),

  me: () => apiClient.get<AuthResponse["user"]>(API_ROUTES.AUTH.ME),
};
