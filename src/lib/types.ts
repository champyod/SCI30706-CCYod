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

export interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  duration: number;
  position: number;
  createdAt: string;
}

export interface Settings {
  savingsBalance: number;
  autoInvestPercent: number;
  autoSavePercent: number;
}
