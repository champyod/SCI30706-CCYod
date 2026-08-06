export type TxType = "income" | "expense";

export interface Tx {
  id: string;
  type: TxType;
  category: string;
  amount: number;
  note: string;
  date: string;
  createdAt: string;
}

export type GoalMode = "daily" | "weekly";

export interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  mode: GoalMode;
  duration: number;
  position: number;
  createdAt: string;
}

export interface Settings {
  savingsBalance: number;
  totalDeducted: number;
  autoInvestPercent: number;
  autoSavePercent: number;
}

export type StorageKey =
  | "transactions"
  | "goals"
  | "savings_balance"
  | "total_deducted"
  | "auto_invest_percent"
  | "auto_save_percent";
