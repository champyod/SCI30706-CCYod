import { SAVINGS_QUOTES } from "./constants";

const MILLISECONDS_PER_DAY = 86_400_000;

/**
 * Pick today's savings quote, deterministic per calendar date.
 * The optional `date` argument exists so callers (and tests) can pin the day
 * without relying on the clock or mocking Date.
 */
export function getDailyQuote(date: Date = new Date()): string {
  if (SAVINGS_QUOTES.length === 0) {
    return "";
  }
  const dayOfYear = getDayOfYear(date);
  const quote = SAVINGS_QUOTES[(dayOfYear - 1) % SAVINGS_QUOTES.length];
  return quote ?? "";
}

/**
 * 1-based day-of-year via UTC midnights: both operands are constructed from
 * the date's own calendar fields, so the difference is an exact multiple of a
 * day regardless of timezone offset or DST (Jan 1 = 1).
 */
function getDayOfYear(date: Date): number {
  const utcMidnight = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const startOfYearUtc = Date.UTC(date.getFullYear(), 0, 0);
  return Math.floor((utcMidnight - startOfYearUtc) / MILLISECONDS_PER_DAY);
}
