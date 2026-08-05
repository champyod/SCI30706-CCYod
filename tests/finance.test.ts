import { describe, expect, test } from "bun:test";
import type { Goal, Settings, Tx } from "../src/lib/types";
import {
  applyDeduction,
  currentBalance,
  getBalance,
  goalProgress,
  sumByType,
} from "../src/lib/finance";

function makeTx(partial: Partial<Tx>): Tx {
  return {
    id: "tx-1",
    type: "income",
    category: "salary",
    amount: 0,
    note: "",
    date: "2026-08-05",
    createdAt: "2026-08-05T00:00:00Z",
    ...partial,
  };
}

describe("sumByType", () => {
  const txs: Tx[] = [
    makeTx({ id: "a", type: "income", amount: 1000 }),
    makeTx({ id: "b", type: "expense", amount: 300 }),
    makeTx({ id: "c", type: "income", amount: 500 }),
    makeTx({ id: "d", type: "expense", amount: 120 }),
  ];

  test("sums income only", () => {
    expect(sumByType(txs, "income")).toBe(1500);
  });

  test("sums expense only", () => {
    expect(sumByType(txs, "expense")).toBe(420);
  });

  test("returns 0 for empty list", () => {
    expect(sumByType([], "income")).toBe(0);
  });
});

describe("applyDeduction", () => {
  test("deducts interest-rate slice from income", () => {
    expect(applyDeduction(1000, 0.015)).toEqual({ savings: 985, deducted: 15 });
  });

  test("returns zeros when income is 0", () => {
    expect(applyDeduction(0, 0.1)).toEqual({ savings: 0, deducted: 0 });
  });

  test("returns full income when rate is 0", () => {
    expect(applyDeduction(200, 0)).toEqual({ savings: 200, deducted: 0 });
  });

  test("rounds both values to 2 decimals", () => {
    expect(applyDeduction(10.05, 0.1)).toEqual({ savings: 9.05, deducted: 1.01 });
  });
});

describe("getBalance", () => {
  test("subtracts expenses from income", () => {
    expect(getBalance(1000, 400)).toBe(600);
  });

  test("returns 0 when both are 0", () => {
    expect(getBalance(0, 0)).toBe(0);
  });
});

describe("currentBalance", () => {
  test("applies settings adjustments to net income", () => {
    const txs: Tx[] = [
      makeTx({ id: "a", type: "income", amount: 1000 }),
      makeTx({ id: "b", type: "expense", amount: 300 }),
    ];
    const settings: Settings = { mode: "daily", savingsBalance: 15, totalDeducted: 15 };
    expect(currentBalance(txs, settings)).toBe(700);
  });

  test("returns 0 for empty txs and default settings", () => {
    const settings: Settings = { mode: "weekly", savingsBalance: 0, totalDeducted: 0 };
    expect(currentBalance([], settings)).toBe(0);
  });
});

describe("goalProgress", () => {
  test("returns ratio below 1", () => {
    const goal: Goal = {
      id: "g1",
      name: "savings",
      target: 100,
      current: 50,
      mode: "daily",
      duration: 30,
      position: 0,
      createdAt: "2026-08-05T00:00:00Z",
    };
    expect(goalProgress(goal)).toBe(0.5);
  });

  test("clamps to 1 when current exceeds target", () => {
    const goal: Goal = {
      id: "g2",
      name: "savings",
      target: 100,
      current: 200,
      mode: "daily",
      duration: 30,
      position: 0,
      createdAt: "2026-08-05T00:00:00Z",
    };
    expect(goalProgress(goal)).toBe(1);
  });

  test("returns 0 when current is 0", () => {
    const goal: Goal = {
      id: "g3",
      name: "savings",
      target: 100,
      current: 0,
      mode: "daily",
      duration: 30,
      position: 0,
      createdAt: "2026-08-05T00:00:00Z",
    };
    expect(goalProgress(goal)).toBe(0);
  });

  test("returns 0 when target is 0", () => {
    const goal: Goal = {
      id: "g4",
      name: "savings",
      target: 0,
      current: 50,
      mode: "daily",
      duration: 30,
      position: 0,
      createdAt: "2026-08-05T00:00:00Z",
    };
    expect(goalProgress(goal)).toBe(0);
  });
});