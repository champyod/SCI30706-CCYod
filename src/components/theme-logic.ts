import { generatePalette } from "../lib/color";
import type { Palette } from "../lib/color";

// 262 matches the app's stock --p-primary hue in styles.css :root.
export const DEFAULT_HUE = 262;
export const MIN_HUE = 0;
export const MAX_HUE = 360;
export const HUE_STORAGE_KEY = "fingoal_hue";

// Evenly spread wheel stops keep the ThemePicker swatch row balanced and let
// every swatch double as a coarse "jump to this hue" control.
export const presetHues: readonly number[] = [0, 45, 90, 135, 180, 225, 270, 315];

export function parseHue(input: string | null): number {
  if (input === null) {
    return DEFAULT_HUE;
  }
  const trimmed = input.trim();
  if (trimmed.length === 0) {
    return DEFAULT_HUE;
  }
  const value = Number(trimmed);
  if (!Number.isFinite(value)) {
    return DEFAULT_HUE;
  }
  return Math.min(MAX_HUE, Math.max(MIN_HUE, value));
}

// Pure field -> token mapping keeps the document-touching apply step unit
// testable: renderToString and bun:test never construct a real document.
// Var names must match the semantic vars consumed by @theme in styles.css.
export function paletteToCssVarMap(palette: Palette): Record<string, string> {
  return {
    "--s-primary": palette.primary,
    "--s-surface": palette.surface,
    "--s-text": palette.onSurface,
    "--s-income": palette.income,
    "--s-expense": palette.expense,
    "--s-on-primary": palette.onPrimary,
    "--s-on-surface": palette.onSurface,
  };
}

export function applyPaletteToCssVars(palette: Palette): void {
  // Guard on the capability rather than `typeof document`: real SSR has no
  // document, and shared test workers may leak a chart shim whose document
  // element style lacks setProperty — both must no-op safely.
  const rootStyle = document?.documentElement?.style;
  if (rootStyle === undefined || typeof rootStyle.setProperty !== "function") {
    return;
  }
  for (const [name, value] of Object.entries(paletteToCssVarMap(palette))) {
    rootStyle.setProperty(name, value);
  }
}

export function saveHue(hue: number): void {
  if (typeof localStorage === "undefined") {
    return;
  }
  try {
    localStorage.setItem(HUE_STORAGE_KEY, String(hue));
  } catch {
    // Best-effort: a full or quarantined storage must not break theme
    // switching, which already applied the palette to the document.
  }
}

export function loadHue(): number {
  if (typeof localStorage === "undefined") {
    return DEFAULT_HUE;
  }
  try {
    return parseHue(localStorage.getItem(HUE_STORAGE_KEY));
  } catch {
    return DEFAULT_HUE;
  }
}

// Client-only apply-and-persist entry point. T17 calls it once on mount to
// restore the saved theme; ThemePicker calls it on every hue change.
export function applyTheme(hue: number): void {
  applyPaletteToCssVars(generatePalette(hue));
  saveHue(hue);
}

// CSS custom property -> computed color string. document may be absent in
// test runners, so every access is guarded.
export function resolveToken(name: string): string | null {
  if (typeof document === "undefined" || typeof getComputedStyle === "undefined") {
    return null;
  }
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value.length > 0 ? value : null;
}
