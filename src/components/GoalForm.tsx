import { useState } from "react";
import type { ChangeEvent, FormEvent, ReactElement } from "react";
import type { GoalFormValues, GoalInput } from "./goal-form-logic";
import { EMPTY_FORM_VALUES, submitGoal } from "./goal-form-logic";

const TEXT_FIELDS = ["name", "target", "duration"] as const;
type TextField = (typeof TEXT_FIELDS)[number];

const INPUT_CLASS =
  "w-full rounded-lg border border-edge bg-surface px-3 py-2 text-ink outline-none transition-colors focus:border-primary";

export interface GoalFormProps {
  onSubmit: (input: GoalInput) => void;
}

export function GoalForm({ onSubmit }: GoalFormProps): ReactElement {
  const [values, setValues] = useState<GoalFormValues>(EMPTY_FORM_VALUES);
  const [error, setError] = useState<string | null>(null);

  function updateTextField(field: TextField, value: string): void {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function handleNameChange(event: ChangeEvent<HTMLInputElement>): void {
    updateTextField("name", event.target.value);
  }

  function handleTargetChange(event: ChangeEvent<HTMLInputElement>): void {
    updateTextField("target", event.target.value);
  }

  function handleDurationChange(event: ChangeEvent<HTMLInputElement>): void {
    updateTextField("duration", event.target.value);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const submitError = submitGoal(values, onSubmit);
    setError(submitError);
    if (submitError === null) {
      setValues(EMPTY_FORM_VALUES);
    }
  }

  return (
    <form
      className="mb-4 grid gap-3 rounded-xl border border-edge bg-card p-4 sm:grid-cols-2"
      onSubmit={handleSubmit}
      noValidate
    >
      <label className="text-sm font-medium text-ink">
        Name
        <input
          type="text"
          name="name"
          className={`${INPUT_CLASS} mt-1`}
          value={values.name}
          onChange={handleNameChange}
        />
      </label>
      <label className="text-sm font-medium text-ink">
        Target (Baht)
        <input
          type="text"
          name="target"
          inputMode="decimal"
          className={`${INPUT_CLASS} mt-1`}
          value={values.target}
          onChange={handleTargetChange}
        />
      </label>
      <label className="text-sm font-medium text-ink">
        Duration (days)
        <input
          type="text"
          name="duration"
          inputMode="numeric"
          className={`${INPUT_CLASS} mt-1`}
          value={values.duration}
          onChange={handleDurationChange}
        />
      </label>
      {error !== null && (
        <p className="m-0 text-sm text-expense" role="alert">
          {error}
        </p>
      )}
      <button
        type="submit"
        className="cursor-pointer rounded-lg bg-primary px-4 py-2 font-semibold text-on-primary transition-opacity hover:opacity-90 sm:col-span-2"
      >
        Add Goal
      </button>
    </form>
  );
}