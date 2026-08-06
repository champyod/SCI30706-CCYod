import { goalProgress } from "../lib/finance";
import type { Goal } from "../lib/types";

export function dailyRequiredSavings(goal: Goal): number {
  return (goal.target - goal.current) / goal.duration;
}

export function goalProgressPercent(goal: Goal): number {
  return Math.round(goalProgress(goal) * 100);
}

export function isGoalAchieved(goal: Goal): boolean {
  return goalProgress(goal) >= 1;
}
