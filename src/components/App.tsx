import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import type { ReactElement } from "react";
import { createRoot } from "react-dom/client";
import { categoryBreakdown, incomeVsExpense, monthlySeries } from "../lib/chart-data";
import { AppStore } from "../lib/store";
import type { Goal, GoalMode, Tx } from "../lib/types";
import { BarChart } from "./BarChart";
import { ConnectionStatus } from "./ConnectionStatus";
import type { ConnectionKind } from "./ConnectionStatus";
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

// Header renders empty data-slot divs (it owns the slots but not their
// content), so App injects ConnectionStatus + ThemePicker into them via
// portals after mount. This keeps Header zero-prop and the slots single-owned.
const SLOT_CONNECTION_SELECTOR = '[data-slot="connection-status"]';
const SLOT_THEME_SELECTOR = '[data-slot="theme-picker"]';

interface SlotTargets {
  connection: Element;
  theme: Element;
}

interface HeaderSlotsProps {
  connectionKind: ConnectionKind;
  hue: number;
  onHueChange: (hue: number) => void;
}

function HeaderSlots({ connectionKind, hue, onHueChange }: HeaderSlotsProps): ReactElement {
  const shellRef = useRef<HTMLDivElement | null>(null);
  const [slotTargets, setSlotTargets] = useState<SlotTargets | null>(null);

  useEffect(() => {
    const shell = shellRef.current;
    if (shell === null) {
      return;
    }
    const connection = shell.querySelector(SLOT_CONNECTION_SELECTOR);
    const theme = shell.querySelector(SLOT_THEME_SELECTOR);
    if (connection === null || theme === null) {
      return;
    }
    setSlotTargets({ connection, theme });
  }, []);

  return (
    <div ref={shellRef}>
      <Header />
      {slotTargets === null ? null : (
        <>
          {createPortal(<ConnectionStatus kind={connectionKind} />, slotTargets.connection)}
          {createPortal(<ThemePicker hue={hue} onHueChange={onHueChange} />, slotTargets.theme)}
        </>
      )}
    </div>
  );
}

interface AppProps {
  store: AppStore;
  connectionKind: ConnectionKind;
}

export function App({ store, connectionKind }: AppProps): ReactElement {
  // Stable snapshot: the store instance itself. React owns subscribe/unsubscribe
  // lifecycle, so the listener is always cleaned up on unmount (leak-free).
  const subscribe = useCallback(
    (onStoreChange: () => void) => store.subscribe(onStoreChange),
    [store],
  );
  const snapshot = useSyncExternalStore(subscribe, () => store);
  const [hue, setHue] = useState<number>(loadHue);

  useEffect(() => {
    // Restore the persisted theme once on mount; ThemePicker applies changes
    // itself via commitHue, so App only needs the initial apply.
    applyTheme(loadHue());
  }, []);

  const series = incomeVsExpense(snapshot.transactions);
  const barData = monthlySeries(snapshot.transactions, series.labels);
  const pieData = categoryBreakdown(snapshot.transactions);
  // Goals arrive ordered by position (array index IS the position), so the
  // first element is the top-priority goal shown in GoalResult.
  const firstGoal: Goal | undefined = snapshot.goals[0];

  return (
    <div id="app">
      <HeaderSlots connectionKind={connectionKind} hue={hue} onHueChange={setHue} />
      <SummaryCard transactions={snapshot.transactions} />
      <section className="charts-grid">
        <div className="card">
          <h2 className="card-title">Monthly Expense</h2>
          <BarChart data={barData} labels={series.labels} />
        </div>
        <div className="card">
          <h2 className="card-title">Income vs Expense</h2>
          <LineChart data={series} />
        </div>
        <div className="card">
          <h2 className="card-title">Expense by Category</h2>
          <PieChart data={pieData} />
        </div>
      </section>
      <section className="card tx-section">
        <h2 className="card-title">Transactions</h2>
        <ModeSelector
          mode={snapshot.settings.mode}
          onModeChange={(mode) => handleModeChange(snapshot, mode)}
        />
        <TxForm onSubmit={(input) => handleAddTx(snapshot, input)} />
        <TxTable
          transactions={snapshot.transactions}
          onDelete={(id) => handleDeleteTx(snapshot, id)}
        />
      </section>
      <section className="goal-section">
        <div className="card">
          <h2 className="card-title">Goals</h2>
          <GoalForm onSubmit={(input) => handleAddGoal(snapshot, input)} />
        </div>
        <GoalList
          goals={snapshot.goals}
          onDelete={(id) => handleDeleteGoal(snapshot, id)}
          onPromote={(position) => handlePromoteGoal(snapshot, position)}
        />
        {firstGoal === undefined ? null : <GoalResult goal={firstGoal} />}
      </section>
      <QuoteBox />
    </div>
  );
}

function logBackendError(action: string, error: unknown): void {
  console.error(`Failed to ${action}`, error);
}

function handleAddTx(store: AppStore, input: Omit<Tx, "id" | "createdAt">): void {
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

export function mountApp(
  root: HTMLElement,
  store: AppStore,
  connectionKind: ConnectionKind = "local",
): void {
  // Render only after init resolves so the first paint already has data; if
  // init rejects, still render with whatever cache exists rather than a blank
  // page (main.tsx already chose a working backend before calling mountApp).
  void store.init().then(
    () => {
      renderApp(root, store, connectionKind);
    },
    (error: unknown) => {
      console.error("mountApp: store init failed, rendering with current state", error);
      renderApp(root, store, connectionKind);
    },
  );
}

function renderApp(root: HTMLElement, store: AppStore, connectionKind: ConnectionKind): void {
  createRoot(root).render(<App store={store} connectionKind={connectionKind} />);
}