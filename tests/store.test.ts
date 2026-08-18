import { beforeEach, describe, expect, mock, test } from "bun:test";
import {
  ADD_TX_ERROR,
  AppStore,
  PARTIAL_TX_WARNING,
  TIMEOUT_ERROR,
} from "../src/lib/store";
import type { DataStore } from "../src/lib/storage/datastore";
import type { Goal, Settings, Tx } from "../src/lib/types";
import { TimeoutError } from "../src/lib/with-timeout";

const toastError = mock(() => {});
const toastWarning = mock(() => {});
mock.module("sonner", () => ({
  toast: { error: toastError, warning: toastWarning },
}));

beforeEach(() => {
  toastError.mockClear();
  toastWarning.mockClear();
});

const DEFAULT_SETTINGS: Settings = {
  savingsBalance: 0,
  autoInvestPercent: 0,
  autoSavePercent: 0,
};

const OPTIMISTIC_MUTATION_NOTIFIES = 2;

const txInput = {
  type: "expense" as const,
  category: "food",
  amount: 50,
  note: "lunch",
  date: "2026-08-05",
};

const goalInput = {
  name: "vacation",
  target: 10000,
  current: 100,
  duration: 90,
  position: 0,
};

/** In-memory DataStore mirroring the backend contract (MemoryStorage-style). */
class FakeStore implements DataStore {
  transactions: Tx[] = [];
  goals: Goal[] = [];
  settings: Settings = { ...DEFAULT_SETTINGS };
  private nextId = 1;

  async listTransactions(): Promise<Tx[]> {
    return [...this.transactions];
  }

  async addTransaction(input: Omit<Tx, "id" | "createdAt">): Promise<Tx> {
    const tx: Tx = {
      ...input,
      id: `t${this.nextId++}`,
      createdAt: "2026-08-05T00:00:00.000Z",
    };
    this.transactions.push(tx);
    return tx;
  }

  async updateTransaction(id: string, patch: Partial<Tx>): Promise<void> {
    const index = this.transactions.findIndex((t) => t.id === id);
    if (index === -1) return;
    const existing = this.transactions[index];
    if (!existing) return;
    this.transactions[index] = { ...existing, ...patch };
  }

  async deleteTransaction(id: string): Promise<void> {
    this.transactions = this.transactions.filter((t) => t.id !== id);
  }

  async listGoals(): Promise<Goal[]> {
    return [...this.goals];
  }

  async addGoal(input: Omit<Goal, "id" | "createdAt">): Promise<Goal> {
    const goal: Goal = {
      ...input,
      id: `g${this.nextId++}`,
      createdAt: "2026-08-05T00:00:00.000Z",
    };
    this.goals.push(goal);
    return goal;
  }

  async updateGoal(id: string, patch: Partial<Goal>): Promise<void> {
    const index = this.goals.findIndex((g) => g.id === id);
    if (index === -1) return;
    const existing = this.goals[index];
    if (!existing) return;
    this.goals[index] = { ...existing, ...patch };
  }

  async deleteGoal(id: string): Promise<void> {
    this.goals = this.goals.filter((g) => g.id !== id);
  }

  async getSettings(): Promise<Settings> {
    return { ...this.settings };
  }

  async saveSettings(s: Settings): Promise<void> {
    this.settings = { ...s };
  }
}

/** Writes never settle; reads resolve so refetchAll can reconcile state. */
class HangingStore extends FakeStore {
  override addTransaction(): Promise<Tx> {
    return new Promise<Tx>(() => {});
  }

  override updateTransaction(): Promise<void> {
    return new Promise<void>(() => {});
  }

  override deleteTransaction(): Promise<void> {
    return new Promise<void>(() => {});
  }

  override addGoal(): Promise<Goal> {
    return new Promise<Goal>(() => {});
  }

  override updateGoal(): Promise<void> {
    return new Promise<void>(() => {});
  }

