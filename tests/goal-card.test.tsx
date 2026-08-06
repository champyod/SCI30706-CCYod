import { describe, expect, mock, test } from "bun:test";
import { renderToString } from "react-dom/server";
import { GoalCard } from "../src/components/GoalCard";
import {
  dailyRequiredSavings,
  goalProgressPercent,
  isGoalAchieved,
} from "../src/components/goal-result-logic";
import type { Goal } from "../src/lib/types";

const IN_PROGRESS_GOAL: Goal = {
  id: "g1",
  name: "Emergency Fund",
  target: 5000,
  current: 2500,
  mode: "daily",
  duration: 50,
  position: 0,
  createdAt: "c1",
};

const ACHIEVED_GOAL: Goal = {
  id: "g2",
  name: "Vacation",
  target: 5000,
  current: 5000,
  mode: "weekly",
  duration: 30,
  position: 1,
  createdAt: "c2",
};

describe("goal-card logic", () => {
  test("dailyRequiredSavings divides the remaining amount by duration", () => {
    expect(dailyRequiredSavings(IN_PROGRESS_GOAL)).toBe(50);
  });

  test("goalProgressPercent rounds the progress ratio to a whole percent", () => {
    expect(goalProgressPercent(IN_PROGRESS_GOAL)).toBe(50);
    expect(goalProgressPercent(ACHIEVED_GOAL)).toBe(100);
  });

  test("isGoalAchieved is true when progress reaches 1", () => {
    expect(isGoalAchieved(ACHIEVED_GOAL)).toBe(true);
    expect(isGoalAchieved(IN_PROGRESS_GOAL)).toBe(false);
  });
});

describe("GoalCard", () => {
  test("shows the fill status with current and target amounts", () => {
    const markup = renderToString(
      <GoalCard goal={IN_PROGRESS_GOAL} pending={false} onInvest={mock(() => {})} onDelete={mock(() => {})} />,
    );
    expect(markup).toContain("50% filled (2,500.00 / 5,000.00)");
  });

  test("shows the estimated daily savings while the goal is not achieved", () => {
    const markup = renderToString(
      <GoalCard goal={IN_PROGRESS_GOAL} pending={false} onInvest={mock(() => {})} onDelete={mock(() => {})} />,
    );
    expect(markup).toContain("Est. 50.00 THB/day to reach your goal");
  });

  test("renders an invest form and delete button", () => {
    const markup = renderToString(
      <GoalCard goal={IN_PROGRESS_GOAL} pending={false} onInvest={mock(() => {})} onDelete={mock(() => {})} />,
    );
    expect(markup).toContain('name="invest-amount"');
    expect(markup).toContain(">Invest</button>");
    expect(markup).toContain(`aria-label="Delete ${IN_PROGRESS_GOAL.name}"`);
  });

  test("shows the achieved badge and hides the estimate when progress reaches 1", () => {
    const markup = renderToString(
      <GoalCard goal={ACHIEVED_GOAL} pending={false} onInvest={mock(() => {})} onDelete={mock(() => {})} />,
    );
    expect(markup).toContain(">Achieved</span>");
    expect(markup).not.toContain("THB/day");
  });

  test("disables invest while a goal is achieved", () => {
    const markup = renderToString(
      <GoalCard goal={ACHIEVED_GOAL} pending={false} onInvest={mock(() => {})} onDelete={mock(() => {})} />,
    );
    expect(markup).toContain('type="submit" disabled=""');
  });
});