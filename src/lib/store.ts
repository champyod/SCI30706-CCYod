import type { DataStore } from "./storage/datastore";
import type { Goal, Settings, Tx } from "./types";

const DEFAULT_SETTINGS: Settings = {
  mode: "daily",
  savingsBalance: 0,
  totalDeducted: 0,
};

/** Single in-memory cache over a DataStore backend; notifies listeners on every mutation. */
export class AppStore {
  transactions: Tx[] = [];
  goals: Goal[] = [];
  settings: Settings = { ...DEFAULT_SETTINGS };
  backend: DataStore;
  private listeners = new Set<() => void>();

  constructor(backend: DataStore) {
    this.backend = backend;
  }

  async init(): Promise<void> {
    const [transactions, goals, settings] = await Promise.all([
      this.backend.listTransactions(),
      this.backend.listGoals(),
      this.backend.getSettings(),
    ]);
    this.transactions = transactions;
    this.goals = goals;
    this.settings = settings;
  }

  subscribe(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  notify(): void {
    this.listeners.forEach((listener) => {
      listener();
    });
  }

  async addTx(input: Omit<Tx, "id" | "createdAt">): Promise<Tx> {
    const tx = await this.backend.addTransaction(input);
    this.transactions.push(tx);
    this.notify();
    return tx;
  }

  async updateTx(id: string, patch: Partial<Tx>): Promise<void> {
    await this.backend.updateTransaction(id, patch);
    const index = this.transactions.findIndex((t) => t.id === id);
    if (index === -1) return;
    const existing = this.transactions[index];
    if (!existing) return;
    this.transactions[index] = { ...existing, ...patch };
    this.notify();
  }

  async deleteTx(id: string): Promise<void> {
    await this.backend.deleteTransaction(id);
    const next = this.transactions.filter((t) => t.id !== id);
    if (next.length === this.transactions.length) return;
    this.transactions = next;
    this.notify();
  }

  async addGoal(input: Omit<Goal, "id" | "createdAt">): Promise<Goal> {
    const goal = await this.backend.addGoal(input);
    this.goals.push(goal);
    this.notify();
    return goal;
  }

  async updateGoal(id: string, patch: Partial<Goal>): Promise<void> {
    await this.backend.updateGoal(id, patch);
    const index = this.goals.findIndex((g) => g.id === id);
    if (index === -1) return;
    const existing = this.goals[index];
    if (!existing) return;
    this.goals[index] = { ...existing, ...patch };
    this.notify();
  }

  async deleteGoal(id: string): Promise<void> {
    await this.backend.deleteGoal(id);
    const next = this.goals.filter((g) => g.id !== id);
    if (next.length === this.goals.length) return;
    this.goals = next;
    this.notify();
  }

  /** Move the goal at `position` (array index) to the front; persist new positions via updateGoal. */
  async promoteGoal(position: number): Promise<void> {
    const goal = this.goals[position];
    if (!goal) return;
    const reordered = [goal, ...this.goals.filter((g) => g.id !== goal.id)];
    let changed = false;
    for (let index = 0; index < reordered.length; index += 1) {
      const current = reordered[index];
      if (!current) continue;
      if (current.position !== index) {
        await this.backend.updateGoal(current.id, { position: index });
        changed = true;
      }
    }
    if (!changed) return;
    // refresh position fields on cached goals to match persisted order
    this.goals = reordered.map((g, index) => ({ ...g, position: index }));
    this.notify();
  }

  async updateSettings(patch: Partial<Settings>): Promise<void> {
    const merged = { ...this.settings, ...patch };
    await this.backend.saveSettings(merged);
    this.settings = merged;
    this.notify();
  }

  async setBackend(store: DataStore): Promise<void> {
    this.backend = store;
    await this.init();
    this.notify();
  }

  async clearAll(): Promise<void> {
    await this.backend.clearAll();
    this.transactions = [];
    this.goals = [];
    this.settings = { ...DEFAULT_SETTINGS };
    this.notify();
  }
}
