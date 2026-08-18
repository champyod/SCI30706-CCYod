import { useState } from "react";
import type { FormEvent, ReactElement } from "react";
import { formatBaht, parseAmount } from "../lib/money";

export interface SavingsCardProps {
  balance: number;
  onSave: (amount: number) => void;
}

/**
 * Savings rendered as a goal with no target cap: the balance is always shown,
 * the save input lives on the card, and there is no delete action.
 */
export function SavingsCard({ balance, onSave }: SavingsCardProps): ReactElement {
  const [amount, setAmount] = useState("");

  function handleSaveSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const parsed = parseAmount(amount);
    if (parsed === null) {
      return;
    }
    onSave(parsed);
    setAmount("");
  }

  return (
    <article className="w-full rounded-xl border border-edge bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h3 className="m-0 text-base font-bold text-ink">เงินออม</h3>
        <span className="rounded-full bg-edge px-2 py-0.5 text-xs font-semibold text-ink-dim">
          ไม่จำกัด
        </span>
      </div>
      <p className="m-0 mt-2 text-sm text-ink-dim">ออมไปแล้ว</p>
      <p className="m-0 mt-1 text-3xl font-bold text-income-dark">
        {formatBaht(balance)}
      </p>
      <form
        className="mt-3 flex items-center gap-2"
        onSubmit={handleSaveSubmit}
        noValidate
      >
        <label className="min-w-0 flex-1">
          <span className="sr-only">จำนวนเงินที่ออม</span>
          <input
            type="text"
            name="save-amount"
            inputMode="decimal"
            placeholder="จำนวนเงินที่ต้องการออม"
            className="w-full rounded-lg border border-edge bg-surface px-3 py-1.5 text-ink outline-none transition-colors focus:border-primary"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
        </label>
        <button
          type="submit"
          className="cursor-pointer rounded-lg bg-primary px-3 py-1.5 font-semibold text-on-primary transition-opacity hover:opacity-90"
        >
          ออม
        </button>
      </form>
    </article>
  );
}
