import { describe, expect, test } from "bun:test";
import {
  contrastRatio,
  ensureContrast,
  generatePalette,
  type Palette,
} from "../src/lib/color";

const PALETTE_KEYS: Array<keyof Palette> = [
  "primary",
  "onPrimary",
  "surface",
  "onSurface",
  "income",
  "expense",
];

function oklchHue(color: string): number {
  const inside = /oklch\(([^)]+)\)/.exec(color)?.[1] ?? "";
  const parts = inside.trim().split(/\s+/);
  return Number(parts[2]);
}

describe("contrastRatio", () => {
  test("white on black is roughly 21:1", () => {
    expect(contrastRatio("white", "black")).toBeGreaterThan(20);
  });

  test("black on black is 1:1", () => {
    expect(contrastRatio("black", "black")).toBe(1);
  });
});

describe("generatePalette", () => {
  test("differs by hue", () => {
    expect(generatePalette(150).primary).not.toBe(generatePalette(260).primary);
  });

  test("produces a complete oklch palette", () => {
    const palette = generatePalette(200);
    for (const key of PALETTE_KEYS) {
      expect(palette[key]).toMatch(/^oklch\(/);
    }
  });

  test("contrast gates hold", () => {
    const palette = generatePalette(200);
    expect(contrastRatio(palette.onPrimary, palette.primary)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(palette.onSurface, palette.surface)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(palette.income, palette.surface)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(palette.expense, palette.surface)).toBeGreaterThanOrEqual(4.5);
  });

  test("income stays green and expense stays red for representative hues", () => {
    for (const hue of [150, 200, 260, 350, 65]) {
      const palette = generatePalette(hue);
      const incomeHue = oklchHue(palette.income);
      const expenseHue = oklchHue(palette.expense);
      expect(incomeHue).toBeGreaterThanOrEqual(95);
      expect(incomeHue).toBeLessThanOrEqual(170);
      expect(expenseHue >= 330 || expenseHue <= 30).toBe(true);
    }
  });
});

describe("ensureContrast", () => {
  test("darkens a light fg that fails contrast and reaches >= 4.5", () => {
    const original = "oklch(0.9 0.1 90)";
    const bg = "oklch(0.97 0.01 0)";
    const result = ensureContrast(original, bg);
    expect(result).toHaveProperty("fg");
    expect(result).toHaveProperty("bg");
    expect(result.fg).not.toBe(original);
    expect(result.bg).toBe(bg);
    expect(contrastRatio(result.fg, result.bg)).toBeGreaterThanOrEqual(4.5);
  });

  test("custom min of 3 accepts a pair passing 3.0 but failing 4.5", () => {
    const fg = "oklch(0.75 0.1 90)";
    const bg = "oklch(0.97 0.01 0)";
    const atFourFive = contrastRatio(fg, bg);
    expect(atFourFive).toBeLessThan(4.5);
    const result = ensureContrast(fg, bg, 3);
    expect(contrastRatio(result.fg, result.bg)).toBeGreaterThanOrEqual(3);
  });
});