import { toast } from "sonner";
import { computeAutoSplit, type AutoSplitResult } from "./auto-split";
import type { DataStore } from "./storage/datastore";
import type { Goal, Settings, Tx } from "./types";
import { TimeoutError, withTimeout } from "./with-timeout";

const DEFAULT_SETTINGS: Settings = {
  savingsBalance: 0,
  autoInvestPercent: 0,
  autoSavePercent: 0,
};

export const MUTATION_TIMEOUT_MS = 10000;

export const ADD_TX_ERROR = "ไม่สามารถเพิ่มรายการได้ โปรดลองอีกครั้ง";
export const ADD_GOAL_ERROR = "ไม่สามารถเพิ่มเป้าหมายได้ โปรดลองอีกครั้ง";
export const DELETE_ERROR = "ไม่สามารถลบข้อมูลได้ โปรดลองอีกครั้ง";
export const UPDATE_ERROR = "ไม่สามารถบันทึกการเปลี่ยนแปลงได้ โปรดลองอีกครั้ง";
export const TIMEOUT_ERROR = "ไม่สามารถเชื่อมต่อฐานข้อมูลได้ โปรดลองอีกครั้ง";
export const PARTIAL_TX_WARNING = "บันทึกรายการแล้ว แต่ไม่สามารถอัปเดตเป้าหมาย/เงินออมได้";

