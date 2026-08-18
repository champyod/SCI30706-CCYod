import { useCallback, useSyncExternalStore } from "react";
import type { ReactElement } from "react";
import type { Root } from "react-dom/client";
import { toast, Toaster } from "sonner";
import { categoryBreakdown, incomeVsExpense, monthlySeries } from "../lib/chart-data";
import { AppStore } from "../lib/store";
import type { Settings, Tx } from "../lib/types";
import { AutoInvestRow } from "./AutoInvestRow";
import { BarChart } from "./BarChart";
import { GoalCard } from "./GoalCard";
import { GoalForm } from "./GoalForm";
import type { GoalInput } from "./goal-form-logic";
import { Header } from "./Header";
import { LineChart } from "./LineChart";
import { PieChart } from "./PieChart";
import { QuoteBox } from "./QuoteBox";
import { SavingsCard } from "./SavingsCard";
import { SummaryCard } from "./SummaryCard";
import { TxForm } from "./TxForm";
import { TxTable } from "./TxTable";

interface AppProps {
  store: AppStore;
}

const INVEST_SUCCESS = "ลงทุนสำเร็จ";
const SAVE_MONEY_SUCCESS = "บันทึกเงินออมแล้ว";

export function App({ store }: AppProps): ReactElement {
  // Re-render on every store mutation: the snapshot must be a value that
  // changes (store.version), not the store instance (stable reference).
  const subscribe = useCallback(
    (onStoreChange: () => void) => store.subscribe(onStoreChange),
    [store],
  );
  useSyncExternalStore(subscribe, () => store.version);

  const series = incomeVsExpense(store.transactions);
  const barData = monthlySeries(store.transactions, series.labels);
  const pieData = categoryBreakdown(store.transactions);

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-6">
      <Header />
      <Toaster position="top-right" richColors closeButton /> 
      <SummaryCard
        transactions={store.transactions}
        goals={store.goals}
        settings={store.settings}
      />
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
        <TxForm onSubmit={(input) => handleAddTx(store, input)} />
        <TxTable
          transactions={store.transactions}
          pendingIds={store.pendingTxIds}
          onDelete={(id) => handleDeleteTx(store, id)}
        />
      </section>
      <section className="mb-4 rounded-2xl border border-edge bg-card p-4 shadow-sm">
        <h2 className="text-lg font-bold text-ink">Goals</h2>
        <GoalForm onSubmit={(input) => handleAddGoal(store, input)} />
        <AutoInvestRow settings={store.settings} onUpdate={(patch) => handleUpdateSettings(store, patch)} />
        <div className="grid gap-3">
          <SavingsCard
            balance={store.settings.savingsBalance}
            onSave={(amount) => handleSaveMoney(store, amount)}
          />
          {store.goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              pending={store.pendingGoalIds.has(goal.id)}
              onInvest={(id, amount) => handleInvestGoal(store, id, amount)}
              onDelete={(id) => handleDeleteGoal(store, id)}
            />
          ))}
        </div>
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

function handleInvestGoal(store: AppStore, id: string, amount: number): void {
  store
    .investGoal(id, amount)
    .then(() => toast.success(INVEST_SUCCESS))
    .catch((error: unknown) => logBackendError("invest in goal", error));
}

function handleSaveMoney(store: AppStore, amount: number): void {
  store
    .saveMoney(amount)
    .then(() => toast.success(SAVE_MONEY_SUCCESS))
    .catch((error: unknown) => logBackendError("save money", error));
}

function handleUpdateSettings(store: AppStore, patch: Partial<Settings>): void {
  store.updateSettings(patch).catch((error: unknown) => logBackendError("update settings", error));
}

function logBackendError(action: string, error: unknown): void {
  console.error(`Failed to ${action}`, error);
}

export function mountApp(root: Root, store: AppStore): void {
  // main.tsx gates boot: it awaits store.init() (with a timeout) before calling
  // this, so by the time we render the backend has already loaded its data.
  root.render(<App store={store} />);
}
