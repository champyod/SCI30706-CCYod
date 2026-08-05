import { describe, expect, test } from "bun:test";
import { formatBaht, parseAmount } from "../src/lib/money";

describe("formatBaht", () => {
  test("formats with thousands separator and 2 decimals", () => {
    expect(formatBaht(1234.5)).toBe("1,234.50");
  });

  test("formats zero as 0.00", () => {
    expect(formatBaht(0)).toBe("0.00");
  });
});

describe("parseAmount", () => {
  test("parses a plain integer string", () => {
    expect(parseAmount("1000")).toBe(1000);
  });

  test("returns null for zero", () => {
    expect(parseAmount("0")).toBeNull();
  });

  test("returns null for negative values", () => {
    expect(parseAmount("-5")).toBeNull();
  });

  test("returns null for non-numeric input", () => {
    expect(parseAmount("abc")).toBeNull();
  });

  test("returns null for empty string", () => {
    expect(parseAmount("")).toBeNull();
  });

  test("trims surrounding whitespace", () => {
    expect(parseAmount(" 250.5 ")).toBe(250.5);
  });
});