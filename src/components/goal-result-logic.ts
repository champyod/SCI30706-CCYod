import { goalProgress } from "../lib/finance";
import { calcCompoundInterest } from "../lib/interest";
import { formatBaht } from "../lib/money";
import type { Goal } from "../lib/types";

const MONTHLY_INTEREST_RATE = 0.01;
const DAYS_PER_MONTH = 30;

export function dailyRequiredSavings(goal: Goal): number {
  return (goal.target - goal.current) / goal.duration;
}

export function isGoalAchieved(goal: Goal): boolean {
  return goalProgress(goal) >= 1;
}

export function buildInterestHint(goal: Goal): string {
  const months = goal.duration / DAYS_PER_MONTH;
  const projected = calcCompoundInterest(
    goal.current,
    MONTHLY_INTEREST_RATE,
    months,
  );
  return `At 1% monthly compounding, your current ${formatBaht(goal.current)} could grow to about ${formatBaht(projected)} over this goal's ${goal.duration} days.`;
}