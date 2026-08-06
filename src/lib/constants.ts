import type { StorageKey } from "./types";

export const INCOME_CATEGORIES = ["เงินเดือน", "งานเสริม", "ของขวัญ", "อื่นๆ"];

export const EXPENSE_CATEGORIES = [
  "อาหาร",
  "เดินทาง",
  "ช้อปปิ้ง",
  "ความบันเทิง",
  "ที่อยู่อาศัย",
  "สุขภาพ",
  "อื่นๆ",
];

export const INTEREST_RATE = 0.015;

export const SAVINGS_QUOTES = [
  "ออมวันละนิด พอเพียงทุกวัน",
  "เงินออมคือรากฐานของอนาคต",
  "ใช้ก่อนเหลือค่อยเก็บ ไม่มีวันรวย",
  "หยอดกระปุกทุกวัน ความมั่งคั่งจะตามมา",
];

export const STORAGE_KEYS: Record<StorageKey, string> = {
  transactions: "fingoal_transactions",
  goals: "fingoal_goals",
  savings_balance: "fingoal_savings_balance",
  total_deducted: "fingoal_total_deducted",
  auto_invest_percent: "fingoal_auto_invest_percent",
  auto_save_percent: "fingoal_auto_save_percent",
};