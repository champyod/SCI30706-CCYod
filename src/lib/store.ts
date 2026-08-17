import { toast } from "sonner";
import { applyGoalDeltas, computeAutoSplit } from "./auto-split";
import type { DataStore } from "./storage/datastore";
import type { Goal, Settings, Tx } from "./types";

const DEFAULT_SETTINGS: Settings = {
  savingsBalance: 0,
  autoInvestPercent: 0,
  autoSavePercent: 0,
};

const ADD_TX_ERROR = "ไม่สามารถเพิ่มรายการได้ โปรดลองอีกครั้ง";
const ADD_GOAL_ERROR = "ไม่สามารถเพิ่มเป้าหมายได้ โปรดลองอีกครั้ง";
const DELETE_ERROR = "ไม่สามารถลบข้อมูลได้ โปรดลองอีกครั้ง";
const UPDATE_ERROR = "ไม่สามารถบันทึกการเปลี่ยนแปลงได้ โปรดลองอีกครั้ง";

function tempId(): string {
  return `pending-${crypto.randomUUID()}`;
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
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

  // Optimistic add: the row appears immediately as pending, then the backend
  // write resolves and replaces it with the persisted record. On failure the
  // row is rolled back and a toast explains what happened.
  //
  // An income transaction also triggers auto-invest (top goal first, rollover
  // to the next) and auto-save; both are applied optimistically and persisted
  // only after the transaction write succeeds. Deleting the income transaction
  // later does NOT reverse its split.
  async addTx(input: Omit<Tx, "id" | "createdAt">): Promise<Tx> {
    const pending: Tx = { ...input, id: tempId(), createdAt: new Date().toISOString() };
    const split =
      input.type === "income" ? computeAutoSplit(input.amount, this.goals, this.settings) : null;
    const previousGoals = this.goals;
    const previousSettings = this.settings;

    this.transactions.push(pending);
    this.pendingTxIds.add(pending.id);
    if (split !== null && (split.goalDeltas.length > 0 || split.saveAmount > 0)) {
      this.goals = applyGoalDeltas(this.goals, split.goalDeltas);
      this.settings = {
        ...this.settings,
        savingsBalance: round2(this.settings.savingsBalance + split.saveAmount),
      };
    }
    this.notify();
    try {
      const saved = await this.backend.addTransaction(input);
      this.transactions = this.transactions.map((tx) => (tx.id === pending.id ? saved : tx));
      this.pendingTxIds.delete(pending.id);
      if (split !== null) {
        for (const delta of split.goalDeltas) {
          const goal = this.goals.find((g) => g.id === delta.goalId);
          if (goal !== undefined) {
            await this.backend.updateGoal(delta.goalId, { current: goal.current });
          }
        }
        if (split.saveAmount > 0) {
          await this.backend.saveSettings(this.settings);
        }
      }
      this.notify();
      return saved;
    } catch (error) {
      this.transactions = this.transactions.filter((tx) => tx.id !== pending.id);
      this.goals = previousGoals;
      this.settings = previousSettings;
      this.pendingTxIds.delete(pending.id);
      this.notify();
      toast.error(ADD_TX_ERROR);
      throw error;
    }
  }
  // Optimistic delete: the row disappears immediately; on failure it is
  // restored and a toast explains the rollback.
  async deleteTx(id: string): Promise<void> {
    const previous = this.transactions;
    this.transactions = this.transactions.filter((t) => t.id !== id);
    this.notify();
    try {
      await this.backend.deleteTransaction(id);
      this.notify();
    } catch (error) {
      this.transactions = previous;
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
    this.goals = this.goals.filter((g) => g.id !== id);
    this.notify();
    try {
      await this.backend.deleteGoal(id);
      this.notify();
    } catch (error) {
      this.goals = previous;
      this.notify();
      toast.error(DELETE_ERROR);
      throw error;
    }
  }

  /**
   * Add money to a goal, capped so its current never exceeds target.
   */
  async investGoal(id: string, amount: number): Promise<void> {
    const previous = this.goals;
    const goal = this.goals.find((g) => g.id === id);
    if (goal === undefined || amount <= 0) {
      return;
    }
    const nextCurrent = round2(Math.min(goal.target, goal.current + amount));
    if (nextCurrent === goal.current) {
      return;
    }
    this.goals = this.goals.map((g) =>
      g.id === id ? { ...g, current: nextCurrent } : g,
    );
    this.notify();
    try {
      await this.backend.updateGoal(id, { current: nextCurrent });
    } catch (error) {
      this.goals = previous;
      this.notify();
      toast.error(UPDATE_ERROR);
      throw error;
    }
  }

  /**
   * Move money out of free balance into savings.
   */
  async saveMoney(amount: number): Promise<void> {
    if (amount <= 0) {
      return;
    }
    const previous = this.settings;
    const merged = { ...this.settings, savingsBalance: round2(this.settings.savingsBalance + amount) };
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
}
