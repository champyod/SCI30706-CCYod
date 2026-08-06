import { toast } from "sonner";
import type { DataStore } from "./storage/datastore";
import type { Goal, Settings, Tx } from "./types";

const DEFAULT_SETTINGS: Settings = {
  mode: "daily",
  savingsBalance: 0,
  totalDeducted: 0,
};

const ADD_TX_ERROR = "ไม่สามารถเพิ่มรายการได้ โปรดลองอีกครั้ง";
const ADD_GOAL_ERROR = "ไม่สามารถเพิ่มเป้าหมายได้ โปรดลองอีกครั้ง";
const DELETE_ERROR = "ไม่สามารถลบข้อมูลได้ โปรดลองอีกครั้ง";
const UPDATE_ERROR = "ไม่สามารถบันทึกการเปลี่ยนแปลงได้ โปรดลองอีกครั้ง";

function tempId(): string {
  return `pending-${crypto.randomUUID()}`;
}

/** Single in-memory cache over a DataStore backend; notifies listeners on every mutation. */
export class AppStore {
  transactions: Tx[] = [];
  goals: Goal[] = [];
  settings: Settings = { ...DEFAULT_SETTINGS };
  backend: DataStore;
  private listeners = new Set<() => void>();
  // Monotonic revision: useSyncExternalStore snapshots must change on mutation.
  version = 0;
  // Optimistic rows whose backend write has not resolved yet; the UI renders
  // them as skeleton rows so an action feels sent instantly.
  pendingTxIds = new Set<string>();
  pendingGoalIds = new Set<string>();

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
    this.version += 1;
    this.listeners.forEach((listener) => {
      listener();
    });
  }

  isTxPending(id: string): boolean {
    return this.pendingTxIds.has(id);
  }

  isGoalPending(id: string): boolean {
    return this.pendingGoalIds.has(id);
  }

  // Optimistic add: the row appears immediately as pending, then the backend
  // write resolves and replaces it with the persisted record. On failure the
  // row is rolled back and a toast explains what happened.
  async addTx(input: Omit<Tx, "id" | "createdAt">): Promise<Tx> {
    const pending: Tx = { ...input, id: tempId(), createdAt: new Date().toISOString() };
    this.transactions.push(pending);
    this.pendingTxIds.add(pending.id);
    this.notify();
    try {
      const saved = await this.backend.addTransaction(input);
      this.transactions = this.transactions.map((tx) => (tx.id === pending.id ? saved : tx));
      this.pendingTxIds.delete(pending.id);
      this.notify();
      return saved;
    } catch (error) {
      this.transactions = this.transactions.filter((tx) => tx.id !== pending.id);
      this.pendingTxIds.delete(pending.id);
      this.notify();
      toast.error(ADD_TX_ERROR);
      throw error;
    }
  }

  async updateTx(id: string, patch: Partial<Tx>): Promise<void> {
    const previous = this.transactions;
    const previousIndex = this.transactions.findIndex((t) => t.id === id);
    if (previousIndex === -1) return;
    const existing = previous[previousIndex];
    if (existing === undefined) return;
    this.transactions = this.transactions.map((t, index) =>
      index === previousIndex ? { ...existing, ...patch } : t,
    );
    this.notify();
    try {
      await this.backend.updateTransaction(id, patch);
    } catch (error) {
      this.transactions = previous;
      this.notify();
      toast.error(UPDATE_ERROR);
      throw error;
    }
  }

  // Optimistic delete: the row disappears immediately; on failure it is
  // restored and a toast explains the rollback.
  async deleteTx(id: string): Promise<void> {
    const previous = this.transactions;
    const removed = this.transactions.find((t) => t.id === id);
    this.transactions = this.transactions.filter((t) => t.id !== id);
    if (removed !== undefined) {
      this.pendingTxIds.add(id);
    }
    this.notify();
    try {
      await this.backend.deleteTransaction(id);
      this.pendingTxIds.delete(id);
      this.notify();
    } catch (error) {
      this.transactions = previous;
      this.pendingTxIds.delete(id);
      this.notify();
      toast.error(DELETE_ERROR);
      throw error;
    }
  }

  async addGoal(input: Omit<Goal, "id" | "createdAt">): Promise<Goal> {
    const pending: Goal = { ...input, id: tempId(), createdAt: new Date().toISOString() };
    this.goals.push(pending);
    this.pendingGoalIds.add(pending.id);
    this.notify();
    try {
      const saved = await this.backend.addGoal(input);
      this.goals = this.goals.map((goal) => (goal.id === pending.id ? saved : goal));
      this.pendingGoalIds.delete(pending.id);
      this.notify();
      return saved;
    } catch (error) {
      this.goals = this.goals.filter((goal) => goal.id !== pending.id);
      this.pendingGoalIds.delete(pending.id);
      this.notify();
      toast.error(ADD_GOAL_ERROR);
      throw error;
    }
  }

  async updateGoal(id: string, patch: Partial<Goal>): Promise<void> {
    const previous = this.goals;
    const previousIndex = this.goals.findIndex((g) => g.id === id);
    if (previousIndex === -1) return;
    const existing = previous[previousIndex];
    if (existing === undefined) return;
    this.goals = this.goals.map((g, index) =>
      index === previousIndex ? { ...existing, ...patch } : g,
    );
    this.notify();
    try {
      await this.backend.updateGoal(id, patch);
    } catch (error) {
      this.goals = previous;
      this.notify();
      toast.error(UPDATE_ERROR);
      throw error;
    }
  }

  async deleteGoal(id: string): Promise<void> {
    const previous = this.goals;
    const removed = this.goals.find((g) => g.id === id);
    this.goals = this.goals.filter((g) => g.id !== id);
    if (removed !== undefined) {
      this.pendingGoalIds.add(id);
    }
    this.notify();
    try {
      await this.backend.deleteGoal(id);
      this.pendingGoalIds.delete(id);
      this.notify();
    } catch (error) {
      this.goals = previous;
      this.pendingGoalIds.delete(id);
      this.notify();
      toast.error(DELETE_ERROR);
      throw error;
    }
  }

  /** Move the goal at `position` (array index) to the front; persist new positions via updateGoal. */
  async promoteGoal(position: number): Promise<void> {
    const previous = this.goals;
    const goal = this.goals[position];
    if (!goal) return;
    const reordered = [goal, ...this.goals.filter((g) => g.id !== goal.id)];
    this.goals = reordered.map((g, index) => ({ ...g, position: index }));
    this.notify();
    try {
      for (let index = 0; index < reordered.length; index += 1) {
        const current = reordered[index];
        if (current === undefined) continue;
        if (current.position !== index) {
          await this.backend.updateGoal(current.id, { position: index });
        }
      }
    } catch (error) {
      this.goals = previous;
      this.notify();
      toast.error(UPDATE_ERROR);
      throw error;
    }
  }

  async updateSettings(patch: Partial<Settings>): Promise<void> {
    const previous = this.settings;
    const merged = { ...this.settings, ...patch };
    this.settings = merged;
    this.notify();
    try {
      await this.backend.saveSettings(merged);
    } catch (error) {
      this.settings = previous;
      this.notify();
      toast.error(UPDATE_ERROR);
      throw error;
    }
  }

  async setBackend(store: DataStore): Promise<void> {
    this.backend = store;
    await this.init();
    this.notify();
  }

  async clearAll(): Promise<void> {
    const previousTransactions = this.transactions;
    const previousGoals = this.goals;
    const previousSettings = this.settings;
    this.transactions = [];
    this.goals = [];
    this.settings = { ...DEFAULT_SETTINGS };
    this.notify();
    try {
      await this.backend.clearAll();
    } catch (error) {
      this.transactions = previousTransactions;
      this.goals = previousGoals;
      this.settings = previousSettings;
      this.notify();
      toast.error(UPDATE_ERROR);
      throw error;
    }
  }
}
