import { describe, expect, test } from "bun:test";
import type { Tx } from "../src/lib/types";
import {
  categoryBreakdown,
  incomeVsExpense,
  monthlySeries,
} from "../src/lib/chart-data";

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

describe("monthlySeries", () => {
  test("returns expense totals per month in order", () => {
    const txs: Tx[] = [
      makeTx({ id: "a", type: "expense", amount: 100, date: "2026-01-10" }),
      makeTx({ id: "b", type: "expense", amount: 250, date: "2026-01-20" }),
      makeTx({ id: "c", type: "expense", amount: 75, date: "2026-02-05" }),
    ];
    expect(monthlySeries(txs, ["2026-01", "2026-02", "2026-03"])).toEqual([
      350, 75, 0,
    ]);
  });

  test("ignores income txs", () => {
    const txs: Tx[] = [
      makeTx({ id: "a", type: "income", amount: 500, date: "2026-01-10" }),
      makeTx({ id: "b", type: "expense", amount: 40, date: "2026-01-15" }),
    ];
    expect(monthlySeries(txs, ["2026-01"])).toEqual([40]);
  });

  test("returns zeros for empty txs", () => {
    expect(monthlySeries([], ["2026-01", "2026-02", "2026-03"])).toEqual([
      0, 0, 0,
    ]);
  });

  test("rounds totals to 2 decimals", () => {
    const txs: Tx[] = [
      makeTx({ id: "a", type: "expense", amount: 10.005, date: "2026-01-10" }),
    ];
    expect(monthlySeries(txs, ["2026-01"])).toEqual([10.01]);
  });
});

describe("categoryBreakdown", () => {
  test("merges same category and sorts descending", () => {
    const txs: Tx[] = [
      makeTx({ id: "a", type: "expense", category: "food", amount: 100 }),
      makeTx({ id: "b", type: "expense", category: "transport", amount: 300 }),
      makeTx({ id: "c", type: "expense", category: "food", amount: 50 }),
    ];
    expect(categoryBreakdown(txs)).toEqual([
      { category: "transport", total: 300 },
      { category: "food", total: 150 },
    ]);
  });

  test("ignores income txs", () => {
    const txs: Tx[] = [
      makeTx({ id: "a", type: "income", category: "salary", amount: 1000 }),
      makeTx({ id: "b", type: "expense", category: "food", amount: 80 }),
    ];
    expect(categoryBreakdown(txs)).toEqual([{ category: "food", total: 80 }]);
  });

  test("returns empty array when no expense txs", () => {
    expect(categoryBreakdown([])).toEqual([]);
  });

  test("rounds totals to 2 decimals", () => {
    const txs: Tx[] = [
      makeTx({ id: "a", type: "expense", category: "food", amount: 10.005 }),
    ];
    expect(categoryBreakdown(txs)).toEqual([{ category: "food", total: 10.01 }]);
  });
});

describe("incomeVsExpense", () => {
  test("returns a fixed 6-month window ending at the current month", () => {
    const now = new Date(2026, 7, 15); // 2026-08-15
    expect(incomeVsExpense([], now)).toEqual({
      labels: [
        "2026-03",
        "2026-04",
        "2026-05",
        "2026-06",
        "2026-07",
        "2026-08",
      ],
      income: [0, 0, 0, 0, 0, 0],
      expense: [0, 0, 0, 0, 0, 0],
    });
  });

  test("zero-fills months without transactions", () => {
    const txs: Tx[] = [
      makeTx({ id: "a", type: "income", amount: 1000, date: "2026-06-10" }),
      makeTx({ id: "b", type: "expense", amount: 200, date: "2026-08-05" }),
    ];
    const now = new Date(2026, 7, 15);
    expect(incomeVsExpense(txs, now)).toEqual({
      labels: [
        "2026-03",
        "2026-04",
        "2026-05",
        "2026-06",
        "2026-07",
        "2026-08",
      ],
      income: [0, 0, 0, 1000, 0, 0],
      expense: [0, 0, 0, 0, 0, 200],
    });
  });

  test("aggregates all txs per month per type", () => {
    const txs: Tx[] = [
      makeTx({ id: "a", type: "income", amount: 1000, date: "2026-08-02" }),
      makeTx({ id: "b", type: "income", amount: 500, date: "2026-08-10" }),
      makeTx({ id: "c", type: "expense", amount: 300, date: "2026-08-05" }),
      makeTx({ id: "d", type: "expense", amount: 50, date: "2026-08-15" }),
      makeTx({ id: "e", type: "expense", amount: 120, date: "2026-07-01" }),
    ];
    const now = new Date(2026, 7, 20);
    expect(incomeVsExpense(txs, now)).toEqual({
      labels: [
        "2026-03",
        "2026-04",
        "2026-05",
        "2026-06",
        "2026-07",
        "2026-08",
      ],
      income: [0, 0, 0, 0, 0, 1500],
      expense: [0, 0, 0, 0, 120, 350],
    });
  });

  test("rolls the window across a year boundary when now is in January", () => {
    const txs: Tx[] = [
      makeTx({ id: "a", type: "expense", amount: 100, date: "2025-08-05" }),
    ];
    const now = new Date(2026, 0, 15);
    expect(incomeVsExpense(txs, now)).toEqual({
      labels: [
        "2025-08",
        "2025-09",
        "2025-10",
        "2025-11",
        "2025-12",
        "2026-01",
      ],
      income: [0, 0, 0, 0, 0, 0],
      expense: [100, 0, 0, 0, 0, 0],
    });
  });

  test("returns aligned income and expense within the window", () => {
    const txs: Tx[] = [
      makeTx({ id: "a", type: "income", amount: 1000, date: "2026-02-10" }),
      makeTx({ id: "b", type: "expense", amount: 200, date: "2026-02-15" }),
      makeTx({ id: "c", type: "income", amount: 800, date: "2026-01-05" }),
      makeTx({ id: "d", type: "expense", amount: 100, date: "2026-01-20" }),
    ];
    const now = new Date(2026, 1, 15);
    expect(incomeVsExpense(txs, now)).toEqual({
      labels: [
        "2025-09",
        "2025-10",
        "2025-11",
        "2025-12",
        "2026-01",
        "2026-02",
      ],
      income: [0, 0, 0, 0, 800, 1000],
      expense: [0, 0, 0, 0, 100, 200],
    });
  });

  test("rounds values to 2 decimals", () => {
    const txs: Tx[] = [
      makeTx({ id: "a", type: "income", amount: 10.005, date: "2026-01-10" }),
      makeTx({ id: "b", type: "expense", amount: 5.005, date: "2026-01-10" }),
    ];
    const now = new Date(2026, 0, 10);
    expect(incomeVsExpense(txs, now)).toEqual({
      labels: [
        "2025-08",
        "2025-09",
        "2025-10",
        "2025-11",
        "2025-12",
        "2026-01",
      ],
      income: [0, 0, 0, 0, 0, 10.01],
      expense: [0, 0, 0, 0, 0, 5.01],
    });
  });
});