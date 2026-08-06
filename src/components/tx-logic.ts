import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "../lib/constants";
import { todayKey } from "../lib/date";
import { formatBaht, parseAmount } from "../lib/money";
import type { Tx, TxType } from "../lib/types";

// Thai labels shared by TxForm, TxTable and the SummaryCard-side badges.
export const TX_TYPE_LABELS: Record<TxType, string> = {
  income: "รายรับ",
  expense: "รายจ่าย",
};

export interface TxFormState {
  type: TxType;
  category: string;
  amount: string;
  note: string;
  date: string;
}

export type TxFormDraft = Omit<Tx, "id" | "createdAt">;

export type TxFormResult = { input: TxFormDraft } | { error: string };

const DEFAULT_TYPE: TxType = "expense";
const FALLBACK_CATEGORY = "อื่นๆ";
const AMOUNT_ERROR = "กรุณากรอกจำนวนเงินที่ถูกต้อง (มากกว่า 0)";

export function categoryOptions(type: TxType): readonly string[] {
  return type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
}

export function firstCategory(type: TxType): string {
  return categoryOptions(type)[0] ?? FALLBACK_CATEGORY;
}

// Switching type must also reset category, otherwise the select could hold a
// value that no longer exists in the option list.
export function withType(state: TxFormState, type: TxType): TxFormState {
  return { ...state, type, category: firstCategory(type) };
}

export function defaultTxForm(): TxFormState {
  return {
    type: DEFAULT_TYPE,
    category: firstCategory(DEFAULT_TYPE),
    amount: "",
    note: "",
    date: todayKey(),
  };
}

// Guards the radio value against arbitrary strings without an unsafe cast.
export function parseTxType(value: string): TxType | null {
  return value === "income" || value === "expense" ? value : null;
}

export function parseTxForm(form: TxFormState): TxFormResult {
  const amount = parseAmount(form.amount);
  if (amount === null) {
    return { error: AMOUNT_ERROR };
  }
  return {
    input: {
      type: form.type,
      category: form.category,
      amount,
      note: form.note.trim(),
      date: form.date,
    },
  };
}

export function txBadgeClass(type: TxType): string {
  return type === "income"
    ? "inline-block rounded-full bg-green-light px-2 py-0.5 text-xs font-semibold text-green-dark"
    : "inline-block rounded-full bg-expense-light px-2 py-0.5 text-xs font-semibold text-expense";
}

export function txAmountClass(type: TxType): string {
  return type === "income" ? "font-semibold text-green-dark" : "font-semibold text-expense";
}

// Income renders a "+" prefix, expense a "−" (U+2212) prefix, before the
// baht-formatted amount so the table column reads as a running balance.
export function txAmountParts(
  tx: Pick<Tx, "type" | "amount">,
): { sign: "+" | "−"; formatted: string } {
  const sign = tx.type === "income" ? "+" : "−";
  return { sign, formatted: formatBaht(tx.amount) };
}
