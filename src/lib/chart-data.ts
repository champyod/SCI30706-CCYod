import type { Tx } from "./types";

const CHART_MONTHS = 6;

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

function monthWindowLabels(now: Date): string[] {
  const currentMonth = now.getFullYear() * 12 + now.getMonth();
  const labels: string[] = [];
  for (let offset = CHART_MONTHS - 1; offset >= 0; offset--) {
    const total = currentMonth - offset;
    labels.push(
      `${Math.floor(total / 12)}-${String((total % 12) + 1).padStart(2, "0")}`,
    );
  }
  return labels;
}

export function incomeVsExpense(txs: Tx[], now: Date = new Date()): IncomeVsExpense {
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
  const labels = monthWindowLabels(now);
  const income = labels.map((month) => round(incomeByMonth[month] ?? 0, 2));
  const expense = labels.map((month) => round(expenseByMonth[month] ?? 0, 2));
  return { labels, income, expense };
}
