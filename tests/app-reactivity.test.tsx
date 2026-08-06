import { afterEach, describe, expect, test } from "bun:test";
import { App } from "../src/components/App";
import { AppStore } from "../src/lib/store";
import type { DataStore } from "../src/lib/storage/datastore";
import type { Goal, Settings, Tx } from "../src/lib/types";
import { Window } from "happy-dom";

const DEFAULT_SETTINGS: Settings = {
  savingsBalance: 0,
  totalDeducted: 0,
  autoInvestPercent: 0,
  autoSavePercent: 0,
};

const txInput = {
  type: "expense" as const,
  category: "อาหาร",
  amount: 500,
  note: "test coffee",
  date: "2026-08-06",
};

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
      createdAt: "2026-08-06T00:00:00.000Z",
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
      createdAt: "2026-08-06T00:00:00.000Z",
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

  async clearAll(): Promise<void> {
    this.transactions = [];
    this.goals = [];
    this.settings = { ...DEFAULT_SETTINGS };
  }
}

let savedGlobals: { [key: string]: unknown } | undefined;

afterEach(() => {
  if (savedGlobals) {
    for (const [key, value] of Object.entries(savedGlobals)) {
      if (value === undefined) {
        delete (globalThis as Record<string, unknown>)[key];
      } else {
        (globalThis as Record<string, unknown>)[key] = value;
      }
    }
    savedGlobals = undefined;
  }
});

function mountApp(store: AppStore): Window {
  const window = new Window();
  // happy-dom reports canvas getContext support but returns null at runtime; setupCanvas no-ops.
  window.HTMLCanvasElement.prototype.getContext = () => null;
  // @ts-expect-error happy-dom lacks ResizeObserver in this version
  window.ResizeObserver = undefined;
  // react-dom reads the ambient `window` (event priority) — install globals.
  const globalKeys = ["window", "document", "navigator", "getComputedStyle"] as const;
  savedGlobals = {};
  for (const key of globalKeys) {
    savedGlobals[key] = (globalThis as Record<string, unknown>)[key];
  }
  Object.assign(globalThis, {
    window,
    document: window.document,
    navigator: window.navigator,
    getComputedStyle: window.getComputedStyle.bind(window),
  });
  const root = window.document.createElement("div");
  window.document.body.appendChild(root);

  const { createRoot } = require("react-dom/client");
  const { act } = require("react");
  act(() => {
    createRoot(root).render(<App store={store} />);
  });
  return window;
}

describe("App store reactivity", () => {
  test("UI re-renders after a transaction is added through the store", async () => {
    const { store } = { store: new AppStore(new FakeStore()) };
    await store.init();
    const window = mountApp(store);
    const { act } = require("react");

    expect(window.document.body.textContent ?? "").toContain("ยังไม่มีรายการ");

    await act(async () => {
      await store.addTx(txInput);
    });

    const text = window.document.body.textContent ?? "";
    expect(text).toContain("test coffee");
    expect(text).toContain("500.00");
    expect(text).not.toContain("ยังไม่มีรายการ");

    window.close();
  });

  test("summary cards update after the store mutation", async () => {
    const store = new AppStore(new FakeStore());
    await store.init();
    const window = mountApp(store);
    const { act } = require("react");

    await act(async () => {
      await store.addTx(txInput);
    });

    const text = window.document.body.textContent ?? "";
    expect(text).toContain("Saved");
    expect(text).toContain("In Goals");
    expect(text).toContain("Free Balance");
    expect(text).toContain("500.00");

    window.close();
  });

  test("version bumps on every mutation so useSyncExternalStore sees a change", async () => {
    const store = new AppStore(new FakeStore());
    await store.init();

    const before = store.version;
    await store.addTx(txInput);
    const afterAdd = store.version;
    await store.deleteTx(store.transactions[0]?.id ?? "missing");
    const afterDelete = store.version;

    expect(afterAdd).toBe(before + 1);
    expect(afterDelete).toBe(afterAdd + 1);
  });
});
