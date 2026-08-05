import { describe, expect, test } from "bun:test";
import { calcCompoundInterest } from "../src/lib/interest";

describe("calcCompoundInterest", () => {
  test("compounds principal over periods", () => {
    expect(calcCompoundInterest(1000, 0.015, 12)).toBeCloseTo(1195.62, 2);
  });

  test("returns 0 when principal is 0", () => {
    expect(calcCompoundInterest(0, 0.015, 12)).toBe(0);
  });

  test("returns principal when rate is 0", () => {
    expect(calcCompoundInterest(1000, 0, 12)).toBe(1000);
  });

  test("returns principal when periods is 0", () => {
    expect(calcCompoundInterest(1000, 0.015, 0)).toBe(1000);
  });
});