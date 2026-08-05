import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { generatePalette } from "../src/lib/color";
import {
  applyPaletteToCssVars,
  applyTheme,
  DEFAULT_HUE,
  HUE_STORAGE_KEY,
  loadHue,
  MAX_HUE,
  MIN_HUE,
  paletteToCssVarMap,
  parseHue,
  presetHues,
  saveHue,
} from "../src/components/theme-logic";

const memory = new Map<string, string>();

const localStorageStub = {
  getItem: (key: string): string | null => memory.get(key) ?? null,
  setItem: (key: string, value: string): void => {
    memory.set(key, value);
  },
};

function installStorage(storage: unknown): void {
  Object.defineProperty(globalThis, "localStorage", {
    value: storage,
    configurable: true,
  });
}

describe("parseHue", () => {
  test("falls back to the default for null", () => {
    expect(parseHue(null)).toBe(DEFAULT_HUE);
  });

  test("falls back to the default for empty and non-numeric input", () => {
    expect(parseHue("")).toBe(DEFAULT_HUE);
    expect(parseHue("abc")).toBe(DEFAULT_HUE);
    expect(parseHue("12px")).toBe(DEFAULT_HUE);
  });

  test("parses valid numeric strings", () => {
    expect(parseHue("0")).toBe(0);
    expect(parseHue("180")).toBe(180);
    expect(parseHue("360")).toBe(360);
  });

  test("clamps out-of-range values into the hue wheel", () => {
    expect(parseHue("999")).toBe(MAX_HUE);
    expect(parseHue("-10")).toBe(MIN_HUE);
  });
});

describe("presetHues", () => {
  test("is non-empty and every stop stays inside the hue wheel", () => {
    expect(presetHues.length).toBeGreaterThan(0);
    for (const presetHue of presetHues) {
      expect(presetHue).toBeGreaterThanOrEqual(MIN_HUE);
      expect(presetHue).toBeLessThanOrEqual(MAX_HUE);
    }
  });
});

describe("paletteToCssVarMap", () => {
  test("covers every palette field with a --c-/--s- token", () => {
    const palette = generatePalette(180);
    const map = paletteToCssVarMap(palette);
    const fields = [
      "primary",
      "onPrimary",
      "surface",
      "onSurface",
      "income",
      "expense",
    ] as const;
    for (const field of fields) {
      expect(Object.values(map)).toContain(palette[field]);
    }
    for (const name of Object.keys(map)) {
      expect(name.startsWith("--c-") || name.startsWith("--s-")).toBe(true);
    }
  });

  test("maps each semantic token to its palette source", () => {
    const palette = generatePalette(180);
    const map = paletteToCssVarMap(palette);
    expect(map["--s-primary"]).toBe(palette.primary);
    expect(map["--c-btn-primary-bg"]).toBe(palette.primary);
    expect(map["--s-surface"]).toBe(palette.surface);
    expect(map["--c-card-bg"]).toBe(palette.surface);
    expect(map["--s-text"]).toBe(palette.onSurface);
    expect(map["--s-income"]).toBe(palette.income);
    expect(map["--s-expense"]).toBe(palette.expense);
    expect(map["--c-btn-primary-text"]).toBe(palette.onPrimary);
  });
});

describe("document-free guards (SSR)", () => {
  test("applyPaletteToCssVars is a no-op without a document", () => {
    expect(() => applyPaletteToCssVars(generatePalette(180))).not.toThrow();
  });

  test("applyTheme is a no-op without a document", () => {
    expect(() => applyTheme(180)).not.toThrow();
  });

  test("loadHue returns the default without localStorage", () => {
    installStorage(undefined);
    expect(loadHue()).toBe(DEFAULT_HUE);
  });

  test("saveHue does not throw without localStorage", () => {
    installStorage(undefined);
    expect(() => saveHue(120)).not.toThrow();
  });
});

describe("loadHue/saveHue persistence", () => {
  beforeAll(() => {
    installStorage(localStorageStub);
  });

  afterAll(() => {
    installStorage(undefined);
  });

  test("saveHue then loadHue round-trips through the injected storage", () => {
    memory.clear();
    saveHue(180);
    expect(loadHue()).toBe(180);
    expect(memory.get(HUE_STORAGE_KEY)).toBe("180");
  });

  test("loadHue falls back to the default for a missing key", () => {
    memory.clear();
    expect(loadHue()).toBe(DEFAULT_HUE);
  });

  test("loadHue falls back when the stored value is not a hue", () => {
    memory.set(HUE_STORAGE_KEY, "not-a-hue");
    expect(loadHue()).toBe(DEFAULT_HUE);
  });

  test("saveHue survives a throwing storage", () => {
    memory.clear();
    installStorage({
      getItem: (key: string): string | null => memory.get(key) ?? null,
      setItem: (): void => {
        throw new Error("quota exceeded");
      },
    });
    expect(() => saveHue(90)).not.toThrow();
  });
});
