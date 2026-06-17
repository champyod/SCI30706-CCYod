"use client";

import { useState, useCallback } from "react";
import type { Todo, CreateTodoRequest } from "../types";

interface UseTodosReturn {
  todos: Todo[];
  isLoading: boolean;
  error: string | null;
  addTodo: (data: CreateTodoRequest) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
}

export function useTodos(): UseTodosReturn {
  const [todos] = useState<Todo[]>([]);
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);

  const addTodo = useCallback(async (_data: CreateTodoRequest) => {
    // TODO: Implement with todosApi.create
    console.log("addTodo called");
  }, []);

  const toggleTodo = useCallback(async (_id: string) => {
    // TODO: Implement with todosApi.update
    console.log("toggleTodo called");
  }, []);

  const deleteTodo = useCallback(async (_id: string) => {
    // TODO: Implement with todosApi.delete
    console.log("deleteTodo called");
  }, []);

  return { todos, isLoading, error, addTodo, toggleTodo, deleteTodo };
}
