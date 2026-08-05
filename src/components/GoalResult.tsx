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
    <section className="card">
      <h3 className="card-title">{goal.name}</h3>
      {achieved && <span className="badge">Achieved</span>}
      <p className="goal-required">{`Daily required savings: ${formatBaht(required)}`}</p>
      {!achieved && <p className="goal-interest-hint">{buildInterestHint(goal)}</p>}
    </section>
  );
}