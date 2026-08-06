import { useState } from "react";
import type { FormEvent, ReactElement } from "react";
import { TX_TYPE_LABELS, categoryOptions, defaultTxForm, parseTxForm, withType } from "./tx-logic";
import type { TxFormState, TxFormDraft } from "./tx-logic";
import type { Tx, TxType } from "../lib/types";

export interface TxFormProps {
  onSubmit: (input: Omit<Tx, "id" | "createdAt">) => void;
}

const TX_TYPES: readonly TxType[] = ["income", "expense"];
const AMOUNT_INPUT_HINT = "เช่น 500 หรือ 1250.50";

const TYPE_PILL_CLASSES: Record<TxType, string> = {
  income: "border-green bg-green-light text-green-dark",
  expense: "border-expense bg-expense-light text-expense",
};

const INPUT_CLASS =
  "w-full rounded-lg border border-edge bg-surface px-3 py-2 text-ink outline-none transition-colors focus:border-primary";

export function TxForm({ onSubmit }: TxFormProps): ReactElement {
  const [form, setForm] = useState<TxFormState>(defaultTxForm);
  const [error, setError] = useState<string | null>(null);

  function updateField(field: keyof TxFormState, value: string): void {
    setForm((previous) => ({ ...previous, [field]: value }));
    setError(null);
  }

  function handleTypeChange(type: TxType): void {
    setForm((previous) => withType(previous, type));
    setError(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const result = parseTxForm(form);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    onSubmit(result.input satisfies TxFormDraft);
    setForm(defaultTxForm());
    setError(null);
  }

  return (
    <form className="mb-4 grid gap-3 rounded-xl border border-edge bg-card p-4" onSubmit={handleSubmit} noValidate>
      <fieldset className="flex gap-2">
        <legend className="sr-only">ประเภท</legend>
        {TX_TYPES.map((type) => {
          const active = form.type === type;
          return (
            <button
              key={type}
              type="button"
              aria-pressed={active}
              className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
                active
                  ? TYPE_PILL_CLASSES[type]
                  : "border-edge bg-surface text-ink-dim hover:border-primary"
              }`}
              onClick={() => handleTypeChange(type)}
            >
              <input
                type="radio"
                name="tx-type"
                value={type}
                checked={form.type === type}
                className="sr-only"
                onChange={() => handleTypeChange(type)}
              />
              {TX_TYPE_LABELS[type]}
            </button>
          );
        })}
      </fieldset>
      <label className="text-sm font-medium text-ink">
        หมวดหมู่
        <select
          name="tx-category"
          className={`${INPUT_CLASS} mt-1`}
          value={form.category}
          onChange={(event) => updateField("category", event.target.value)}
        >
          {categoryOptions(form.type).map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm font-medium text-ink">
        จำนวนเงิน (บาท)
        <input
          type="text"
          inputMode="decimal"
          name="tx-amount"
          className={`${INPUT_CLASS} mt-1`}
          value={form.amount}
          placeholder={AMOUNT_INPUT_HINT}
          onChange={(event) => updateField("amount", event.target.value)}
        />
      </label>
      <label className="text-sm font-medium text-ink">
        หมายเหตุ
        <input
          type="text"
          name="tx-note"
          className={`${INPUT_CLASS} mt-1`}
          value={form.note}
          placeholder="เช่น ค่ากาแฟเช้า"
          onChange={(event) => updateField("note", event.target.value)}
        />
      </label>
      <label className="text-sm font-medium text-ink">
        วันที่
        <input
          type="date"
          name="tx-date"
          className={`${INPUT_CLASS} mt-1`}
          value={form.date}
          onChange={(event) => updateField("date", event.target.value)}
        />
      </label>
      {error !== null && (
        <p className="m-0 text-sm text-expense" role="alert">
          {error}
        </p>
      )}
      <button type="submit" className="mt-1 cursor-pointer rounded-lg bg-primary px-4 py-2 font-semibold text-on-primary transition-opacity hover:opacity-90">
        เพิ่มรายการ
      </button>
    </form>
  );
}