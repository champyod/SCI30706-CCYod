import type { Goal, Settings, Tx, TxType } from "./types";

function round(value: number, precision: number): number {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

export function sumByType(txs: Tx[], type: TxType): number {
  return txs.reduce((total, tx) => (tx.type === type ? total + tx.amount : total), 0);
}

export function goalProgress(goal: Goal): number {
  if (goal.target <= 0 || goal.current <= 0) return 0;
  return round(Math.min(1, goal.current / goal.target), 4);
}

export function goalsInvested(goals: Goal[]): number {
  return round(goals.reduce((total, goal) => total + goal.current, 0), 2);
}

/**
 * Money left after expenses and money committed to savings + goals.
 * income − expense − Σgoal.current − savingsBalance. totalDeducted is a legacy
 * field and is intentionally not deducted.
 */
export function freeBalance(txs: Tx[], goals: Goal[], settings: Settings): number {
  const balance = sumByType(txs, "income") - sumByType(txs, "expense") - goalsInvested(goals) - settings.savingsBalance;
  return round(balance, 2);
}
