import { describe, expect, test } from "bun:test";
import { SupabaseStore } from "../src/lib/storage/supabase";
import type { Settings } from "../src/lib/types";
import { FakeClient, makeFakeStore } from "./supabase-fake";
import type { Row } from "./supabase-fake";

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
  autoInvestPercent: 20,
  autoSavePercent: 10,
};

function txRow(id: string, createdAt: string): Row {
  return { id, type: "expense", category: "food", amount: 10, note: "a", date: "2026-08-01", created_at: createdAt };
}

function goalRow(id: string, position: number, name: string): Row {
  return { id, name, target: 10, current: 0, mode: "daily", duration: 30, position, created_at: "2026-08-01T00:00:00.000Z" };
}

describe("SupabaseStore transactions", () => {
  test("addTransaction inserts a snake_case row with generated id and createdAt", async () => {
    const { store, client } = makeFakeStore();
    const added = await store.addTransaction(txInput);

    expect(added.id).toBeTruthy();
    expect(added.createdAt).toBeTruthy();
    expect(client.transactions.rows).toHaveLength(1);
    const row = client.transactions.rows[0];
    expect(row?.id).toBe(added.id);
    expect(row?.created_at).toBe(added.createdAt);
    expect(row?.createdAt).toBeUndefined();
    expect(row?.type).toBe("expense");
  });

  test("listTransactions maps snake_case rows to camelCase domain fields", async () => {
    const { store, client } = makeFakeStore();
    client.transactions.rows = [
      { id: "t1", type: "income", category: "salary", amount: 1000, note: null, date: "2026-08-01", created_at: "2026-08-01T00:00:00.000Z" },
    ];

    const list = await store.listTransactions();

    expect(list).toHaveLength(1);
    expect(list[0]).toEqual({
      id: "t1",
      type: "income",
      category: "salary",
      amount: 1000,
      note: "",
      date: "2026-08-01",
      createdAt: "2026-08-01T00:00:00.000Z",
    });
  });

  test("listTransactions requests newest-first ordering by created_at", async () => {
    const { store, client } = makeFakeStore();
    client.transactions.rows = [txRow("old", "2026-08-01T00:00:00.000Z"), txRow("new", "2026-08-02T00:00:00.000Z")];

    const list = await store.listTransactions();

    expect(list[0]?.id).toBe("new");
    expect(list[1]?.id).toBe("old");
    expect(client.transactions.lastOrder).toEqual({ column: "created_at", ascending: false });
  });

  test("updateTransaction sends a snake_case patch filtered by id", async () => {
    const { store, client } = makeFakeStore();
    client.transactions.rows = [txRow("t1", "2026-08-01T00:00:00.000Z")];

    await store.updateTransaction("t1", { note: "changed", createdAt: "2026-09-01T00:00:00.000Z" });

    expect(client.transactions.rows[0]?.note).toBe("changed");
    expect(client.transactions.rows[0]?.created_at).toBe("2026-09-01T00:00:00.000Z");
    expect(client.transactions.rows[0]?.createdAt).toBeUndefined();
  });

  test("deleteTransaction removes only the row with the matching id", async () => {
    const { store, client } = makeFakeStore();
    client.transactions.rows = [txRow("t1", "2026-08-01T00:00:00.000Z"), txRow("t2", "2026-08-02T00:00:00.000Z")];

    await store.deleteTransaction("t1");

    expect(client.transactions.rows).toHaveLength(1);
    expect(client.transactions.rows[0]?.id).toBe("t2");
  });
});

describe("SupabaseStore goals", () => {
  test("listGoals orders by position ascending", async () => {
    const { store, client } = makeFakeStore();
    client.goals.rows = [goalRow("g1", 2, "b"), goalRow("g2", 0, "a"), goalRow("g3", 1, "c")];

    const list = await store.listGoals();

    expect(list.map((goal) => goal.position)).toEqual([0, 1, 2]);
    expect(client.goals.lastOrder).toEqual({ column: "position", ascending: true });
  });

  test("addGoal inserts a snake_case row with generated id and createdAt", async () => {
    const { store, client } = makeFakeStore();
    const added = await store.addGoal(goalInput);

    expect(added.id).toBeTruthy();
    expect(added.createdAt).toBeTruthy();
    expect(client.goals.rows).toHaveLength(1);
    expect(client.goals.rows[0]?.created_at).toBe(added.createdAt);
    expect(client.goals.rows[0]?.createdAt).toBeUndefined();
  });

  test("updateGoal maps createdAt to created_at in the patch", async () => {
    const { store, client } = makeFakeStore();
    client.goals.rows = [goalRow("g1", 0, "a")];

    await store.updateGoal("g1", { name: "new-car", createdAt: "2026-09-01T00:00:00.000Z" });

    expect(client.goals.rows[0]?.name).toBe("new-car");
    expect(client.goals.rows[0]?.created_at).toBe("2026-09-01T00:00:00.000Z");
  });

  test("deleteGoal removes only the matching goal", async () => {
    const { store, client } = makeFakeStore();
    client.goals.rows = [goalRow("g1", 0, "a"), goalRow("g2", 1, "b")];

    await store.deleteGoal("g1");

    expect(client.goals.rows).toHaveLength(1);
    expect(client.goals.rows[0]?.id).toBe("g2");
  });
});

