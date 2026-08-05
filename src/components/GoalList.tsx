import type { ReactElement } from "react";
import type { Goal } from "../lib/types";
import { GoalProgressCard } from "./GoalProgressCard";
import { Icon } from "./Icon";
import { canPromote } from "./goal-list-logic";

export interface GoalListProps {
  goals: Goal[];
  onDelete: (id: string) => void;
  onPromote: (position: number) => void;
}

export function GoalList({
  goals,
  onDelete,
  onPromote,
}: GoalListProps): ReactElement {
  return (
    // No sort: the store hands goals already ordered by position, and the
    // array index IS the position AppStore.promoteGoal expects.
    <ul className="goal-list">
      {goals.map((goal, index) => (
        <li key={goal.id} className="goal-list-item">
          <GoalProgressCard goal={goal} />
          <div className="goal-actions">
            <button
              type="button"
              className="goal-promote"
              disabled={!canPromote(index)}
              aria-label={`Promote ${goal.name}`}
              onClick={() => onPromote(index)}
            >
              <Icon name="ArrowUp" />
            </button>
            <button
              type="button"
              className="goal-delete"
              aria-label={`Delete ${goal.name}`}
              onClick={() => onDelete(goal.id)}
            >
              <Icon name="Trash2" />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}