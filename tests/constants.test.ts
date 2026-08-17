import { describe, expect, test } from "bun:test";
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  SAVINGS_QUOTES,
} from "../src/lib/constants";

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
