import { describe, expect, test } from "bun:test";
import { renderToString } from "react-dom/server";
import { SummaryCard } from "../src/components/SummaryCard";
import type { Goal, Settings, Tx } from "../src/lib/types";

const SAMPLE_TXS: Tx[] = [
  { id: "1", type: "income", category: "salary", amount: 5000, note: "", date: "2026-08-01", createdAt: "t1" },
  { id: "2", type: "expense", category: "food", amount: 1200.5, note: "", date: "2026-08-02", createdAt: "t2" },
];

const SAMPLE_GOALS: Goal[] = [
  { id: "g1", name: "vacation", target: 10000, current: 500, mode: "daily", duration: 30, position: 0, createdAt: "g1" },
];

const SAMPLE_SETTINGS: Settings = {
  savingsBalance: 300,
  autoInvestPercent: 0,
  autoSavePercent: 0,
};

describe("SummaryCard", () => {
  test("renders three stat cards for sample data", () => {
    const markup = renderToString(
      <SummaryCard transactions={SAMPLE_TXS} goals={SAMPLE_GOALS} settings={SAMPLE_SETTINGS} />,
    );
    expect(markup).toContain('<section class="mb-4 grid gap-3 sm:grid-cols-3">');
    expect(markup.split("rounded-2xl border border-edge bg-card px-4 py-4 text-center shadow-sm").length - 1).toBe(3);
  });

  test("saved card shows the savings balance with the saved tone class", () => {
    const markup = renderToString(
      <SummaryCard transactions={SAMPLE_TXS} goals={SAMPLE_GOALS} settings={SAMPLE_SETTINGS} />,
    );
    expect(markup).toContain('>Saved</span>');
    expect(markup).toContain('class="mt-1 block text-4xl font-bold text-income-dark">300.00</strong>');
  });

  test("in goals card shows total invested with the goals tone class", () => {
    const markup = renderToString(
      <SummaryCard transactions={SAMPLE_TXS} goals={SAMPLE_GOALS} settings={SAMPLE_SETTINGS} />,
    );
    expect(markup).toContain('>In Goals</span>');
    expect(markup).toContain('class="mt-1 block text-4xl font-bold text-primary-dark">500.00</strong>');
  });

  test("free balance card shows income minus expense minus goals minus savings", () => {
    const markup = renderToString(
      <SummaryCard transactions={SAMPLE_TXS} goals={SAMPLE_GOALS} settings={SAMPLE_SETTINGS} />,
    );
    expect(markup).toContain('>Free Balance</span>');
    expect(markup).toContain('class="mt-1 block text-4xl font-bold text-ink">2,999.50</strong>');
  });

  test("empty data renders 0.00 values", () => {
    const markup = renderToString(
      <SummaryCard
        transactions={[]}
        goals={[]}
        settings={{ ...SAMPLE_SETTINGS, savingsBalance: 0 }}
      />,
    );
    expect(markup.match(/0\.00/g)?.length).toBe(3);
  });
});