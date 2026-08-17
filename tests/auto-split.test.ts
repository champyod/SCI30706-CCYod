import { describe, expect, test } from "bun:test";
import {
  applyGoalDeltas,
  computeAutoSplit,
  validateAutoSplitPercents,
} from "../src/lib/auto-split";
import type { Goal, Settings } from "../src/lib/types";

function makeGoal(partial: Partial<Goal> = {}): Goal {
  return {
    id: "g1",
    name: "savings",
    target: 1000,
    current: 0,
    mode: "daily",
    duration: 30,
    position: 0,
    createdAt: "2026-08-05T00:00:00Z",
    ...partial,
  };
}

function makeSettings(partial: Partial<Settings> = {}): Settings {
  return {
    savingsBalance: 0,
    autoInvestPercent: 0,
    autoSavePercent: 0,
    ...partial,
  };
}

describe("validateAutoSplitPercents", () => {
  test("accepts values in range whose sum is at most 100", () => {
    expect(validateAutoSplitPercents(0, 0).isValid).toBe(true);
    expect(validateAutoSplitPercents(50, 50).isValid).toBe(true);
    expect(validateAutoSplitPercents(100, 0).isValid).toBe(true);
    expect(validateAutoSplitPercents(0, 100).isValid).toBe(true);
  });

  test("rejects percents outside 0-100", () => {
    expect(validateAutoSplitPercents(-1, 0).isValid).toBe(false);
    expect(validateAutoSplitPercents(101, 0).isValid).toBe(false);
    expect(validateAutoSplitPercents(50, 101).isValid).toBe(false);
  });

  test("rejects sums above 100", () => {
    const result = validateAutoSplitPercents(60, 50);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain("cannot exceed 100%");
  });
});

describe("computeAutoSplit", () => {
  test("no split when percents are zero", () => {
    const result = computeAutoSplit(1000, [makeGoal()], makeSettings());
    expect(result).toEqual({ goalDeltas: [], saveAmount: 0, leftover: 1000 });
  });

  test("splits invest and save percentages, leftover stays free", () => {
    const result = computeAutoSplit(1000, [makeGoal()], makeSettings({ autoInvestPercent: 50, autoSavePercent: 10 }));
    expect(result.goalDeltas).toEqual([{ goalId: "g1", amount: 500 }]);
    expect(result.saveAmount).toBe(100);
    expect(result.leftover).toBe(400);
  });

  test("fills the top goal first then rolls over to the next", () => {
    const goals = [
      makeGoal({ id: "a", target: 100 }),
      makeGoal({ id: "b", target: 1000 }),
    ];
    const result = computeAutoSplit(1000, goals, makeSettings({ autoInvestPercent: 50 }));
    expect(result.goalDeltas).toEqual([
      { goalId: "a", amount: 100 },
      { goalId: "b", amount: 400 },
    ]);
    expect(result.leftover).toBe(500);
  });

  test("skips achieved goals with no room", () => {
    const goals = [makeGoal({ id: "a", target: 100, current: 100 })];
    const result = computeAutoSplit(1000, goals, makeSettings({ autoInvestPercent: 50 }));
    expect(result.goalDeltas).toEqual([]);
    expect(result.leftover).toBe(1000);
  });

  test("clamps percents outside 0-100", () => {
    const result = computeAutoSplit(1000, [makeGoal()], makeSettings({ autoInvestPercent: 150, autoSavePercent: -10 }));
    expect(result.goalDeltas).toEqual([{ goalId: "g1", amount: 1000 }]);
    expect(result.saveAmount).toBe(0);
    expect(result.leftover).toBe(0);
  });

  test("rounds amounts to 2 decimals", () => {
    const result = computeAutoSplit(10.06, [makeGoal()], makeSettings({ autoInvestPercent: 10 }));
    expect(result.goalDeltas[0]?.amount).toBe(1.01);
  });

  test("handles no goals gracefully", () => {
    const result = computeAutoSplit(500, [], makeSettings({ autoInvestPercent: 20, autoSavePercent: 30 }));
    expect(result.goalDeltas).toEqual([]);
    expect(result.saveAmount).toBe(150);
    expect(result.leftover).toBe(350);
  });
});

describe("applyGoalDeltas", () => {
  test("adds the delta to the matching goal and leaves others untouched", () => {
    const goals = [makeGoal({ id: "a", current: 10 }), makeGoal({ id: "b", current: 20 })];
    const next = applyGoalDeltas(goals, [{ goalId: "a", amount: 100 }]);
    expect(next[0]?.current).toBe(110);
    expect(next[1]?.current).toBe(20);
  });

  test("returns the same array when there are no deltas", () => {
    const goals = [makeGoal()];
    expect(applyGoalDeltas(goals, [])).toBe(goals);
  });

  test("ignores deltas whose goal id is missing", () => {
    const goals = [makeGoal({ id: "a", current: 10 })];
    const next = applyGoalDeltas(goals, [{ goalId: "ghost", amount: 100 }]);
    expect(next[0]?.current).toBe(10);
  });
});