"use client";

import { useState, useCallback } from "react";
import type { User, LoginRequest, RegisterRequest } from "../types";

interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user] = useState<User | null>(null);
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);

  const login = useCallback(async (_data: LoginRequest) => {
    // TODO: Implement with authApi.login
    console.log("login called");
  }, []);

  const register = useCallback(async (_data: RegisterRequest) => {
    // TODO: Implement with authApi.register
    console.log("register called");
  }, []);

  const logout = useCallback(async () => {
    // TODO: Implement with authApi.logout
    console.log("logout called");
  }, []);

  return { user, isLoading, error, login, register, logout };
}
