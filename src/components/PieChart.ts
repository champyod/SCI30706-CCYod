// Category donut chart. Slice colors are derived at render time from the
// --s-primary hue (rotated per slice) via generatePalette — never literals.

import { parse } from "culori";
import { generatePalette } from "../lib/color";
import { formatBaht } from "../lib/money";
import {
  clearCanvas,
  measureSize,
  observeResize,
  removeChartContainers,
  resolveToken,
  setupCanvas,
} from "./canvas-utils";

const CHART_CLASS = "chart-pie";
const PADDING = 24;
const INNER_RATIO = 0.6;
const HUE_STEP = 30;
const TWO_PI = Math.PI * 2;
const START_ANGLE = -Math.PI / 2;
const CENTER_FONT = "14px system-ui";
const PRIMARY_HUE_FALLBACK = 262; // mirrors --p-primary

export interface PieSlice {
  category: string;
  total: number;
}

export function renderPieChart(el: HTMLElement, data: PieSlice[]): HTMLElement {
  removeChartContainers(el, CHART_CLASS);
  const colors = sliceColors(data.length);
  const textColor = resolveToken("--s-text") ?? generatePalette(PRIMARY_HUE_FALLBACK).onSurface;

  const wrap = document.createElement("div");
  wrap.className = `chart-wrap ${CHART_CLASS}`;
  const canvas = document.createElement("canvas");
  wrap.appendChild(canvas);
  wrap.appendChild(buildLegend(data, colors));
  el.appendChild(wrap);
  const draw = (): void => drawDonut(wrap, canvas, data, colors, textColor);
  draw();
  observeResize(wrap, draw);
  return wrap;
}

// One palette primary per slice, hue rotating around the primary token's hue.
export function sliceColors(count: number): string[] {
  const baseHue = resolveTokenHue("--s-primary") ?? PRIMARY_HUE_FALLBACK;
  return Array.from(
    { length: count },
    (_, index) => generatePalette(baseHue + index * HUE_STEP).primary,
  );
}

function resolveTokenHue(name: string): number | null {
  const value = resolveToken(name);
  if (value === null) {
    return null;
  }
  const color = parse(value);
  if (color === undefined || color.mode !== "oklch" || typeof color.h !== "number") {
    return null;
  }
  return color.h;
}

function drawDonut(
  wrap: HTMLElement,
  canvas: HTMLCanvasElement,
  data: PieSlice[],
  colors: string[],
  textColor: string,
): void {
  const size = measureSize(wrap);
  if (size === null) {
    return;
  }
  const ctx = setupCanvas(canvas, size.width, size.height);
  if (ctx === null) {
    return;
  }
  clearCanvas(canvas, ctx, size.width, size.height);

  const total = data.reduce((sum, slice) => sum + slice.total, 0);
  const radius = Math.min(size.width, size.height) / 2 - PADDING;
  if (radius <= 0 || total <= 0) {
    return;
  }

  ctx.save();
  ctx.translate(size.width / 2, size.height / 2);
  let startAngle = START_ANGLE;
  for (let index = 0; index < data.length; index += 1) {
    const slice = data[index];
    if (slice === undefined) {
      continue;
    }
    const sweep = (slice.total / total) * TWO_PI;
    ctx.fillStyle = colors[index] ?? generatePalette(PRIMARY_HUE_FALLBACK).primary;
    ctx.beginPath();
    ctx.arc(0, 0, radius, startAngle, startAngle + sweep);
    ctx.arc(0, 0, radius * INNER_RATIO, startAngle + sweep, startAngle, true);
    ctx.closePath();
    ctx.fill();
    startAngle += sweep;
  }

  ctx.font = CENTER_FONT;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = textColor;
  ctx.fillText(formatBaht(total), 0, 0);
  ctx.restore();
}

function buildLegend(data: PieSlice[], colors: string[]): HTMLElement {
  const legend = document.createElement("div");
  legend.className = "chart-legend";
  for (let index = 0; index < data.length; index += 1) {
    const slice = data[index];
    if (slice === undefined) {
      continue;
    }
    legend.appendChild(
      buildLegendItem(
        colors[index] ?? generatePalette(PRIMARY_HUE_FALLBACK).primary,
        slice.category,
        formatBaht(slice.total),
      ),
    );
  }
  return legend;
}

function buildLegendItem(color: string, category: string, amount: string): HTMLElement {
  const item = document.createElement("span");
  item.className = "chart-legend-item";
  const dot = document.createElement("span");
  dot.className = "chart-legend-dot";
  dot.style.backgroundColor = color;
  item.appendChild(dot);
  item.appendChild(document.createTextNode(`${category} ${amount}`));
  return item;
}
