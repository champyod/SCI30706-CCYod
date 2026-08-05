// Monthly expense bar chart. Every color resolves from a CSS token at draw
// time; generatePalette is only a fallback so charts never carry literals.

import { generatePalette } from "../lib/color";
import {
  clearCanvas,
  computeNiceMax,
  drawAxes,
  drawGrid,
  measureSize,
  observeResize,
  removeChartContainers,
  resolveToken,
  setupCanvas,
} from "./canvas-utils";

const CHART_CLASS = "chart-bar";
const GRID_STEPS = 4;
const BAR_GAP = 2;
const PADDING = { top: 12, right: 8, bottom: 28, left: 44 } as const;
const AXIS_LABEL_FONT = "11px system-ui";
const AXIS_LABEL_Y_OFFSET = 14;
const EXPENSE_HUE_FALLBACK = 25; // mirrors --p-red
const GRID_HUE_FALLBACK = 262; // mirrors --p-primary

export function renderBarChart(
  el: HTMLElement,
  data: number[],
  labels: string[],
): HTMLElement {
  removeChartContainers(el, CHART_CLASS);
  const wrap = document.createElement("div");
  wrap.className = `chart-wrap ${CHART_CLASS}`;
  const canvas = document.createElement("canvas");
  wrap.appendChild(canvas);
  el.appendChild(wrap);
  const draw = (): void => drawBars(wrap, canvas, data, labels);
  draw();
  observeResize(wrap, draw);
  return wrap;
}

function drawBars(
  wrap: HTMLElement,
  canvas: HTMLCanvasElement,
  data: number[],
  labels: string[],
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

  const barColor = resolveToken("--s-expense") ?? generatePalette(EXPENSE_HUE_FALLBACK).expense;
  const gridColor = resolveToken("--c-card-border") ?? generatePalette(GRID_HUE_FALLBACK).primary;
  const textColor = resolveToken("--s-text") ?? generatePalette(GRID_HUE_FALLBACK).onSurface;

  const maxValue = computeNiceMax(Math.max(0, ...data), GRID_STEPS);
  const plotWidth = size.width - PADDING.left - PADDING.right;
  const plotHeight = size.height - PADDING.top - PADDING.bottom;
  const slotWidth = plotWidth / Math.max(data.length, 1);
  const barWidth = Math.max(slotWidth - BAR_GAP, 0);

  ctx.save();
  ctx.translate(PADDING.left, PADDING.top);
  drawGrid(ctx, plotWidth, plotHeight, {
    steps: GRID_STEPS,
    maxValue,
    minValue: 0,
    lineColor: gridColor,
    textColor,
  });
  drawAxes(ctx, plotWidth, plotHeight, gridColor);

  ctx.fillStyle = barColor;
  for (let index = 0; index < data.length; index += 1) {
    const value = data[index] ?? 0;
    const barHeight = maxValue > 0 ? (value / maxValue) * plotHeight : 0;
    const x = index * slotWidth + BAR_GAP / 2;
    ctx.fillRect(x, plotHeight - barHeight, barWidth, barHeight);
  }

  ctx.font = AXIS_LABEL_FONT;
  ctx.textAlign = "center";
  for (let index = 0; index < labels.length; index += 1) {
    const x = index * slotWidth + slotWidth / 2;
    ctx.fillText(labels[index] ?? "", x, plotHeight + AXIS_LABEL_Y_OFFSET);
  }
  ctx.restore();
}
