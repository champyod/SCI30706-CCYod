import { STORAGE_KEYS } from "../constants";
import type { Goal, Settings, Tx } from "../types";
import type { DataStore } from "./datastore";

const DEFAULT_SETTINGS: Settings = { mode: "daily", savingsBalance: 0, totalDeducted: 0 };

function parseMode(raw: string | null): Settings["mode"] {
  return raw === "weekly" || raw === "daily" ? raw : DEFAULT_SETTINGS.mode;
}

function parseNumber(raw: string | null): number {
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : 0;
}

export class LocalStore implements DataStore {
  constructor(private storage: Storage = globalThis.localStorage) {}

  private readJson<T>(key: string, fallback: T): T {
    const raw = this.storage.getItem(key);
    if (raw === null) {
      return fallback;
    }
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  }

  private writeJson(key: string, value: unknown): void {
    this.storage.setItem(key, JSON.stringify(value));
  }

  async listTransactions(): Promise<Tx[]> {
    return this.readJson<Tx[]>(STORAGE_KEYS.transactions, []);
  }

  async addTransaction(t: Omit<Tx, "id" | "createdAt">): Promise<Tx> {
    const tx: Tx = { ...t, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    const all = await this.listTransactions();
    this.writeJson(STORAGE_KEYS.transactions, [tx, ...all]);
    return tx;
  }

  async updateTransaction(id: string, patch: Partial<Tx>): Promise<void> {
    const all = await this.listTransactions();
    this.writeJson(
      STORAGE_KEYS.transactions,
      all.map((tx) => (tx.id === id ? { ...tx, ...patch } : tx)),
    );
  }

  async deleteTransaction(id: string): Promise<void> {
    const all = await this.listTransactions();
    this.writeJson(
      STORAGE_KEYS.transactions,
      all.filter((tx) => tx.id !== id),
    );
  }

  async listGoals(): Promise<Goal[]> {
    return this.readJson<Goal[]>(STORAGE_KEYS.goals, []);
  }

  async addGoal(g: Omit<Goal, "id" | "createdAt">): Promise<Goal> {
    const goal: Goal = { ...g, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    const all = await this.listGoals();
    this.writeJson(STORAGE_KEYS.goals, [...all, goal]);
    return goal;
  }

  async updateGoal(id: string, patch: Partial<Goal>): Promise<void> {
    const all = await this.listGoals();
    this.writeJson(
      STORAGE_KEYS.goals,
      all.map((goal) => (goal.id === id ? { ...goal, ...patch } : goal)),
    );
  }

  async deleteGoal(id: string): Promise<void> {
    const all = await this.listGoals();
    this.writeJson(
      STORAGE_KEYS.goals,
      all.filter((goal) => goal.id !== id),
    );
  }

  async getSettings(): Promise<Settings> {
    return {
      mode: parseMode(this.storage.getItem(STORAGE_KEYS.mode)),
      savingsBalance: parseNumber(this.storage.getItem(STORAGE_KEYS.savings_balance)),
      totalDeducted: parseNumber(this.storage.getItem(STORAGE_KEYS.total_deducted)),
    };
  }

  async saveSettings(s: Settings): Promise<void> {
    this.storage.setItem(STORAGE_KEYS.mode, s.mode);
    this.storage.setItem(STORAGE_KEYS.savings_balance, String(s.savingsBalance));
    this.storage.setItem(STORAGE_KEYS.total_deducted, String(s.totalDeducted));
  }

  async clearAll(): Promise<void> {
    this.storage.removeItem(STORAGE_KEYS.transactions);
    this.storage.removeItem(STORAGE_KEYS.goals);
    this.storage.removeItem(STORAGE_KEYS.mode);
    this.storage.removeItem(STORAGE_KEYS.savings_balance);
    this.storage.removeItem(STORAGE_KEYS.total_deducted);
  }
}