import { describe, expect, test } from "bun:test";
import { SAVINGS_QUOTES } from "../src/lib/constants";
import { getDailyQuote } from "../src/lib/quote";

describe("getDailyQuote", () => {
  test("returns the same quote for any time within a day", () => {
    const morning = new Date(2026, 7, 5, 8, 0, 0);
    const evening = new Date(2026, 7, 5, 23, 59, 59);
    expect(getDailyQuote(morning)).toBe(getDailyQuote(evening));
  });

  test("returns different quotes on consecutive days", () => {
    expect(getDailyQuote(new Date(2026, 0, 1))).not.toBe(getDailyQuote(new Date(2026, 0, 2)));
  });

  test("wraps around the quote list from Jan 1 to Dec 31", () => {
    const jan1 = getDailyQuote(new Date(2026, 0, 1));
    const dec31 = getDailyQuote(new Date(2026, 11, 31));
    expect(jan1).toBe(dec31);
  });

  test("leap-year Dec 31 lands on a different quote than non-leap Dec 31", () => {
    expect(getDailyQuote(new Date(2024, 11, 31))).not.toBe(getDailyQuote(new Date(2026, 11, 31)));
  });

  test("is deterministic for identical date arguments", () => {
    const date = new Date(2026, 7, 5);
    expect(getDailyQuote(date)).toBe(getDailyQuote(date));
  });

  test("returns one of the configured quotes", () => {
    expect(SAVINGS_QUOTES).toContain(getDailyQuote(new Date(2026, 7, 5)));
  });
});
