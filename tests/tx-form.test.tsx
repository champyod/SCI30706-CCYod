import { describe, expect, test } from "bun:test";
import { renderToString } from "react-dom/server";
import { TxForm } from "../src/components/TxForm";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "../src/lib/constants";
import { todayKey } from "../src/lib/date";
import { parseTxForm } from "../src/components/tx-logic";

// React 19 may reorder checked before value in SSR markup, so radio assertions
// match the full tag instead of assuming attribute order.
function radioMarkup(markup: string, value: string): string {
  return markup.match(new RegExp(`<input[^>]*value="${value}"[^>]*>`))?.[0] ?? "";
}

describe("TxForm", () => {
  test("renders type radios, category select, amount/note/date inputs and submit button", () => {
    const markup = renderToString(<TxForm onSubmit={() => {}} />);
    expect(radioMarkup(markup, "income")).toContain('name="tx-type"');
    expect(radioMarkup(markup, "expense")).toContain('name="tx-type"');
    expect(markup).toContain('name="tx-category"');
    expect(markup).toContain('name="tx-amount"');
    expect(markup).toContain('name="tx-note"');
    expect(markup).toContain('name="tx-date"');
    expect(markup).toContain('<button type="submit"');
  });

  test("defaults to expense radio checked with expense categories in the select", () => {
    const markup = renderToString(<TxForm onSubmit={() => {}} />);
    expect(radioMarkup(markup, "expense")).toContain('checked=""');
    expect(radioMarkup(markup, "income")).not.toContain('checked=""');
    for (const category of EXPENSE_CATEGORIES) {
      expect(markup).toContain(`<option value="${category}"`);
    }
    expect(markup).not.toContain(`<option value="${INCOME_CATEGORIES[0]}"`);
  });

  test("date input defaults to today", () => {
    const markup = renderToString(<TxForm onSubmit={() => {}} />);
    expect(markup).toContain(`name="tx-date" value="${todayKey()}"`);
  });

  test("no error text on initial render", () => {
    const markup = renderToString(<TxForm onSubmit={() => {}} />);
    expect(markup).not.toContain('class="form-error"');
  });

  test("valid draft shape has type, category, amount, note and date", () => {
    const result = parseTxForm({
      type: "income",
      category: "เงินเดือน",
      amount: "30000",
      note: "เงินเดือนสิงหาคม",
      date: "2026-08-05",
    });
    expect("input" in result).toBe(true);
    if ("input" in result) {
      expect(result.input).toEqual({
        type: "income",
        category: "เงินเดือน",
        amount: 30000,
        note: "เงินเดือนสิงหาคม",
        date: "2026-08-05",
      });
    }
  });

  test("invalid amount yields an error and no draft", () => {
    const result = parseTxForm({
      type: "expense",
      category: "อาหาร",
      amount: "ไม่ใช่ตัวเลข",
      note: "",
      date: "2026-08-05",
    });
    expect("error" in result).toBe(true);
    expect("input" in result).toBe(false);
  });
});
