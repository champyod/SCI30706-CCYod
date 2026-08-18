import type { ReactElement } from "react";
import { freeBalance, goalsInvested } from "../lib/finance";
import { formatBaht } from "../lib/money";
import type { Goal, Settings, Tx } from "../lib/types";

const SAVED_LABEL = "เงินออม";
const IN_GOALS_LABEL = "ในเป้าหมาย";
const FREE_LABEL = "เงินคงเหลือ";

const TONE_CLASSES = {
  saved: "text-income-dark",
  goals: "text-primary-dark",
  free: "text-ink",
} as const;

interface StatCardData {
  label: string;
  value: string;
  toneClass: string;
}

export interface SummaryCardProps {
  transactions: Tx[];
  goals: Goal[];
  settings: Settings;
}

export function SummaryCard({
  transactions,
  goals,
  settings,
}: SummaryCardProps): ReactElement {
  const saved = settings.savingsBalance;
  const invested = goalsInvested(goals);
  const free = freeBalance(transactions, goals, settings);
  const cards = buildStatCards(saved, invested, free);
  return (
    <section className="mb-4 grid gap-3 sm:grid-cols-3">
      {cards.map(createStatCard)}
    </section>
  );
}

function buildStatCards(saved: number, invested: number, free: number): StatCardData[] {
  return [
    { label: SAVED_LABEL, value: formatBaht(saved), toneClass: TONE_CLASSES.saved },
    { label: IN_GOALS_LABEL, value: formatBaht(invested), toneClass: TONE_CLASSES.goals },
    { label: FREE_LABEL, value: formatBaht(free), toneClass: TONE_CLASSES.free },
  ];
}

function createStatCard(card: StatCardData, index: number): ReactElement {
  return (
    <div
      key={index}
      className="rounded-2xl border border-edge bg-card px-4 py-4 text-center shadow-sm"
    >
      <span className="block text-sm font-medium uppercase tracking-wide text-ink-dim">
        {card.label}
      </span>
      <strong className={`mt-1 block text-4xl font-bold ${card.toneClass}`}>
        {card.value}
      </strong>
    </div>
  );
}