import type { ReactElement } from "react";
import { getBalance, sumByType } from "../lib/finance";
import { formatBaht } from "../lib/money";
import type { Tx } from "../lib/types";

const INCOME_LABEL = "Income";
const EXPENSE_LABEL = "Expense";
const BALANCE_LABEL = "Balance";

const TONE_CLASSES = {
  income: "stat-income",
  expense: "stat-expense",
  balance: "",
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
  return <section className="summary-grid">{cards.map(createStatCard)}</section>;
}

function buildStatCards(income: number, expense: number, balance: number): StatCardData[] {
  return [
    { label: INCOME_LABEL, value: formatBaht(income), toneClass: TONE_CLASSES.income },
    { label: EXPENSE_LABEL, value: formatBaht(expense), toneClass: TONE_CLASSES.expense },
    { label: BALANCE_LABEL, value: formatBaht(balance), toneClass: TONE_CLASSES.balance },
  ];
}

function createStatCard(card: StatCardData, index: number): ReactElement {
  const className = card.toneClass.length > 0 ? `stat-card ${card.toneClass}` : "stat-card";
  return (
    <div key={index} className={className}>
      <span className="stat-label">{card.label}</span>
      <strong className="stat-value">{card.value}</strong>
    </div>
  );
}
