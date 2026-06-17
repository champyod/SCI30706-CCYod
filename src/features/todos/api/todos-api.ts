import { apiClient } from "@/lib/api-client";
import type { Todo, CreateTodoRequest, UpdateTodoRequest } from "../types";

const TODOS_PATH = "/api/todos";

export const todosApi = {
  getAll: () => apiClient.get<Todo[]>(TODOS_PATH),

  getById: (id: string) => apiClient.get<Todo>(`${TODOS_PATH}/${id}`),

  create: (data: CreateTodoRequest) =>
    apiClient.post<Todo>(
      TODOS_PATH,
      data as unknown as Record<string, unknown>,
    ),

  update: (id: string, data: UpdateTodoRequest) =>
    apiClient.put<Todo>(
      `${TODOS_PATH}/${id}`,
      data as unknown as Record<string, unknown>,
    ),

  delete: (id: string) => apiClient.delete<void>(`${TODOS_PATH}/${id}`),
};
