import type { Goal, Settings, Tx } from "../types";

export interface DataStore {
  listTransactions(): Promise<Tx[]>;
  addTransaction(t: Omit<Tx, "id" | "createdAt">): Promise<Tx>;
  updateTransaction(id: string, patch: Partial<Tx>): Promise<void>;
  deleteTransaction(id: string): Promise<void>;
  listGoals(): Promise<Goal[]>;
  addGoal(g: Omit<Goal, "id" | "createdAt">): Promise<Goal>;
  updateGoal(id: string, patch: Partial<Goal>): Promise<void>;
  deleteGoal(id: string): Promise<void>;
  getSettings(): Promise<Settings>;
  saveSettings(s: Settings): Promise<void>;
}