  override deleteGoal(): Promise<void> {
    return new Promise<void>(() => {});
  }

  override saveSettings(): Promise<void> {
    return new Promise<void>(() => {});
  }
}

/** Transaction insert fails immediately. */
class FailInsertStore extends FakeStore {
  override addTransaction(): Promise<Tx> {
    return Promise.reject(new Error("insert failed"));
  }
}

/** Transaction insert succeeds but the goal split write fails. */
class SplitFailsStore extends FakeStore {
  override updateGoal(): Promise<void> {
    return Promise.reject(new Error("split write failed"));
  }
}

function makeStore(backend = new FakeStore(), options?: { mutationTimeoutMs?: number }) {
  const store = new AppStore(backend, options);
  return { store, backend };
}

function countNotifications(store: AppStore): { count: () => number } {
  let count = 0;
  store.subscribe(() => {
    count += 1;
  });
  return { count: () => count };
}

describe("AppStore init", () => {
  test("loads transactions, goals, and settings from backend into cache", async () => {
    const backend = new FakeStore();
    await backend.addTransaction(txInput);
    await backend.addGoal(goalInput);
    await backend.saveSettings({ savingsBalance: 500, autoInvestPercent: 0, autoSavePercent: 0 });
    const { store } = makeStore(backend);

    await store.init();

    expect(store.transactions).toHaveLength(1);
    expect(store.transactions[0]?.note).toBe("lunch");
    expect(store.goals).toHaveLength(1);
    expect(store.goals[0]?.name).toBe("vacation");
    expect(store.settings).toEqual({ savingsBalance: 500, autoInvestPercent: 0, autoSavePercent: 0 });
  });

  test("init does not notify", async () => {
    const { store } = makeStore();
    const { count } = countNotifications(store);

    await store.init();

    expect(count()).toBe(0);
  });
});

describe("AppStore subscribe", () => {
  test("unsubscribe stops future notifications", async () => {
    const { store } = makeStore();
    let notified = 0;
    const unsubscribe = store.subscribe(() => {
      notified += 1;
    });

    await store.addTx(txInput);
    unsubscribe();
    await store.addTx(txInput);

    expect(notified).toBe(OPTIMISTIC_MUTATION_NOTIFIES);
  });
});

describe("AppStore transactions", () => {
  test("addTx persists to backend, updates cache, and notifies", async () => {
    const { store, backend } = makeStore();
    const { count } = countNotifications(store);

    const added = await store.addTx(txInput);

    expect(added.id).toBeTruthy();
    expect(store.transactions).toHaveLength(1);
    expect(store.transactions[0]).toEqual(added);
    expect(backend.transactions).toHaveLength(1);
    expect(count()).toBe(OPTIMISTIC_MUTATION_NOTIFIES);
  });

  test("deleteTx removes from backend and cache, and notifies", async () => {
    const { store, backend } = makeStore();
    const added = await store.addTx(txInput);
    const { count } = countNotifications(store);

    await store.deleteTx(added.id);

    expect(store.transactions).toHaveLength(0);
    expect(backend.transactions).toHaveLength(0);
    expect(count()).toBe(OPTIMISTIC_MUTATION_NOTIFIES);
  });
});

