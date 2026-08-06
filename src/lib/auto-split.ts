import type { Goal, Settings } from "./types";

export interface GoalDelta {
  goalId: string;
  amount: number;
}

export interface AutoSplitResult {
  goalDeltas: GoalDelta[];
  saveAmount: number;
  leftover: number;
}

export const MAX_SPLIT_PERCENT = 100;
export const MAX_AUTO_PERCENT = 100;

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function clampPercent(value: number): number {
  return Math.min(MAX_AUTO_PERCENT, Math.max(0, value));
}

/**
 * Validate the two auto-percent settings. Each must be 0–100 and their sum must
 * not exceed 100 (invest + save cannot consume more than the full income).
 */
export function validateAutoSplitPercents(
  investPercent: number,
  savePercent: number,
): { isValid: boolean; error?: string } {
  const isValidRange =
    Number.isFinite(investPercent) &&
    Number.isFinite(savePercent) &&
    investPercent >= 0 &&
    investPercent <= MAX_AUTO_PERCENT &&
    savePercent >= 0 &&
    savePercent <= MAX_AUTO_PERCENT;
  if (!isValidRange) {
    return { isValid: false, error: "Each percent must be between 0 and 100." };
  }
  if (investPercent + savePercent > MAX_SPLIT_PERCENT) {
    return { isValid: false, error: "Auto-invest + auto-save cannot exceed 100%." };
  }
  return { isValid: true };
}

/**
 * Split an income transaction into goal contributions and savings. Invested
 * money fills the top goal first (array order), rolling the remainder into the
 * next goal; each goal is capped at target − current. Whatever is not committed
 * stays as free leftover.
 */
export function computeAutoSplit(
  income: number,
  goals: Goal[],
  settings: Settings,
): AutoSplitResult {
  const investRaw = (income * clampPercent(settings.autoInvestPercent)) / MAX_SPLIT_PERCENT;
  const saveAmount = round2((income * clampPercent(settings.autoSavePercent)) / MAX_SPLIT_PERCENT);
  let remaining = round2(investRaw);
  const goalDeltas: GoalDelta[] = [];

  for (const goal of goals) {
    if (remaining <= 0) {
      break;
    }
    const room = round2(Math.max(0, goal.target - goal.current));
    if (room <= 0) {
      continue;
    }
    const add = round2(Math.min(remaining, room));
    goalDeltas.push({ goalId: goal.id, amount: add });
    remaining = round2(remaining - add);
  }

  const committedToGoals = round2(goalDeltas.reduce((total, delta) => total + delta.amount, 0));
  const leftover = round2(income - committedToGoals - saveAmount);
  return { goalDeltas, saveAmount, leftover };
}

export function applyGoalDeltas(goals: Goal[], deltas: GoalDelta[]): Goal[] {
  if (deltas.length === 0) {
    return goals;
  }
  const byId = new Map(deltas.map((delta) => [delta.goalId, delta.amount]));
  return goals.map((goal) => {
    const add = byId.get(goal.id);
    return add === undefined ? goal : { ...goal, current: round2(goal.current + add) };
  });
}