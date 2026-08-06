import { describe, expect, test } from "bun:test";
import { LocalStore } from "../src/lib/storage/local";
import { STORAGE_KEYS } from "../src/lib/constants";
import type { Goal, Settings, Tx } from "../src/lib/types";

class MemoryStorage implements Storage {
  private data = new Map<string, string>();

  get length() {
    return this.data.size;
  }

  clear() {
    this.data.clear();
  }

  getItem(key: string) {
    return this.data.get(key) ?? null;
  }

  key(index: number) {
    return Array.from(this.data.keys())[index] ?? null;
  }

  removeItem(key: string) {
    this.data.delete(key);
  }

  setItem(key: string, value: string) {
    this.data.set(key, value);
  }
}

function makeStore(): { store: LocalStore; storage: MemoryStorage } {
  const storage = new MemoryStorage();
  return { store: new LocalStore(storage), storage };
}

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
  mode: "weekly" as const,
  duration: 90,
  position: 0,
};

const settingsInput: Settings = {
  savingsBalance: 500,
  totalDeducted: 123,
  autoInvestPercent: 20,
  autoSavePercent: 10,
};

describe("LocalStore transactions", () => {
  test("addTransaction then listTransactions roundtrips the added Tx first", async () => {
    const { store } = makeStore();
    const added = await store.addTransaction(txInput);
    const list = await store.listTransactions();

    expect(added.id).toBeTruthy();
    expect(added.createdAt).toBeTruthy();
    expect(list).toHaveLength(1);
    expect(list[0]).toEqual(added);
  });

  test("addTransaction persists to shim storage as JSON containing the id", async () => {
    const { store, storage } = makeStore();
    const added = await store.addTransaction(txInput);

    const raw = storage.getItem(STORAGE_KEYS.transactions);
    expect(raw).not.toBeNull();
    expect(raw).toContain(added.id);
  });

  test("updateTransaction patch persists and leaves other Txs untouched", async () => {
    const { store } = makeStore();
    const first = await store.addTransaction(txInput);
    const second = await store.addTransaction({ ...txInput, note: "other" });

    await store.updateTransaction(first.id, {
      note: "changed",
      amount: 99,
      category: "transport",
    });

    const list = await store.listTransactions();
    expect(list).toHaveLength(2);
    const updated = list.find((t: Tx) => t.id === first.id);
    expect(updated?.note).toBe("changed");
    expect(updated?.amount).toBe(99);
    expect(updated?.category).toBe("transport");
    expect(updated?.type).toBe("expense");
    const untouched = list.find((t: Tx) => t.id === second.id);
    expect(untouched?.note).toBe("other");
  });

  test("updateTransaction with non-existent id does not throw and changes nothing", async () => {
    const { store } = makeStore();
    await store.addTransaction(txInput);

    await expect(
      store.updateTransaction("missing-id", { note: "nope" }),
    ).resolves.toBeUndefined();

    const list = await store.listTransactions();
    expect(list).toHaveLength(1);
    expect(list[0]?.note).toBe("lunch");
  });

  test("deleteTransaction removes the Tx and updates storage key", async () => {
    const { store, storage } = makeStore();
    const first = await store.addTransaction(txInput);
    await store.addTransaction({ ...txInput, note: "second" });

    await store.deleteTransaction(first.id);

    const list = await store.listTransactions();
    expect(list).toHaveLength(1);
    expect(list.some((t: Tx) => t.id === first.id)).toBe(false);
    const raw = storage.getItem(STORAGE_KEYS.transactions);
    expect(raw).not.toBeNull();
    expect(raw).not.toContain(first.id);
  });
});

describe("LocalStore goals", () => {
  test("addGoal then listGoals roundtrips the added Goal last", async () => {
    const { store } = makeStore();
    const added = await store.addGoal(goalInput);
    const list = await store.listGoals();

    expect(added.id).toBeTruthy();
    expect(added.createdAt).toBeTruthy();
    expect(list).toHaveLength(1);
    expect(list[0]).toEqual(added);
  });

  test("updateGoal patch persists", async () => {
    const { store } = makeStore();
    const goal = await store.addGoal(goalInput);

    await store.updateGoal(goal.id, { name: "new-car", target: 20000 });

    const list = await store.listGoals();
    const updated = list.find((g: Goal) => g.id === goal.id);
    expect(updated?.name).toBe("new-car");
    expect(updated?.target).toBe(20000);
    expect(updated?.mode).toBe("weekly");
  });

  test("deleteGoal removes the Goal", async () => {
    const { store } = makeStore();
    const goal = await store.addGoal(goalInput);
    await store.addGoal({ ...goalInput, name: "other" });

    await store.deleteGoal(goal.id);

    const list = await store.listGoals();
    expect(list).toHaveLength(1);
    expect(list.some((g: Goal) => g.id === goal.id)).toBe(false);
  });
});

describe("LocalStore settings", () => {
  test("getSettings returns defaults when storage is empty", async () => {
    const { store } = makeStore();
    const settings = await store.getSettings();

    expect(settings).toEqual({
      savingsBalance: 0,
      totalDeducted: 0,
      autoInvestPercent: 0,
      autoSavePercent: 0,
    });
  });

  test("saveSettings then getSettings roundtrips all four values", async () => {
    const { store } = makeStore();

    await store.saveSettings(settingsInput);
    const settings = await store.getSettings();

    expect(settings).toEqual(settingsInput);
  });

  test("saveSettings persists values in shim storage", async () => {
    const { store, storage } = makeStore();

    await store.saveSettings(settingsInput);

    expect(storage.getItem(STORAGE_KEYS.savings_balance)).toBe("500");
    expect(storage.getItem(STORAGE_KEYS.total_deducted)).toBe("123");
    expect(storage.getItem(STORAGE_KEYS.auto_invest_percent)).toBe("20");
    expect(storage.getItem(STORAGE_KEYS.auto_save_percent)).toBe("10");
  });

  test("clearAll empties transactions, goals, and settings", async () => {
    const { store, storage } = makeStore();
    await store.addTransaction(txInput);
    await store.addGoal(goalInput);
    await store.saveSettings(settingsInput);

    await store.clearAll();

    expect(await store.listTransactions()).toEqual([]);
    expect(await store.listGoals()).toEqual([]);
    expect(await store.getSettings()).toEqual({
      savingsBalance: 0,
      totalDeducted: 0,
      autoInvestPercent: 0,
      autoSavePercent: 0,
    });
    expect(storage.getItem(STORAGE_KEYS.transactions)).toBeNull();
    expect(storage.getItem(STORAGE_KEYS.goals)).toBeNull();
    expect(storage.getItem(STORAGE_KEYS.savings_balance)).toBeNull();
    expect(storage.getItem(STORAGE_KEYS.total_deducted)).toBeNull();
    expect(storage.getItem(STORAGE_KEYS.auto_invest_percent)).toBeNull();
    expect(storage.getItem(STORAGE_KEYS.auto_save_percent)).toBeNull();
  });

  test("corrupted JSON falls back to defaults without throwing", async () => {
    const { store, storage } = makeStore();
    storage.setItem(STORAGE_KEYS.transactions, "{not json");
    storage.setItem(STORAGE_KEYS.goals, "{also not json");
    storage.setItem(STORAGE_KEYS.savings_balance, "not-a-number");

    expect(await store.listTransactions()).toEqual([]);
    expect(await store.listGoals()).toEqual([]);
    expect(await store.getSettings()).toEqual({
      savingsBalance: 0,
      totalDeducted: 0,
      autoInvestPercent: 0,
      autoSavePercent: 0,
    });
  });
});