describe("AppStore goals", () => {
  test("addGoal persists to backend, updates cache, and notifies", async () => {
    const { store, backend } = makeStore();
    const { count } = countNotifications(store);

    const added = await store.addGoal(goalInput);

    expect(added.id).toBeTruthy();
    expect(store.goals).toHaveLength(1);
    expect(store.goals[0]).toEqual(added);
    expect(backend.goals).toHaveLength(1);
    expect(count()).toBe(OPTIMISTIC_MUTATION_NOTIFIES);
  });

  test("updateGoal patches backend and cache, and notifies", async () => {
    const { store, backend } = makeStore();
    const added = await store.addGoal(goalInput);
    const { count } = countNotifications(store);

    await store.updateGoal(added.id, { name: "new-car", target: 20000 });

    expect(store.goals[0]?.name).toBe("new-car");
    expect(store.goals[0]?.target).toBe(20000);
    expect(backend.goals[0]?.name).toBe("new-car");
    expect(count()).toBe(OPTIMISTIC_MUTATION_NOTIFIES);
  });

  test("deleteGoal removes from backend and cache, and notifies", async () => {
    const { store, backend } = makeStore();
    const added = await store.addGoal(goalInput);
    const { count } = countNotifications(store);

    await store.deleteGoal(added.id);

    expect(store.goals).toHaveLength(0);
    expect(backend.goals).toHaveLength(0);
    expect(count()).toBe(OPTIMISTIC_MUTATION_NOTIFIES);
  });
});

describe("AppStore investGoal", () => {
  test("adds money to the goal and persists, capped at target", async () => {
    const { store, backend } = makeStore();
    const goal = await store.addGoal(goalInput);
    const { count } = countNotifications(store);

    await store.investGoal(goal.id, 400);

    expect(store.goals[0]?.current).toBe(500);
    expect(backend.goals[0]?.current).toBe(500);
    expect(count()).toBe(OPTIMISTIC_MUTATION_NOTIFIES);
  });

  test("caps current at target", async () => {
    const { store, backend } = makeStore();
    const goal = await store.addGoal(goalInput);

    await store.investGoal(goal.id, 20000);

    expect(store.goals[0]?.current).toBe(goalInput.target);
    expect(backend.goals[0]?.current).toBe(goalInput.target);
  });

  test("missing id and non-positive amounts are no-ops without notify", async () => {
    const { store } = makeStore();
    const goal = await store.addGoal(goalInput);
    const { count } = countNotifications(store);

    await store.investGoal("missing", 100);
    await store.investGoal(goal.id, 0);

    expect(store.goals[0]?.current).toBe(goalInput.current);
    expect(count()).toBe(0);
  });
});

describe("AppStore saveMoney", () => {
  test("adds to savingsBalance and persists", async () => {
    const { store, backend } = makeStore();
    await store.init();
    const { count } = countNotifications(store);

    await store.saveMoney(250);

    expect(store.settings.savingsBalance).toBe(250);
    expect(backend.settings.savingsBalance).toBe(250);
    expect(count()).toBe(OPTIMISTIC_MUTATION_NOTIFIES);
  });

  test("non-positive amounts are a no-op without notify", async () => {
    const { store } = makeStore();
    await store.init();
    const { count } = countNotifications(store);

    await store.saveMoney(0);

    expect(store.settings.savingsBalance).toBe(0);
    expect(count()).toBe(0);
  });
});

