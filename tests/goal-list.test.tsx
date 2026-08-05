import { describe, expect, mock, test } from "bun:test";
import { renderToString } from "react-dom/server";
import { GoalList } from "../src/components/GoalList";
import { canPromote } from "../src/components/goal-list-logic";
import type { Goal } from "../src/lib/types";

const FIRST_GOAL: Goal = {
  id: "g0",
  name: "Emergency Fund",
  target: 5000,
  current: 2500,
  mode: "daily",
  duration: 30,
  position: 0,
  createdAt: "c0",
};

const SECOND_GOAL: Goal = {
  id: "g1",
  name: "Vacation",
  target: 10000,
  current: 1000,
  mode: "weekly",
  duration: 60,
  position: 1,
  createdAt: "c1",
};

function countOccurrences(markup: string, needle: string): number {
  return markup.split(needle).length - 1;
}

describe("canPromote", () => {
  test("position 0 cannot promote", () => {
    expect(canPromote(0)).toBe(false);
  });

  test("any positive position can promote", () => {
    expect(canPromote(1)).toBe(true);
    expect(canPromote(3)).toBe(true);
  });

  test("negative positions cannot promote", () => {
    expect(canPromote(-1)).toBe(false);
  });
});

describe("GoalList", () => {
  const noopPromote = mock((_position: number): void => {});
  const noopDelete = mock((_id: string): void => {});

  test("renders one GoalProgressCard per goal", () => {
    const markup = renderToString(
      <GoalList goals={[FIRST_GOAL, SECOND_GOAL]} onDelete={noopDelete} onPromote={noopPromote} />,
    );
    expect(countOccurrences(markup, '<article class="card">')).toBe(2);
    expect(markup).toContain('<h3 class="card-title">Emergency Fund</h3>');
    expect(markup).toContain('<h3 class="card-title">Vacation</h3>');
  });

  test("renders a promote button per goal with the goal name in its label", () => {
    const markup = renderToString(
      <GoalList goals={[FIRST_GOAL, SECOND_GOAL]} onDelete={noopDelete} onPromote={noopPromote} />,
    );
    expect(markup).toContain('aria-label="Promote Emergency Fund"');
    expect(markup).toContain('aria-label="Promote Vacation"');
  });

  test("disables only the promote button at position 0", () => {
    const markup = renderToString(
      <GoalList goals={[FIRST_GOAL, SECOND_GOAL]} onDelete={noopDelete} onPromote={noopPromote} />,
    );
    expect(countOccurrences(markup, 'disabled=""')).toBe(1);
  });

  test("disables the promote button when it is the only goal", () => {
    const markup = renderToString(
      <GoalList goals={[FIRST_GOAL]} onDelete={noopDelete} onPromote={noopPromote} />,
    );
    expect(countOccurrences(markup, 'disabled=""')).toBe(1);
    expect(countOccurrences(markup, 'aria-label="Promote')).toBe(1);
  });

  test("renders a delete button per goal with the goal id in scope", () => {
    const markup = renderToString(
      <GoalList goals={[FIRST_GOAL, SECOND_GOAL]} onDelete={noopDelete} onPromote={noopPromote} />,
    );
    expect(markup).toContain('aria-label="Delete Emergency Fund"');
    expect(markup).toContain('aria-label="Delete Vacation"');
  });

  test("renders an empty list when there are no goals", () => {
    const markup = renderToString(
      <GoalList goals={[]} onDelete={noopDelete} onPromote={noopPromote} />,
    );
    expect(markup).toContain('<ul class="goal-list"></ul>');
  });
});