import { describe, expect, test } from "bun:test";
import { renderToString } from "react-dom/server";
import { SummaryCard } from "../src/components/SummaryCard";
import type { Tx } from "../src/lib/types";

const SAMPLE_TXS: Tx[] = [
  { id: "1", type: "income", category: "salary", amount: 5000, note: "", date: "2026-08-01", createdAt: "t1" },
  { id: "2", type: "expense", category: "food", amount: 1200.5, note: "", date: "2026-08-02", createdAt: "t2" },
];

describe("SummaryCard", () => {
  test("renders three stat cards for sample transactions", () => {
    const markup = renderToString(<SummaryCard transactions={SAMPLE_TXS} />);
    expect(markup).toContain('<section class="summary-grid">');
    expect(markup.split('class="stat-card').length - 1).toBe(3);
  });

  test("income card shows formatted income with the income tone class", () => {
    const markup = renderToString(<SummaryCard transactions={SAMPLE_TXS} />);
    expect(markup).toContain(
      '<div class="stat-card stat-income"><span class="stat-label">Income</span><strong class="stat-value">5,000.00</strong></div>',
    );
  });

  test("expense card shows formatted expense with the expense tone class", () => {
    const markup = renderToString(<SummaryCard transactions={SAMPLE_TXS} />);
    expect(markup).toContain(
      '<div class="stat-card stat-expense"><span class="stat-label">Expense</span><strong class="stat-value">1,200.50</strong></div>',
    );
  });

  test("balance card has no tone class", () => {
    const markup = renderToString(<SummaryCard transactions={SAMPLE_TXS} />);
    expect(markup).toContain(
      '<div class="stat-card"><span class="stat-label">Balance</span><strong class="stat-value">3,799.50</strong></div>',
    );
  });

  test("empty transactions render 0.00 values", () => {
    const markup = renderToString(<SummaryCard transactions={[]} />);
    expect(markup.match(/0\.00/g)?.length).toBe(3);
  });
});