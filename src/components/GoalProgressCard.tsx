import type { ReactElement } from "react";
import { goalProgress } from "../lib/finance";
import { formatBaht } from "../lib/money";
import type { Goal } from "../lib/types";

const BAR_MAX_PERCENT = 100;

export interface GoalProgressCardProps {
  goal: Goal;
}

export function GoalProgressCard({ goal }: GoalProgressCardProps): ReactElement {
  const percent = Math.round(goalProgress(goal) * BAR_MAX_PERCENT);
  return (
    <article className="card">
      <h3 className="card-title">{goal.name}</h3>
      <div
        className="progress"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={BAR_MAX_PERCENT}
        aria-valuenow={percent}
      >
        {/* Width is layout data, so it is inline; color stays in CSS. */}
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
      <p className="goal-amounts">{`${formatBaht(goal.current)} / ${formatBaht(goal.target)}`}</p>
    </article>
  );
}
