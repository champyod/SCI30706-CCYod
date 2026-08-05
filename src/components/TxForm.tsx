import { useState } from "react";
import type { FormEvent, ReactElement } from "react";
import { TX_TYPE_LABELS, categoryOptions, defaultTxForm, parseTxForm, parseTxType, withType } from "./tx-logic";
import type { TxFormState, TxFormDraft } from "./tx-logic";
import type { Tx, TxType } from "../lib/types";

export interface TxFormProps {
  onSubmit: (input: Omit<Tx, "id" | "createdAt">) => void;
}

const TX_TYPES: readonly TxType[] = ["income", "expense"];
const AMOUNT_INPUT_HINT = "เช่น 500 หรือ 1250.50";

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
    <form className="tx-form" onSubmit={handleSubmit} noValidate>
      <fieldset className="tx-type-field">
        <legend>ประเภท</legend>
        {TX_TYPES.map((type) => (
          <label key={type} className="tx-type-option">
            <input
              type="radio"
              name="tx-type"
              value={type}
              checked={form.type === type}
              onChange={() => handleTypeChange(type)}
            />
            {TX_TYPE_LABELS[type]}
          </label>
        ))}
      </fieldset>
      <label className="tx-field">
        หมวดหมู่
        <select
          name="tx-category"
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
      <label className="tx-field">
        จำนวนเงิน (บาท)
        <input
          type="text"
          inputMode="decimal"
          name="tx-amount"
          value={form.amount}
          placeholder={AMOUNT_INPUT_HINT}
          onChange={(event) => updateField("amount", event.target.value)}
        />
      </label>
      <label className="tx-field">
        หมายเหตุ
        <input
          type="text"
          name="tx-note"
          value={form.note}
          placeholder="เช่น ค่ากาแฟเช้า"
          onChange={(event) => updateField("note", event.target.value)}
        />
      </label>
      <label className="tx-field">
        วันที่
        <input
          type="date"
          name="tx-date"
          value={form.date}
          onChange={(event) => updateField("date", event.target.value)}
        />
      </label>
      {error !== null && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <button type="submit" className="btn btn-primary">
        เพิ่มรายการ
      </button>
    </form>
  );
}
