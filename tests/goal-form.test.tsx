import { describe, expect, mock, test } from "bun:test";
import { renderToString } from "react-dom/server";
import { GoalForm } from "../src/components/GoalForm";
import {
  EMPTY_FORM_VALUES,
  parseDuration,
  parseMode,
  parseName,
  submitGoal,
  validateGoal,
} from "../src/components/goal-form-logic";
import type { GoalFormValues, GoalInput } from "../src/components/goal-form-logic";

const VALID_VALUES: GoalFormValues = {
  name: "Emergency Fund",
  target: "5000",
  current: "2500",
  mode: "daily",
  duration: "30",
};

const EXPECTED_INPUT: GoalInput = {
  name: "Emergency Fund",
  target: 5000,
  current: 2500,
  mode: "daily",
  duration: 30,
  position: 0,
};

describe("parse helpers", () => {
  test("parseName trims and rejects empty", () => {
    expect(parseName("  ")).toBeNull();
    expect(parseName("  Fund ")).toBe("Fund");
  });

  test("parseDuration accepts positive integers only", () => {
    expect(parseDuration("30")).toBe(30);
    expect(parseDuration("7.0")).toBe(7);
    expect(parseDuration("0")).toBeNull();
    expect(parseDuration("-4")).toBeNull();
    expect(parseDuration("3.5")).toBeNull();
    expect(parseDuration("abc")).toBeNull();
    expect(parseDuration("")).toBeNull();
  });

  test("parseMode accepts only daily and weekly", () => {
    expect(parseMode("daily")).toBe("daily");
    expect(parseMode("weekly")).toBe("weekly");
    expect(parseMode("monthly")).toBeNull();
  });
});

describe("validateGoal", () => {
  test("rejects empty name", () => {
    const result = validateGoal({ ...VALID_VALUES, name: " " });
    expect(result).toEqual({ error: "Name is required." });
  });

  test("rejects non-numeric target", () => {
    const result = validateGoal({ ...VALID_VALUES, target: "abc" });
    expect(result).toEqual({ error: "Target must be a positive number." });
  });

  test("rejects non-numeric current", () => {
    const result = validateGoal({ ...VALID_VALUES, current: "-5" });
    expect(result).toEqual({ error: "Current must be a positive number." });
  });

  test("rejects current above target", () => {
    const result = validateGoal({ ...VALID_VALUES, current: "6000" });
    expect(result).toEqual({ error: "Current cannot exceed target." });
  });

  test("rejects non-positive duration", () => {
    const result = validateGoal({ ...VALID_VALUES, duration: "0" });
    expect(result).toEqual({ error: "Duration must be a positive whole number of days." });
  });

  test("returns the goal input with position 0 on valid values", () => {
    expect(validateGoal(VALID_VALUES)).toEqual(EXPECTED_INPUT);
  });
});

describe("submitGoal", () => {
  test("calls onSubmit with the parsed input and returns null on valid values", () => {
    const onSubmit = mock((_input: GoalInput): void => {});
    const result = submitGoal(VALID_VALUES, onSubmit);
    expect(result).toBeNull();
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith(EXPECTED_INPUT);
  });

  test("returns the error and does not call onSubmit on invalid values", () => {
    const onSubmit = mock((_input: GoalInput): void => {});
    const result = submitGoal({ ...VALID_VALUES, name: "" }, onSubmit);
    expect(result).toBe("Name is required.");
    expect(onSubmit).toHaveBeenCalledTimes(0);
  });
});

describe("GoalForm", () => {
  test("renders all five controlled inputs", () => {
    const markup = renderToString(<GoalForm onSubmit={mock((_i: GoalInput): void => {})} />);
    expect(markup).toContain('<form class="goal-form"');
    expect(markup).toContain('name="name"');
    expect(markup).toContain('name="target"');
    expect(markup).toContain('name="current"');
    expect(markup).toContain('name="mode"');
    expect(markup).toContain('name="duration"');
  });

  test("renders daily and weekly mode options", () => {
    const markup = renderToString(<GoalForm onSubmit={mock((_i: GoalInput): void => {})} />);
    expect(markup).toContain('value="daily"');
    expect(markup).toContain('value="weekly"');
  });

  test("renders the submit button", () => {
    const markup = renderToString(<GoalForm onSubmit={mock((_i: GoalInput): void => {})} />);
    expect(markup).toContain('type="submit"');
  });

  test("renders no error on first paint", () => {
    const markup = renderToString(<GoalForm onSubmit={mock((_i: GoalInput): void => {})} />);
    expect(markup).not.toContain('class="goal-form-error"');
    expect(EMPTY_FORM_VALUES.mode).toBe("daily");
  });
});