describe("AppStore auto-split on income", () => {
  test("invests into the top goal first, then rolls over to the next", async () => {
    const { store, backend } = makeStore();
    await store.init();
    const first = await store.addGoal({ ...goalInput, name: "first", current: 0 });
    await store.addGoal({ ...goalInput, name: "second", current: 0, position: 1 });
    await store.updateSettings({ autoInvestPercent: 50, autoSavePercent: 10 });

    const income = { ...txInput, type: "income" as const, category: "salary", amount: 1000 };
    await store.addTx(income);

    expect(store.goals[0]?.current).toBe(500);
    expect(store.goals[1]?.current).toBe(0);
    expect(store.settings.savingsBalance).toBe(100);
    expect(store.transactions).toHaveLength(1);
    expect(backend.goals[0]?.current).toBe(500);
    expect(backend.settings.savingsBalance).toBe(100);
  });

  test("rolls leftover into the next goal when the first is capped", async () => {
    const { store } = makeStore();
    await store.init();
    const first = await store.addGoal({ ...goalInput, name: "first", target: 100, current: 0 });
    await store.addGoal({ ...goalInput, name: "second", target: 1000, current: 0, position: 1 });
    await store.updateSettings({ autoInvestPercent: 50, autoSavePercent: 0 });

    const income = { ...txInput, type: "income" as const, category: "salary", amount: 1000 };
    await store.addTx(income);

    expect(store.goals[0]?.current).toBe(100);
    expect(store.goals[1]?.current).toBe(400);
  });

  test("no split when percents are zero", async () => {
    const { store } = makeStore();
    await store.init();
    const goal = await store.addGoal({ ...goalInput, current: 0 });
    await store.updateSettings({ autoInvestPercent: 0, autoSavePercent: 0 });

    const income = { ...txInput, type: "income" as const, category: "salary", amount: 1000 };
    await store.addTx(income);

    expect(store.goals[0]?.current).toBe(0);
    expect(store.settings.savingsBalance).toBe(0);
  });

  test("expense transactions never trigger a split", async () => {
    const { store } = makeStore();
    await store.init();
    const goal = await store.addGoal({ ...goalInput, current: 0 });
    await store.updateSettings({ autoInvestPercent: 50, autoSavePercent: 10 });

    await store.addTx(txInput);

    expect(store.goals[0]?.current).toBe(0);
    expect(store.settings.savingsBalance).toBe(0);
  });
});

describe("AppStore settings", () => {
  test("updateSettings merges patch into cache and backend, and notifies", async () => {
    const { store, backend } = makeStore();
    await store.init();
    const { count } = countNotifications(store);

    await store.updateSettings({ savingsBalance: 900 });

    expect(store.settings).toEqual({ ...DEFAULT_SETTINGS, savingsBalance: 900 });
    expect(backend.settings).toEqual({ ...DEFAULT_SETTINGS, savingsBalance: 900 });
    expect(count()).toBe(OPTIMISTIC_MUTATION_NOTIFIES);
  });
});

describe("AppStore mutation failure", () => {
  test("addTx failure removes the skeleton and shows an error toast", async () => {
    const { store } = makeStore(new FailInsertStore());
    const { count } = countNotifications(store);

    await expect(store.addTx(txInput)).rejects.toThrow("insert failed");

    expect(store.transactions).toHaveLength(0);
    expect(store.pendingTxIds.size).toBe(0);
    expect(toastError).toHaveBeenCalledWith(ADD_TX_ERROR);
    expect(count()).toBe(OPTIMISTIC_MUTATION_NOTIFIES);
  });
});

describe("AppStore mutation timeout", () => {
  test("addTx timeout removes the skeleton and shows a timeout toast", async () => {
    const { store } = makeStore(new HangingStore(), { mutationTimeoutMs: 5 });
    const { count } = countNotifications(store);

    await expect(store.addTx(txInput)).rejects.toBeInstanceOf(TimeoutError);

    expect(store.transactions).toHaveLength(0);
    expect(store.pendingTxIds.size).toBe(0);
    expect(toastError).toHaveBeenCalledWith(TIMEOUT_ERROR);
    expect(count()).toBe(OPTIMISTIC_MUTATION_NOTIFIES);
  });
});

describe("AppStore partial split failure", () => {
  test("keeps the persisted transaction and warns when the split write fails", async () => {
    const { store, backend } = makeStore(new SplitFailsStore());
    await store.init();
    await store.addGoal({ ...goalInput, current: 0 });
    await store.updateSettings({ autoInvestPercent: 50, autoSavePercent: 0 });
    const { count } = countNotifications(store);

    const income = { ...txInput, type: "income" as const, category: "salary", amount: 1000 };
    const saved = await store.addTx(income);

    expect(saved.id).toBeTruthy();
    expect(backend.transactions).toHaveLength(1);
    expect(store.transactions).toHaveLength(1);
    expect(toastWarning).toHaveBeenCalledWith(PARTIAL_TX_WARNING);
    expect(count()).toBe(OPTIMISTIC_MUTATION_NOTIFIES);
  });
});