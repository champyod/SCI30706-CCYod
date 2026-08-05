import { describe, expect, test } from "bun:test";
import { renderToString } from "react-dom/server";
import { GoalResult } from "../src/components/GoalResult";
import {
  buildInterestHint,
  dailyRequiredSavings,
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

const HINT_GOAL: Goal = {
  id: "g3",
  name: "Hint Fund",
  target: 5000,
  current: 2500,
  mode: "daily",
  duration: 30,
  position: 0,
  createdAt: "c3",
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

describe("goal-result logic", () => {
  test("dailyRequiredSavings divides the remaining amount by duration", () => {
    expect(dailyRequiredSavings(IN_PROGRESS_GOAL)).toBe(50);
  });

  test("isGoalAchieved is true when progress reaches 1", () => {
    expect(isGoalAchieved(ACHIEVED_GOAL)).toBe(true);
    expect(isGoalAchieved(IN_PROGRESS_GOAL)).toBe(false);
  });

  test("buildInterestHint projects the current balance with monthly compounding", () => {
    const hint = buildInterestHint(HINT_GOAL);
    expect(hint).toContain("2,525.00");
    expect(hint).toContain("2,500.00");
    expect(hint).toContain("30 days");
  });
});

describe("GoalResult", () => {
  test("shows the formatted daily required savings", () => {
    const markup = renderToString(<GoalResult goal={IN_PROGRESS_GOAL} />);
    expect(markup).toContain('<p class="goal-required">Daily required savings: 50.00</p>');
  });

  test("shows the interest hint while the goal is not achieved", () => {
    const markup = renderToString(<GoalResult goal={IN_PROGRESS_GOAL} />);
    expect(markup).toContain('class="goal-interest-hint"');
  });

  test("shows no achieved badge while the goal is not achieved", () => {
    const markup = renderToString(<GoalResult goal={IN_PROGRESS_GOAL} />);
    expect(markup).not.toContain('class="badge"');
  });

  test("shows the achieved badge and hides the hint when progress reaches 1", () => {
    const markup = renderToString(<GoalResult goal={ACHIEVED_GOAL} />);
    expect(markup).toContain('<span class="badge">Achieved</span>');
    expect(markup).not.toContain('class="goal-interest-hint"');
  });
});