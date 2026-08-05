import { useState } from "react";
import type { ChangeEvent, FormEvent, ReactElement } from "react";
import type { GoalFormValues, GoalInput } from "./goal-form-logic";
import { EMPTY_FORM_VALUES, parseMode, submitGoal } from "./goal-form-logic";

const TEXT_FIELDS = ["name", "target", "current", "duration"] as const;
type TextField = (typeof TEXT_FIELDS)[number];

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

  function handleCurrentChange(event: ChangeEvent<HTMLInputElement>): void {
    updateTextField("current", event.target.value);
  }

  function handleDurationChange(event: ChangeEvent<HTMLInputElement>): void {
    updateTextField("duration", event.target.value);
  }

  function handleModeChange(event: ChangeEvent<HTMLSelectElement>): void {
    const mode = parseMode(event.target.value);
    if (mode !== null) {
      setValues((current) => ({ ...current, mode }));
    }
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
    // noValidate keeps native browser validation out so parseAmount/parseDuration own the error text.
    <form className="goal-form" onSubmit={handleSubmit} noValidate>
      <label className="goal-form-field">
        Name
        <input
          type="text"
          name="name"
          value={values.name}
          onChange={handleNameChange}
        />
      </label>
      <label className="goal-form-field">
        Target (Baht)
        <input
          type="text"
          name="target"
          inputMode="decimal"
          value={values.target}
          onChange={handleTargetChange}
        />
      </label>
      <label className="goal-form-field">
        Current (Baht)
        <input
          type="text"
          name="current"
          inputMode="decimal"
          value={values.current}
          onChange={handleCurrentChange}
        />
      </label>
      <label className="goal-form-field">
        Mode
        <select name="mode" value={values.mode} onChange={handleModeChange}>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
        </select>
      </label>
      <label className="goal-form-field">
        Duration (days)
        <input
          type="text"
          name="duration"
          inputMode="numeric"
          value={values.duration}
          onChange={handleDurationChange}
        />
      </label>
      {error !== null && (
        <p className="goal-form-error" role="alert">
          {error}
        </p>
      )}
      <button type="submit">Add Goal</button>
    </form>
  );
}