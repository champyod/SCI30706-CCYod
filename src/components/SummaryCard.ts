import { getBalance, sumByType } from "../lib/finance";
import { formatBaht } from "../lib/money";
import type { AppStore } from "../lib/store";

const INCOME_LABEL = "Income";
const EXPENSE_LABEL = "Expense";
const BALANCE_LABEL = "Balance";

const TONE_CLASSES = {
  income: "stat-income",
  expense: "stat-expense",
  balance: "",
} as const;

/**
 * Three summary stat cards (income / expense / balance) derived from the
 * store's transactions. Tone is applied through token classes only — the
 * component itself never hardcodes a color.
 */
export function renderSummary(store: AppStore): HTMLElement {
  const income = sumByType(store.transactions, "income");
  const expense = sumByType(store.transactions, "expense");
  const balance = getBalance(income, expense);
  const grid = document.createElement("section");
  grid.className = "summary-grid";
  grid.appendChild(createStatCard(INCOME_LABEL, formatBaht(income), TONE_CLASSES.income));
  grid.appendChild(createStatCard(EXPENSE_LABEL, formatBaht(expense), TONE_CLASSES.expense));
  grid.appendChild(createStatCard(BALANCE_LABEL, formatBaht(balance), TONE_CLASSES.balance));
  return grid;
}

function createStatCard(label: string, value: string, toneClass: string): HTMLElement {
  const card = document.createElement("div");
  card.className = toneClass.length > 0 ? `stat-card ${toneClass}` : "stat-card";
  card.appendChild(createLabel(label));
  card.appendChild(createValue(value));
  return card;
}

function createLabel(label: string): HTMLElement {
  const element = document.createElement("span");
  element.className = "stat-label";
  element.textContent = label;
  return element;
}

function createValue(value: string): HTMLElement {
  const element = document.createElement("strong");
  element.className = "stat-value";
  element.textContent = value;
  return element;
}
