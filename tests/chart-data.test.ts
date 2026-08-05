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
  test("returns ascending labels with aligned income and expense", () => {
    const txs: Tx[] = [
      makeTx({ id: "a", type: "income", amount: 1000, date: "2026-02-10" }),
      makeTx({ id: "b", type: "expense", amount: 200, date: "2026-02-15" }),
      makeTx({ id: "c", type: "income", amount: 800, date: "2026-01-05" }),
      makeTx({ id: "d", type: "expense", amount: 100, date: "2026-01-20" }),
    ];
    expect(incomeVsExpense(txs)).toEqual({
      labels: ["2026-01", "2026-02"],
      income: [800, 1000],
      expense: [100, 200],
    });
  });

  test("returns empty arrays for empty txs", () => {
    expect(incomeVsExpense([])).toEqual({ labels: [], income: [], expense: [] });
  });

  test("rounds values to 2 decimals", () => {
    const txs: Tx[] = [
      makeTx({ id: "a", type: "income", amount: 10.005, date: "2026-01-10" }),
      makeTx({ id: "b", type: "expense", amount: 5.005, date: "2026-01-10" }),
    ];
    expect(incomeVsExpense(txs)).toEqual({
      labels: ["2026-01"],
      income: [10.01],
      expense: [5.01],
    });
  });
});