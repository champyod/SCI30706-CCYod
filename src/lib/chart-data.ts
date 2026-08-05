import type { Tx } from "./types";

type CategoryTotal = { category: string; total: number };

interface IncomeVsExpense {
  labels: string[];
  income: number[];
  expense: number[];
}

function round(value: number, precision: number): number {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

function monthKeyOf(tx: Tx): string {
  return tx.date.slice(0, 7);
}

export function monthlySeries(txs: Tx[], months: string[]): number[] {
  return months.map((month) =>
    round(
      txs
        .filter((tx) => tx.type === "expense" && monthKeyOf(tx) === month)
        .reduce((sum, tx) => sum + tx.amount, 0),
      2,
    ),
  );
}

export function categoryBreakdown(txs: Tx[]): CategoryTotal[] {
  const totals: Record<string, number> = {};
  for (const tx of txs) {
    if (tx.type !== "expense") continue;
    totals[tx.category] = (totals[tx.category] ?? 0) + tx.amount;
  }
  return Object.keys(totals)
    .map((category) => ({ category, total: round(totals[category] ?? 0, 2) }))
    .sort((a, b) => b.total - a.total);
}

export function incomeVsExpense(txs: Tx[]): IncomeVsExpense {
  const incomeByMonth: Record<string, number> = {};
  const expenseByMonth: Record<string, number> = {};
  for (const tx of txs) {
    const month = monthKeyOf(tx);
    if (tx.type === "income") {
      incomeByMonth[month] = (incomeByMonth[month] ?? 0) + tx.amount;
    } else {
      expenseByMonth[month] = (expenseByMonth[month] ?? 0) + tx.amount;
    }
  }
  const labels = Object.keys(incomeByMonth)
    .concat(Object.keys(expenseByMonth))
    .filter((month, index, all) => all.indexOf(month) === index)
    .sort();
  const income = labels.map((month) => round(incomeByMonth[month] ?? 0, 2));
  const expense = labels.map((month) => round(expenseByMonth[month] ?? 0, 2));
  return { labels, income, expense };
}
