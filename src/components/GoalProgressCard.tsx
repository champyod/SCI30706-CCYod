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
    <article className="w-full rounded-xl border border-edge bg-card p-4 shadow-sm">
      <h3 className="text-base font-bold text-ink">{goal.name}</h3>
      <div
        className="mb-2 h-2.5 w-full overflow-hidden rounded-full bg-aqua-light"
        role="progressbar"
        aria-label={goal.name}
        aria-valuemin={0}
        aria-valuemax={BAR_MAX_PERCENT}
        aria-valuenow={percent}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-aqua to-green"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="m-0 text-sm font-medium text-ink-dim">
        {`${formatBaht(goal.current)} / ${formatBaht(goal.target)}`}
      </p>
    </article>
  );
}