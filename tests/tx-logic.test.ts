import { describe, expect, test } from "bun:test";
import {
  TX_TYPE_LABELS,
  categoryOptions,
  defaultTxForm,
  firstCategory,
  parseTxForm,
  parseTxType,
  txAmountClass,
  txAmountParts,
  txBadgeClass,
  withType,
} from "../src/components/tx-logic";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "../src/lib/constants";
import { todayKey } from "../src/lib/date";
import type { TxFormState } from "../src/components/tx-logic";

describe("categoryOptions", () => {
  test("income returns income categories", () => {
    expect(categoryOptions("income")).toEqual(INCOME_CATEGORIES);
  });

  test("expense returns expense categories", () => {
    expect(categoryOptions("expense")).toEqual(EXPENSE_CATEGORIES);
  });
});

describe("firstCategory", () => {
  test("income starts with เงินเดือน", () => {
    expect(firstCategory("income")).toBe("เงินเดือน");
  });

  test("expense starts with อาหาร", () => {
    expect(firstCategory("expense")).toBe("อาหาร");
  });
});

describe("withType", () => {
  test("switches type and resets category to the new type's first option", () => {
    const state: TxFormState = { type: "expense", category: "อาหาร", amount: "100", note: "", date: "2026-08-05" };
    expect(withType(state, "income")).toEqual({
      type: "income",
      category: "เงินเดือน",
      amount: "100",
      note: "",
      date: "2026-08-05",
    });
  });
});

describe("defaultTxForm", () => {
  test("defaults to expense with first expense category and today's date", () => {
    const form = defaultTxForm();
    expect(form.type).toBe("expense");
    expect(form.category).toBe("อาหาร");
    expect(form.amount).toBe("");
    expect(form.note).toBe("");
    expect(form.date).toBe(todayKey());
  });
});

describe("parseTxType", () => {
  test("accepts income and expense", () => {
    expect(parseTxType("income")).toBe("income");
    expect(parseTxType("expense")).toBe("expense");
  });

  test("rejects unknown values", () => {
    expect(parseTxType("savings")).toBeNull();
    expect(parseTxType("")).toBeNull();
  });
});

describe("parseTxForm", () => {
  const form: TxFormState = { type: "expense", category: "อาหาร", amount: "120.5", note: "  กาแฟ  ", date: "2026-08-05" };

  test("valid amount returns a typed draft with trimmed note", () => {
    const result = parseTxForm(form);
    expect("input" in result).toBe(true);
    if ("input" in result) {
      expect(result.input).toEqual({
        type: "expense",
        category: "อาหาร",
        amount: 120.5,
        note: "กาแฟ",
        date: "2026-08-05",
      });
    }
  });

  test("empty amount returns an error, never a draft", () => {
    const result = parseTxForm({ ...form, amount: "" });
    expect("error" in result).toBe(true);
    expect("input" in result).toBe(false);
  });

  test("non-numeric amount returns an error", () => {
    const result = parseTxForm({ ...form, amount: "abc" });
    expect("error" in result).toBe(true);
  });

  test("zero and negative amounts return an error", () => {
    expect("error" in parseTxForm({ ...form, amount: "0" })).toBe(true);
    expect("error" in parseTxForm({ ...form, amount: "-50" })).toBe(true);
  });
});

describe("display helpers", () => {
  test("TX_TYPE_LABELS maps income/expense to Thai labels", () => {
    expect(TX_TYPE_LABELS.income).toBe("รายรับ");
    expect(TX_TYPE_LABELS.expense).toBe("รายจ่าย");
  });

  test("txBadgeClass returns the income and expense tone classes", () => {
    expect(txBadgeClass("income")).toBe(
      "inline-block rounded-full bg-income-light px-2 py-0.5 text-xs font-semibold text-income-dark",
    );
    expect(txBadgeClass("expense")).toBe(
      "inline-block rounded-full bg-expense-light px-2 py-0.5 text-xs font-semibold text-expense",
    );
  });

  test("txAmountClass returns the income and expense tone classes", () => {
    expect(txAmountClass("income")).toBe("font-semibold text-income-dark");
    expect(txAmountClass("expense")).toBe("font-semibold text-expense");
  });

  test("txAmountParts prefixes income with + and expense with −", () => {
    expect(txAmountParts({ type: "income", amount: 5000 })).toEqual({ sign: "+", formatted: "5,000.00" });
    expect(txAmountParts({ type: "expense", amount: 1200.5 })).toEqual({ sign: "−", formatted: "1,200.50" });
  });
});
