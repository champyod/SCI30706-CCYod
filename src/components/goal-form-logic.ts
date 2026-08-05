import { parseAmount } from "../lib/money";
import type { Goal, GoalMode } from "../lib/types";

export type GoalInput = Omit<Goal, "id" | "createdAt">;

export interface GoalFormValues {
  name: string;
  target: string;
  current: string;
  mode: GoalMode;
  duration: string;
}

export const DEFAULT_MODE: GoalMode = "daily";

export const EMPTY_FORM_VALUES: GoalFormValues = {
  name: "",
  target: "",
  current: "",
  mode: DEFAULT_MODE,
  duration: "",
};

const ERRORS = {
  nameRequired: "Name is required.",
  targetInvalid: "Target must be a positive number.",
  currentInvalid: "Current must be a positive number.",
  currentOverTarget: "Current cannot exceed target.",
  durationInvalid: "Duration must be a positive whole number of days.",
} as const;

export function parseName(input: string): string | null {
  const name = input.trim();
  return name.length === 0 ? null : name;
}

export function parseDuration(input: string): number | null {
  const trimmed = input.trim();
  if (trimmed.length === 0) {
    return null;
  }
  const value = Number(trimmed);
  if (!Number.isInteger(value) || value <= 0) {
    return null;
  }
  return value;
}

export function parseMode(input: string): GoalMode | null {
  return input === "daily" || input === "weekly" ? input : null;
}

export function validateGoal(
  values: GoalFormValues,
): GoalInput | { error: string } {
  const name = parseName(values.name);
  if (name === null) {
    return { error: ERRORS.nameRequired };
  }
  const target = parseAmount(values.target);
  if (target === null) {
    return { error: ERRORS.targetInvalid };
  }
  const current = parseAmount(values.current);
  if (current === null) {
    return { error: ERRORS.currentInvalid };
  }
  if (current > target) {
    return { error: ERRORS.currentOverTarget };
  }
  const duration = parseDuration(values.duration);
  if (duration === null) {
    return { error: ERRORS.durationInvalid };
  }
  return { name, target, current, mode: values.mode, duration, position: 0 };
}

export function submitGoal(
  values: GoalFormValues,
  onSubmit: (input: GoalInput) => void,
): string | null {
  const result = validateGoal(values);
  if ("error" in result) {
    return result.error;
  }
  onSubmit(result);
  return null;
}