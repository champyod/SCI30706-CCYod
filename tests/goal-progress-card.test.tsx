import { describe, expect, test } from "bun:test";
import { renderToString } from "react-dom/server";
import { GoalProgressCard } from "../src/components/GoalProgressCard";
import type { Goal } from "../src/lib/types";

const HALF_GOAL: Goal = {
  id: "g1",
  name: "Emergency Fund",
  target: 5000,
  current: 2500,
  mode: "daily",
  duration: 30,
  position: 1,
  createdAt: "c1",
};

describe("GoalProgressCard", () => {
  test("renders the card with the goal title", () => {
    const markup = renderToString(<GoalProgressCard goal={HALF_GOAL} />);
    expect(markup).toContain('<article class="card">');
    expect(markup).toContain('<h3 class="card-title">Emergency Fund</h3>');
  });

  test("renders an accessible progressbar with rounded percent", () => {
    const markup = renderToString(<GoalProgressCard goal={HALF_GOAL} />);
    expect(markup).toContain('role="progressbar"');
    expect(markup).toContain('aria-valuemin="0"');
    expect(markup).toContain('aria-valuemax="100"');
    expect(markup).toContain('aria-valuenow="50"');
  });

  test("sets the fill width to the percent", () => {
    const markup = renderToString(<GoalProgressCard goal={HALF_GOAL} />);
    expect(markup).toContain('<div class="progress-fill" style="width:50%"></div>');
  });

  test("shows current and target amounts", () => {
    const markup = renderToString(<GoalProgressCard goal={HALF_GOAL} />);
    expect(markup).toContain('<p class="goal-amounts">2,500.00 / 5,000.00</p>');
  });

  test("rounds a non-integer percent for aria-valuenow", () => {
    const thirdGoal: Goal = { ...HALF_GOAL, current: 100, target: 300 };
    const markup = renderToString(<GoalProgressCard goal={thirdGoal} />);
    expect(markup).toContain('aria-valuenow="33"');
    expect(markup).toContain('style="width:33%"');
  });
});