import { describe, expect, test } from "bun:test";
import { renderToString } from "react-dom/server";
import { TxTable } from "../src/components/TxTable";
import type { Tx } from "../src/lib/types";

const SAMPLE_TXS: Tx[] = [
  { id: "a", type: "income", category: "เงินเดือน", amount: 10000, note: "เงินเดือน", date: "2026-08-03", createdAt: "c1" },
  { id: "b", type: "expense", category: "อาหาร", amount: 250.5, note: "ค่ากาแฟ", date: "2026-08-05", createdAt: "c2" },
  { id: "c", type: "expense", category: "เดินทาง", amount: 40, note: "", date: "2026-08-01", createdAt: "c3" },
];

function renderTable(transactions: Tx[]): string {
  return renderToString(<TxTable transactions={transactions} onDelete={() => {}} />);
}

describe("TxTable", () => {
  test("renders a header row plus one row per transaction", () => {
    const markup = renderTable(SAMPLE_TXS);
    expect(markup).toContain('<table class="table">');
    expect(markup.split("<tr>").length - 1).toBe(4);
  });

  test("default sort is date descending", () => {
    const markup = renderTable(SAMPLE_TXS);
    const newest = markup.indexOf("2026-08-05");
    const middle = markup.indexOf("2026-08-03");
    const oldest = markup.indexOf("2026-08-01");
    expect(newest).toBeGreaterThan(-1);
    expect(newest).toBeLessThan(middle);
    expect(middle).toBeLessThan(oldest);
  });

  test("type badges carry the correct tone classes", () => {
    const markup = renderTable(SAMPLE_TXS);
    expect(markup).toContain('<span class="badge badge-income">รายรับ</span>');
    expect(markup.match(/class="badge badge-expense">รายจ่าย<\/span>/g)?.length).toBe(2);
  });

  test("amounts are prefixed with + for income and − for expense", () => {
    const markup = renderTable(SAMPLE_TXS);
    expect(markup).toContain('<span class="tx-amount tx-amount-income">+10,000.00</span>');
    expect(markup).toContain('<span class="tx-amount tx-amount-expense">−250.50</span>');
    expect(markup).toContain('<span class="tx-amount tx-amount-expense">−40.00</span>');
  });

  test("renders one delete button per row with the Trash2 icon", () => {
    const markup = renderTable(SAMPLE_TXS);
    expect(markup.match(/aria-label="ลบรายการ"/g)?.length).toBe(3);
    expect(markup).toContain("<svg");
  });

  test("shows an empty-state message when there are no transactions", () => {
    const markup = renderTable([]);
    expect(markup).toContain("ยังไม่มีรายการ");
    expect(markup).toContain('colSpan="6"');
  });
});
