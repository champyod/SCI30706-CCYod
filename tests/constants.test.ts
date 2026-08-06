import { describe, expect, test } from "bun:test";
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  INTEREST_RATE,
  SAVINGS_QUOTES,
  STORAGE_KEYS,
} from "../src/lib/constants";
import type { StorageKey } from "../src/lib/types";

describe("INCOME_CATEGORIES", () => {
  test("has no duplicate entries", () => {
    expect(new Set(INCOME_CATEGORIES).size).toBe(INCOME_CATEGORIES.length);
  });
});

describe("EXPENSE_CATEGORIES", () => {
  test("has no duplicate entries", () => {
    expect(new Set(EXPENSE_CATEGORIES).size).toBe(EXPENSE_CATEGORIES.length);
  });
});

describe("INTEREST_RATE", () => {
  test("equals 0.015", () => {
    expect(INTEREST_RATE).toBe(0.015);
  });
});

describe("STORAGE_KEYS", () => {
  const storageKeyNames: StorageKey[] = [
    "transactions",
    "goals",
    "savings_balance",
    "total_deducted",
    "auto_invest_percent",
    "auto_save_percent",
  ];

  test("maps exactly the 6 StorageKey values", () => {
    expect(Object.keys(STORAGE_KEYS).sort()).toEqual([...storageKeyNames].sort());
  });

  test("maps each key to its expected localStorage string", () => {
    expect(STORAGE_KEYS.transactions).toBe("fingoal_transactions");
    expect(STORAGE_KEYS.goals).toBe("fingoal_goals");
    expect(STORAGE_KEYS.savings_balance).toBe("fingoal_savings_balance");
    expect(STORAGE_KEYS.total_deducted).toBe("fingoal_total_deducted");
    expect(STORAGE_KEYS.auto_invest_percent).toBe("fingoal_auto_invest_percent");
    expect(STORAGE_KEYS.auto_save_percent).toBe("fingoal_auto_save_percent");
  });
});

describe("SAVINGS_QUOTES", () => {
  test("has at least 4 entries", () => {
    expect(SAVINGS_QUOTES.length).toBeGreaterThanOrEqual(4);
  });

  test("has no empty strings", () => {
    for (const quote of SAVINGS_QUOTES) {
      expect(quote.trim().length).toBeGreaterThan(0);
    }
  });
});
