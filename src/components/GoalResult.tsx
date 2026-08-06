import type { ReactElement } from "react";
import { formatBaht } from "../lib/money";
import type { Goal } from "../lib/types";
import {
  buildInterestHint,
  dailyRequiredSavings,
  isGoalAchieved,
} from "./goal-result-logic";

export interface GoalResultProps {
  goal: Goal;
}

export function GoalResult({ goal }: GoalResultProps): ReactElement {
  const achieved = isGoalAchieved(goal);
  const required = dailyRequiredSavings(goal);
  return (
    <section className="rounded-2xl border border-edge bg-card p-4 shadow-sm">
      <h3 className="text-base font-bold text-ink">{goal.name}</h3>
      {achieved && (
        <span className="mt-1 inline-block rounded-full bg-green-light px-2 py-0.5 text-xs font-semibold text-green-dark">
          Achieved
        </span>
      )}
      <p className="mt-2 m-0 font-medium text-ink">{`Daily required savings: ${formatBaht(required)}`}</p>
      {!achieved && <p className="m-0 mt-1 text-sm text-ink-dim">{buildInterestHint(goal)}</p>}
    </section>
  );
}