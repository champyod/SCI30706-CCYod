import type { ReactElement } from "react";
import type { Goal } from "../lib/types";
import { GoalProgressCard } from "./GoalProgressCard";
import { Icon } from "./Icon";
import { canPromote } from "./goal-list-logic";

export interface GoalListProps {
  goals: Goal[];
  pendingIds: Set<string>;
  onDelete: (id: string) => void;
  onPromote: (position: number) => void;
}

export function GoalList({
  goals,
  pendingIds,
  onDelete,
  onPromote,
}: GoalListProps): ReactElement {
  return (
    <ul className="m-0 flex list-none flex-col gap-3 p-0">
      {goals.map((goal, index) =>
        pendingIds.has(goal.id) ? (
          <li key={goal.id}>
            <GoalSkeleton />
          </li>
        ) : (
          <li key={goal.id} className="flex items-start gap-2">
            <GoalProgressCard goal={goal} />
            <div className="flex shrink-0 flex-col gap-1">
              <button
                type="button"
                className="cursor-pointer rounded-lg border border-edge bg-surface p-1.5 text-ink-dim transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                disabled={!canPromote(index)}
                aria-label={`Promote ${goal.name}`}
                onClick={() => onPromote(index)}
              >
                <Icon name="ArrowUp" />
              </button>
              <button
                type="button"
                className="cursor-pointer rounded-lg border border-edge bg-surface p-1.5 text-ink-dim transition-colors hover:border-expense hover:text-expense"
                aria-label={`Delete ${goal.name}`}
                onClick={() => onDelete(goal.id)}
              >
                <Icon name="Trash2" />
              </button>
            </div>
          </li>
        ),
      )}
    </ul>
  );
}

function GoalSkeleton(): ReactElement {
  return (
    <div className="animate-pulse rounded-xl border border-edge bg-card p-4">
      <div className="mb-2 h-4 w-2/3 rounded bg-aqua-light" />
      <div className="mb-2 h-3 w-full rounded bg-aqua-light" />
      <div className="h-3 w-1/2 rounded bg-aqua-light" />
    </div>
  );
}