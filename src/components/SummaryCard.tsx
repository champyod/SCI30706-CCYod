import type { ReactElement } from "react";
import { getBalance, sumByType } from "../lib/finance";
import { formatBaht } from "../lib/money";
import type { Tx } from "../lib/types";

const INCOME_LABEL = "Income";
const EXPENSE_LABEL = "Expense";
const BALANCE_LABEL = "Balance";

const TONE_CLASSES = {
  income: "text-green-dark",
  expense: "text-expense",
  balance: "text-ink",
} as const;

interface StatCardData {
  label: string;
  value: string;
  toneClass: string;
}

export interface SummaryCardProps {
  transactions: Tx[];
}

export function SummaryCard({ transactions }: SummaryCardProps): ReactElement {
  const income = sumByType(transactions, "income");
  const expense = sumByType(transactions, "expense");
  const balance = getBalance(income, expense);
  const cards = buildStatCards(income, expense, balance);
  return (
    <section className="mb-4 grid gap-3 sm:grid-cols-3">
      {cards.map(createStatCard)}
    </section>
  );
}

function buildStatCards(income: number, expense: number, balance: number): StatCardData[] {
  return [
    { label: INCOME_LABEL, value: formatBaht(income), toneClass: TONE_CLASSES.income },
    { label: EXPENSE_LABEL, value: formatBaht(expense), toneClass: TONE_CLASSES.expense },
    { label: BALANCE_LABEL, value: formatBaht(balance), toneClass: TONE_CLASSES.balance },
  ];
}

function createStatCard(card: StatCardData, index: number): ReactElement {
  return (
    <div
      key={index}
      className="rounded-2xl border border-edge bg-card px-4 py-3 shadow-sm"
    >
      <span className="block text-xs font-medium uppercase tracking-wide text-ink-dim">
        {card.label}
      </span>
      <strong className={`mt-1 block text-xl font-bold ${card.toneClass}`}>
        {card.value}
      </strong>
    </div>
  );
}
