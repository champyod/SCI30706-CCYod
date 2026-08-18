import { useState } from "react";
import type { FormEvent, ReactElement } from "react";
import { formatBaht, parseAmount } from "../lib/money";
import type { Goal } from "../lib/types";
import { Icon } from "./Icon";
import {
  dailyRequiredSavings,
  goalProgressPercent,
  isGoalAchieved,
} from "./goal-result-logic";

const BAR_MAX_PERCENT = 100;

export interface GoalCardProps {
  goal: Goal;
  pending: boolean;
  onInvest: (id: string, amount: number) => void;
  onDelete: (id: string) => void;
}

export function GoalCard({ goal, pending, onInvest, onDelete }: GoalCardProps): ReactElement {
  const [amount, setAmount] = useState("");
  const achieved = isGoalAchieved(goal);
  const required = dailyRequiredSavings(goal);
  const progress = goalProgressPercent(goal);

  function handleInvestSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const parsed = parseAmount(amount);
    if (parsed === null) {
      return;
    }
    onInvest(goal.id, parsed);
    setAmount("");
  }

  return (
    <article className="w-full rounded-xl border border-edge bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h3 className="m-0 text-base font-bold text-ink">{goal.name}</h3>
        {pending ? (
          <span className="rounded-full bg-edge px-2 py-0.5 text-xs font-semibold text-ink-dim">
            กำลังบันทึก…
          </span>
        ) : achieved ? (
          <span className="rounded-full bg-income-light px-2 py-0.5 text-xs font-semibold text-income-dark">
            สำเร็จแล้ว
          </span>
        ) : null}
      </div>
      <div
        className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-income-light"
        role="progressbar"
        aria-label={goal.name}
        aria-valuemin={0}
        aria-valuemax={BAR_MAX_PERCENT}
        aria-valuenow={progress}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-income-light to-income"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="m-0 mt-1 font-medium text-ink">{`${progress}% ครบแล้ว (${formatBaht(goal.current)} / ${formatBaht(goal.target)})`}</p>
      {!achieved && (
        <p className="m-0 text-sm text-ink-dim">{`ประมาณ ${formatBaht(required)} บาท/วัน ต่อเป้าหมายนี้`}</p>
      )}
      <form
        className="mt-3 flex items-center gap-2"
        onSubmit={handleInvestSubmit}
        noValidate
      >
        <label className="min-w-0 flex-1">
          <span className="sr-only">จำนวนเงินที่ลงทุนสำหรับ {goal.name}</span>
          <input
            type="text"
            name="invest-amount"
            inputMode="decimal"
            placeholder="จำนวนเงินที่ลงทุน"
            className="w-full rounded-lg border border-edge bg-surface px-3 py-1.5 text-ink outline-none transition-colors focus:border-primary"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
        </label>
        <button
          type="submit"
          disabled={achieved}
          className="cursor-pointer rounded-lg bg-primary px-3 py-1.5 font-semibold text-on-primary transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          ลงทุน
        </button>
        <button
          type="button"
          className="cursor-pointer rounded-lg border border-edge bg-surface px-2 py-1.5 text-ink-dim transition-colors hover:border-expense hover:text-expense"
          aria-label={`ลบ ${goal.name}`}
          onClick={() => onDelete(goal.id)}
        >
          <Icon name="Trash2" />
        </button>
      </form>
    </article>
  );
}