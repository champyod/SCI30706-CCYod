import { converter, formatCss, parse, wcagContrast } from "culori";
import type { Color } from "culori";

const toOklch = converter("oklch");

const DEFAULT_MIN_CONTRAST = 4.5;
const MIN_LIGHTNESS = 0.02;
const MAX_LIGHTNESS = 0.98;
const LIGHTNESS_STEP = 0.02;
const MAX_STEPS = 200;
const LIGHTNESS_PRECISION = 4;

export interface Palette {
  primary: string;
  onPrimary: string;
  surface: string;
  onSurface: string;
  income: string;
  expense: string;
}

function oklchString(lightness: number, chroma: number, hue: number): string {
  return formatCss({ mode: "oklch", l: lightness, c: chroma, h: hue });
}

function parseColor(input: string): Color {
  const color = parse(input);
  if (color === undefined) {
    throw new Error(`Invalid color string: ${input}`);
  }
  return color;
}

export function contrastRatio(fg: string, bg: string): number {
  return wcagContrast(parseColor(fg), parseColor(bg));
}

export function ensureContrast(
  fg: string,
  bg: string,
  min = DEFAULT_MIN_CONTRAST,
): { fg: string; bg: string } {
  if (contrastRatio(fg, bg) >= min) {
    return { fg, bg };
  }

  const bgIsLight = toOklch(parseColor(bg)).l > 0.5;
  const direction = bgIsLight ? -1 : 1;
  const fgColor = toOklch(parseColor(fg));
  let lightness = fgColor.l;

  for (let step = 0; step < MAX_STEPS; step += 1) {
    lightness = Number(
      (lightness + direction * LIGHTNESS_STEP).toFixed(LIGHTNESS_PRECISION),
    );
    if (lightness < MIN_LIGHTNESS || lightness > MAX_LIGHTNESS) {
      break;
    }
    const candidate = oklchString(lightness, fgColor.c, fgColor.h ?? 0);
    if (contrastRatio(candidate, bg) >= min) {
      return { fg: candidate, bg };
    }
  }

  return { fg, bg };
}

export function generatePalette(hue: number): Palette {
  const primary = oklchString(0.55, 0.15, hue);
  const surface = oklchString(0.97, 0.01, 0);
  const onPrimary = ensureContrast(oklchString(0.98, 0, 0), primary).fg;
  const onSurface = ensureContrast(oklchString(0.25, 0, 0), surface).fg;
  const income = ensureContrast(oklchString(0.65, 0.12, 140), surface).fg;
  const expense = ensureContrast(oklchString(0.62, 0.18, 25), surface).fg;
  return { primary, onPrimary, surface, onSurface, income, expense };
}
