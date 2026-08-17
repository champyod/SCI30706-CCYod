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
  autoInvestPercent: number;
  autoSavePercent: number;
}
