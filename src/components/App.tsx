import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import type { ReactElement } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";
import { categoryBreakdown, incomeVsExpense, monthlySeries } from "../lib/chart-data";
import { AppStore } from "../lib/store";
import type { Goal, GoalMode, Tx } from "../lib/types";
import { BarChart } from "./BarChart";
import { GoalForm } from "./GoalForm";
import type { GoalInput } from "./goal-form-logic";
import { GoalList } from "./GoalList";
import { GoalResult } from "./GoalResult";
import { Header } from "./Header";
import { LineChart } from "./LineChart";
import { ModeSelector } from "./ModeSelector";
import { PieChart } from "./PieChart";
import { QuoteBox } from "./QuoteBox";
import { SummaryCard } from "./SummaryCard";
import { applyTheme, loadHue } from "./theme-logic";
import { ThemePicker } from "./ThemePicker";
import { TxForm } from "./TxForm";
import { TxTable } from "./TxTable";

// Header renders an empty data-slot div (it owns the slot but not its
// content), so App injects ThemePicker into it via a portal after mount.
const SLOT_THEME_SELECTOR = '[data-slot="theme-picker"]';

interface HeaderSlotsProps {
  hue: number;
  onHueChange: (hue: number) => void;
}

function HeaderSlots({ hue, onHueChange }: HeaderSlotsProps): ReactElement {
  const shellRef = useRef<HTMLDivElement | null>(null);
  const [themeSlot, setThemeSlot] = useState<Element | null>(null);

  useEffect(() => {
    const shell = shellRef.current;
    if (shell === null) {
      return;
    }
    const theme = shell.querySelector(SLOT_THEME_SELECTOR);
    setThemeSlot(theme);
  }, []);

  return (
    <div ref={shellRef}>
      <Header />
      {themeSlot === null ? null : (
        createPortal(<ThemePicker hue={hue} onHueChange={onHueChange} />, themeSlot)
      )}
    </div>
  );
}

interface AppProps {
  store: AppStore;
}

export function App({ store }: AppProps): ReactElement {
  // Re-render on every store mutation: the snapshot must be a value that
  // changes (store.version), not the store instance (stable reference).
  const subscribe = useCallback(
    (onStoreChange: () => void) => store.subscribe(onStoreChange),
    [store],
  );
  useSyncExternalStore(subscribe, () => store.version);
  const [hue, setHue] = useState<number>(loadHue);

  useEffect(() => {
    applyTheme(loadHue());
  }, []);

  const series = incomeVsExpense(store.transactions);
  const barData = monthlySeries(store.transactions, series.labels);
  const pieData = categoryBreakdown(store.transactions);
  // Goals arrive ordered by position (array index IS the position), so the
  // first element is the top-priority goal shown in GoalResult.
  const firstGoal: Goal | undefined = store.goals[0];

  return (
    <div className="mx-auto max-w-3xl p-4 md:p-6">
      <HeaderSlots hue={hue} onHueChange={setHue} />
      <Toaster position="top-right" richColors closeButton /> 
      <SummaryCard transactions={store.transactions} />
      <section className="mb-4 grid gap-4 md:grid-cols-3">
        <section className="rounded-2xl border border-edge bg-card p-4 shadow-sm">
          <h2 className="text-lg font-bold text-ink">Monthly Expense</h2>
          <BarChart data={barData} labels={series.labels} />
        </section>
        <section className="rounded-2xl border border-edge bg-card p-4 shadow-sm">
          <h2 className="text-lg font-bold text-ink">Income vs Expense</h2>
          <LineChart data={series} />
        </section>
        <section className="rounded-2xl border border-edge bg-card p-4 shadow-sm">
          <h2 className="text-lg font-bold text-ink">Expense by Category</h2>
          <PieChart data={pieData} />
        </section>
      </section>
      <section className="mb-4 grid gap-2 rounded-2xl border border-edge bg-card p-4 shadow-sm">
        <h2 className="text-lg font-bold text-ink">Transactions</h2>
        <ModeSelector
          mode={store.settings.mode}
          onModeChange={(mode) => handleModeChange(store, mode)}
        />
        <TxForm onSubmit={(input) => handleAddTx(store, input)} />
        <TxTable
          transactions={store.transactions}
          pendingIds={store.pendingTxIds}
          onDelete={(id) => handleDeleteTx(store, id)}
        />
      </section>
      <section className="mb-4 grid gap-4">
        <section className="rounded-2xl border border-edge bg-card p-4 shadow-sm">
          <h2 className="text-lg font-bold text-ink">Goals</h2>
          <GoalForm onSubmit={(input) => handleAddGoal(store, input)} />
        </section>
        <GoalList
          goals={store.goals}
          pendingIds={store.pendingGoalIds}
          onDelete={(id) => handleDeleteGoal(store, id)}
          onPromote={(position) => handlePromoteGoal(store, position)}
        />
        {firstGoal === undefined ? null : <GoalResult goal={firstGoal} />}
      </section>
      <QuoteBox />
    </div>
  );
}

function handleAddTx(store: AppStore, input: Omit<Tx, "id" | "createdAt">): void {
  // Optimistic: the store mutates + notifies instantly; rollback + toast are
  // handled inside on backend failure.
  store.addTx(input).catch((error: unknown) => logBackendError("add transaction", error));
}

function handleDeleteTx(store: AppStore, id: string): void {
  store.deleteTx(id).catch((error: unknown) => logBackendError("delete transaction", error));
}

function handleAddGoal(store: AppStore, input: GoalInput): void {
  store.addGoal(input).catch((error: unknown) => logBackendError("add goal", error));
}

function handleDeleteGoal(store: AppStore, id: string): void {
  store.deleteGoal(id).catch((error: unknown) => logBackendError("delete goal", error));
}

function handlePromoteGoal(store: AppStore, position: number): void {
  store.promoteGoal(position).catch((error: unknown) => logBackendError("promote goal", error));
}

function handleModeChange(store: AppStore, mode: GoalMode): void {
  store.updateSettings({ mode }).catch((error: unknown) => logBackendError("update mode", error));
}

function logBackendError(action: string, error: unknown): void {
  console.error(`Failed to ${action}`, error);
}

export function mountApp(root: HTMLElement, store: AppStore): void {
  // Render only after init resolves so the first paint already has data; if
  // init rejects, still render with whatever cache exists rather than a blank
  // page (main.tsx already chose a working backend before calling mountApp).
  void store.init().then(
    () => {
      renderApp(root, store);
    },
    (error: unknown) => {
      console.error("mountApp: store init failed, rendering with current state", error);
      renderApp(root, store);
    },
  );
}

function renderApp(root: HTMLElement, store: AppStore): void {
  createRoot(root).render(<App store={store} />);
}