describe("SupabaseStore settings", () => {
  test("getSettings returns defaults when the settings table is empty", async () => {
    const { store } = makeFakeStore();
    expect(await store.getSettings()).toEqual({
      savingsBalance: 0,
      autoInvestPercent: 0,
      autoSavePercent: 0,
    });
  });

  test("getSettings maps stored key-value rows and falls back per missing key", async () => {
    const { store, client } = makeFakeStore();
    client.settings.rows = [
      { id: 4, key: "auto_invest_percent", value: 30 },
    ];

    const settings = await store.getSettings();

    expect(settings).toEqual({
      savingsBalance: 0,
      autoInvestPercent: 30,
      autoSavePercent: 0,
    });
  });

  test("getSettings falls back to default for non-numeric values", async () => {
    const { store, client } = makeFakeStore();
    client.settings.rows = [
      { id: 2, key: "savings_balance", value: "abc" },
      { id: 4, key: "auto_invest_percent", value: "nope" },
      { id: 5, key: "auto_save_percent", value: 5 },
    ];

    const settings = await store.getSettings();

    expect(settings).toEqual({
      savingsBalance: 0,
      autoInvestPercent: 0,
      autoSavePercent: 5,
    });
  });

  test("saveSettings upserts the three keys with deterministic ids on key conflict", async () => {
    const { store, client } = makeFakeStore();

    await store.saveSettings(settingsInput);

    expect(client.settings.lastUpsertConflict).toBe("key");
    expect(client.settings.rows).toHaveLength(3);
    const balance = client.settings.rows.find((row) => row.key === "savings_balance");
    expect(balance?.id).toBe(2);
    expect(balance?.value).toBe(500);
    const invest = client.settings.rows.find((row) => row.key === "auto_invest_percent");
    expect(invest?.id).toBe(4);
    expect(invest?.value).toBe(20);
    const save = client.settings.rows.find((row) => row.key === "auto_save_percent");
    expect(save?.id).toBe(5);
    expect(save?.value).toBe(10);
    expect(await store.getSettings()).toEqual(settingsInput);
  });

  test("saveSettings replaces existing rows for the same keys", async () => {
    const { store, client } = makeFakeStore();
    client.settings.rows = [{ id: 2, key: "savings_balance", value: 1 }];

    await store.saveSettings({ savingsBalance: 10, autoInvestPercent: 0, autoSavePercent: 0 });

    expect(client.settings.rows).toHaveLength(3);
  });
});

describe("SupabaseStore error wrapping", () => {
  test("select failure wraps the PostgREST error in a Thai message", async () => {
    const { store, client } = makeFakeStore();
    client.transactions.error = { message: "relation does not exist" };

    await expect(store.listTransactions()).rejects.toThrow("ไม่สามารถโหลดรายการธุรกรรมได้");
  });

  test("network rejection is wrapped in a Thai message and not swallowed", async () => {
    const { store, client } = makeFakeStore();
    client.goals.rejectWith = new Error("fetch failed");

    await expect(store.listGoals()).rejects.toThrow("ไม่สามารถโหลดเป้าหมายได้");
    await expect(store.listGoals()).rejects.toThrow("fetch failed");
  });

  test("insert failure on addGoal throws a Thai message", async () => {
    const { store, client } = makeFakeStore();
    client.goals.error = { message: "duplicate key" };

    await expect(store.addGoal(goalInput)).rejects.toThrow("ไม่สามารถบันทึกเป้าหมายได้");
  });

  test("saveSettings failure throws a Thai message", async () => {
    const { store, client } = makeFakeStore();
    client.settings.error = { message: "permission denied" };

    await expect(store.saveSettings(settingsInput)).rejects.toThrow("ไม่สามารถบันทึกการตั้งค่าได้");
  });
});
