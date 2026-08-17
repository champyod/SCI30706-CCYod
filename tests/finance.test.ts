import { describe, expect, test } from "bun:test";
import type { Goal, Settings, Tx } from "../src/lib/types";
import {
  freeBalance,
  goalProgress,
  goalsInvested,
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

function makeGoal(partial: Partial<Goal> = {}): Goal {
  return {
    id: "g1",
    name: "savings",
    target: 100,
    current: 0,
    mode: "daily",
    duration: 30,
    position: 0,
    createdAt: "2026-08-05T00:00:00Z",
    ...partial,
  };
}

function makeSettings(partial: Partial<Settings> = {}): Settings {
  return {
    savingsBalance: 0,
    autoInvestPercent: 0,
    autoSavePercent: 0,
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

describe("goalsInvested", () => {
  test("sums current across goals", () => {
    const goals = [
      makeGoal({ id: "a", current: 100 }),
      makeGoal({ id: "b", current: 250.5 }),
    ];
    expect(goalsInvested(goals)).toBe(350.5);
  });

  test("returns 0 for an empty list", () => {
    expect(goalsInvested([])).toBe(0);
  });
});

describe("freeBalance", () => {
  test("income minus expense minus goals minus savings", () => {
    const txs: Tx[] = [
      makeTx({ id: "a", type: "income", amount: 5000 }),
      makeTx({ id: "b", type: "expense", amount: 1200.5 }),
    ];
    const goals = [makeGoal({ id: "a", current: 1500 })];
    const settings = makeSettings({ savingsBalance: 400 });
    expect(freeBalance(txs, goals, settings)).toBe(1899.5);
  });

  test("returns 0 for empty txs, goals, and default settings", () => {
    expect(freeBalance([], [], makeSettings())).toBe(0);
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