import { describe, expect, test } from "bun:test";
import { CHART_MONTHS, formatThaiDate, monthKey, todayKey } from "../src/lib/date";

describe("monthKey", () => {
  test("extracts YYYY-MM from a date key", () => {
    expect(monthKey("2026-08-05")).toBe("2026-08");
  });
});

describe("formatThaiDate", () => {
  test("formats a mid-year date with Thai month and Buddhist year", () => {
    expect(formatThaiDate("2026-08-05")).toBe("5 ส.ค. 2569");
  });

  test("formats a January date with Thai month and Buddhist year", () => {
    expect(formatThaiDate("2026-01-31")).toBe("31 ม.ค. 2569");
  });
});

describe("todayKey", () => {
  test("matches YYYY-MM-DD format", () => {
    expect(todayKey()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe("CHART_MONTHS", () => {
  test("has length 6", () => {
    expect(CHART_MONTHS.length).toBe(6);
  });

  test("ends at the current month", () => {
    expect(CHART_MONTHS[CHART_MONTHS.length - 1]).toBe(monthKey(todayKey()));
  });

  test("every entry is in YYYY-MM format", () => {
    for (const key of CHART_MONTHS) {
      expect(key).toMatch(/^\d{4}-\d{2}$/);
    }
  });
});