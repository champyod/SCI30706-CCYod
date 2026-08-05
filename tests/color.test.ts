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

describe("contrastRatio", () => {
  test("white on black is roughly 21:1", () => {
    expect(contrastRatio("white", "black")).toBeGreaterThan(20);
  });

  test("black on black is 1:1", () => {
    expect(contrastRatio("black", "black")).toBe(1);
  });
});

describe("generatePalette", () => {
  test("different hues produce different primaries", () => {
    expect(generatePalette(150).primary).not.toBe(generatePalette(260).primary);
  });

  test("returns every key as a non-empty oklch string", () => {
    const palette = generatePalette(200);
    for (const key of PALETTE_KEYS) {
      expect(palette[key].length).toBeGreaterThan(0);
      expect(palette[key]).toMatch(/^oklch\(/);
    }
  });
});

describe("palette contrast", () => {
  test("onPrimary reads on primary (>= 4.5)", () => {
    const palette = generatePalette(200);
    expect(contrastRatio(palette.onPrimary, palette.primary)).toBeGreaterThanOrEqual(4.5);
  });

  test("onSurface reads on surface (>= 4.5)", () => {
    const palette = generatePalette(200);
    expect(contrastRatio(palette.onSurface, palette.surface)).toBeGreaterThanOrEqual(4.5);
  });

  test("income reads on surface (>= 4.5)", () => {
    const palette = generatePalette(200);
    expect(contrastRatio(palette.income, palette.surface)).toBeGreaterThanOrEqual(4.5);
  });

  test("expense reads on surface (>= 4.5)", () => {
    const palette = generatePalette(200);
    expect(contrastRatio(palette.expense, palette.surface)).toBeGreaterThanOrEqual(4.5);
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
