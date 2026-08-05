import type { Goal, Settings, Tx, TxType } from "./types";

function round(value: number, precision: number): number {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

export function sumByType(txs: Tx[], type: TxType): number {
  return txs.reduce((total, tx) => (tx.type === type ? total + tx.amount : total), 0);
}

export function applyDeduction(income: number, rate: number): { savings: number; deducted: number } {
  const rawDeducted = income * rate;
  const rawSavings = income - rawDeducted;
  return { savings: round(rawSavings, 2), deducted: round(rawDeducted, 2) };
}

export function getBalance(income: number, expenses: number): number {
  return round(income - expenses, 2);
}

export function currentBalance(txs: Tx[], settings: Settings): number {
  const balance = sumByType(txs, "income") - sumByType(txs, "expense") - settings.totalDeducted + settings.savingsBalance;
  return round(balance, 2);
}

export function goalProgress(goal: Goal): number {
  if (goal.target <= 0 || goal.current <= 0) return 0;
  return round(Math.min(1, goal.current / goal.target), 4);
}