function tempId(): string {
  return `pending-${crypto.randomUUID()}`;
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * In-memory view over a DataStore backend (Supabase is the single source of
 * truth). Every mutation notifies optimistically, then refetches the whole
 * dataset once the backend call settles — the refetch is the rollback, so a
 * failed or hung mutation can never leave stale numbers on screen.
 */
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
  private mutationTimeoutMs: number;

  constructor(backend: DataStore, options: { mutationTimeoutMs?: number } = {}) {
    this.backend = backend;
    this.mutationTimeoutMs = options.mutationTimeoutMs ?? MUTATION_TIMEOUT_MS;
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

  /**
   * Pull the full dataset from the backend and notify. Best-effort: partial
   * failures keep whatever succeeded, and this never throws so mutation
   * error handling stays the single source of user feedback.
   */
  private async refetchAll(): Promise<void> {
    try {
      const [transactions, goals, settings] = await Promise.all([
        this.backend.listTransactions(),
        this.backend.listGoals(),
        this.backend.getSettings(),
      ]);
      this.transactions = transactions;
      this.goals = goals;
      this.settings = settings;
      this.pendingTxIds.clear();
      this.pendingGoalIds.clear();
    } catch (error) {
      console.error("refetchAll failed", error);
    }
    this.notify();
  }

  private toastFor(error: unknown, fallback: string): void {
    toast.error(error instanceof TimeoutError ? TIMEOUT_ERROR : fallback);
  }

  // An income transaction also triggers auto-invest (top goal first, rollover
  // to the next) and auto-save; both are persisted after the transaction write
  // succeeds. Deleting the income transaction later does NOT reverse its split.
  async addTx(input: Omit<Tx, "id" | "createdAt">): Promise<Tx> {
    const pending: Tx = { ...input, id: tempId(), createdAt: new Date().toISOString() };
    const split =
      input.type === "income" ? computeAutoSplit(input.amount, this.goals, this.settings) : null;

    this.transactions.push(pending);
    this.pendingTxIds.add(pending.id);
    this.notify();

    let saved: Tx;
    try {
      saved = await withTimeout(this.backend.addTransaction(input), this.mutationTimeoutMs);
    } catch (error) {
      await this.refetchAll();
      this.toastFor(error, ADD_TX_ERROR);
      throw error;
    }

    if (split !== null && (split.goalDeltas.length > 0 || split.saveAmount > 0)) {
      try {
        await withTimeout(this.writeSplit(split), this.mutationTimeoutMs);
      } catch {
        // The transaction itself is persisted; only the split write failed.
        // Keep the row and warn instead of rolling back a saved record.
        await this.refetchAll();
        toast.warning(PARTIAL_TX_WARNING);
        return saved;
      }
    }

    await this.refetchAll();
    return saved;
  }

  private async writeSplit(split: AutoSplitResult): Promise<void> {
    for (const delta of split.goalDeltas) {
      const goal = this.goals.find((g) => g.id === delta.goalId);
      if (goal !== undefined) {
        await this.backend.updateGoal(delta.goalId, { current: round2(goal.current + delta.amount) });
      }
    }
    if (split.saveAmount > 0) {
      await this.backend.saveSettings({
        ...this.settings,
        savingsBalance: round2(this.settings.savingsBalance + split.saveAmount),
      });
    }
  }

  // Optimistic delete: the row disappears immediately; a failed or hung delete
  // is reconciled by refetching the authoritative list.
  async deleteTx(id: string): Promise<void> {
    this.transactions = this.transactions.filter((t) => t.id !== id);
    this.notify();
    try {
      await withTimeout(this.backend.deleteTransaction(id), this.mutationTimeoutMs);
    } catch (error) {
      await this.refetchAll();
      this.toastFor(error, DELETE_ERROR);
      throw error;
    }
    await this.refetchAll();
  }

  async addGoal(input: Omit<Goal, "id" | "createdAt">): Promise<Goal> {
    const pending: Goal = { ...input, id: tempId(), createdAt: new Date().toISOString() };
    this.goals.push(pending);
    this.pendingGoalIds.add(pending.id);
    this.notify();
    try {
      const saved = await withTimeout(this.backend.addGoal(input), this.mutationTimeoutMs);
      await this.refetchAll();
      return saved;
    } catch (error) {
      await this.refetchAll();
      this.toastFor(error, ADD_GOAL_ERROR);
      throw error;
    }
  }

  async updateGoal(id: string, patch: Partial<Goal>): Promise<void> {
    const previousIndex = this.goals.findIndex((g) => g.id === id);
    if (previousIndex === -1) return;
    const existing = this.goals[previousIndex];
    if (existing === undefined) return;
    this.goals = this.goals.map((g, index) =>
      index === previousIndex ? { ...existing, ...patch } : g,
    );
    this.notify();
    try {
      await withTimeout(this.backend.updateGoal(id, patch), this.mutationTimeoutMs);
    } catch (error) {
      await this.refetchAll();
      this.toastFor(error, UPDATE_ERROR);
      throw error;
    }
    await this.refetchAll();
  }

  async deleteGoal(id: string): Promise<void> {
    this.goals = this.goals.filter((g) => g.id !== id);
    this.notify();
    try {
      await withTimeout(this.backend.deleteGoal(id), this.mutationTimeoutMs);
    } catch (error) {
      await this.refetchAll();
      this.toastFor(error, DELETE_ERROR);
      throw error;
    }
    await this.refetchAll();
  }

  /**
   * Add money to a goal, capped so its current never exceeds target.
   */
  async investGoal(id: string, amount: number): Promise<void> {
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
      await withTimeout(this.backend.updateGoal(id, { current: nextCurrent }), this.mutationTimeoutMs);
    } catch (error) {
      await this.refetchAll();
      this.toastFor(error, UPDATE_ERROR);
      throw error;
    }
    await this.refetchAll();
  }

  /**
   * Move money out of free balance into savings.
   */
  async saveMoney(amount: number): Promise<void> {
    if (amount <= 0) {
      return;
    }
    const merged = { ...this.settings, savingsBalance: round2(this.settings.savingsBalance + amount) };
    this.settings = merged;
    this.notify();
    try {
      await withTimeout(this.backend.saveSettings(merged), this.mutationTimeoutMs);
    } catch (error) {
      await this.refetchAll();
      this.toastFor(error, UPDATE_ERROR);
      throw error;
    }
    await this.refetchAll();
  }

  async updateSettings(patch: Partial<Settings>): Promise<void> {
    const merged = { ...this.settings, ...patch };
    this.settings = merged;
    this.notify();
    try {
      await withTimeout(this.backend.saveSettings(merged), this.mutationTimeoutMs);
    } catch (error) {
      await this.refetchAll();
      this.toastFor(error, UPDATE_ERROR);
      throw error;
    }
    await this.refetchAll();
  }
}