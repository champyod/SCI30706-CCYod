declare module "culori" {
  export interface Oklch {
    mode: "oklch";
    l: number;
    c: number;
    h: number | undefined;
    alpha?: number;
  }

  export type Color = Oklch | { mode: string; [channel: string]: unknown };

  export function parse(input: string): Color | undefined;
  export function formatCss(color: Color): string;
  export function wcagContrast(colorA: Color, colorB: Color): number;
  export function converter(mode: "oklch"): (color: Color) => Oklch;
}