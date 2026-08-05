// Income vs expense line chart. Two polylines plus a legend whose dot colors
// come from the same resolved tokens as the drawn lines.

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

const CHART_CLASS = "chart-line";
const GRID_STEPS = 4;
const LINE_WIDTH = 2;
const DOT_RADIUS = 3;
const TWO_PI = Math.PI * 2;
const PADDING = { top: 12, right: 12, bottom: 12, left: 44 } as const;
const INCOME_LABEL = "รายรับ";
const EXPENSE_LABEL = "รายจ่าย";
const INCOME_HUE_FALLBACK = 140; // mirrors --p-green
const EXPENSE_HUE_FALLBACK = 25; // mirrors --p-red
const GRID_HUE_FALLBACK = 262; // mirrors --p-primary

export interface LineSeries {
  labels: string[];
  income: number[];
  expense: number[];
}

export function renderLineChart(el: HTMLElement, data: LineSeries): HTMLElement {
  removeChartContainers(el, CHART_CLASS);
  const incomeColor = resolveToken("--s-income") ?? generatePalette(INCOME_HUE_FALLBACK).income;
  const expenseColor = resolveToken("--s-expense") ?? generatePalette(EXPENSE_HUE_FALLBACK).expense;
  const gridColor = resolveToken("--c-card-border") ?? generatePalette(GRID_HUE_FALLBACK).primary;
  const textColor = resolveToken("--s-text") ?? generatePalette(GRID_HUE_FALLBACK).onSurface;

  const wrap = document.createElement("div");
  wrap.className = `chart-wrap ${CHART_CLASS}`;
  const canvas = document.createElement("canvas");
  wrap.appendChild(canvas);
  wrap.appendChild(buildLegend(incomeColor, expenseColor));
  el.appendChild(wrap);
  const draw = (): void =>
    drawLines(wrap, canvas, data, incomeColor, expenseColor, gridColor, textColor);
  draw();
  observeResize(wrap, draw);
  return wrap;
}

function drawLines(
  wrap: HTMLElement,
  canvas: HTMLCanvasElement,
  data: LineSeries,
  incomeColor: string,
  expenseColor: string,
  gridColor: string,
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

  const maxValue = computeNiceMax(Math.max(0, ...data.income, ...data.expense), GRID_STEPS);
  const plotWidth = size.width - PADDING.left - PADDING.right;
  const plotHeight = size.height - PADDING.top - PADDING.bottom;

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

  ctx.lineWidth = LINE_WIDTH;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  drawPolyline(ctx, data.income, maxValue, plotWidth, plotHeight, incomeColor);
  drawPolyline(ctx, data.expense, maxValue, plotWidth, plotHeight, expenseColor);
  ctx.restore();
}

function drawPolyline(
  ctx: CanvasRenderingContext2D,
  values: number[],
  maxValue: number,
  plotWidth: number,
  plotHeight: number,
  color: string,
): void {
  const pointCount = values.length;
  if (pointCount === 0) {
    return;
  }
  const stepX = pointCount > 1 ? plotWidth / (pointCount - 1) : 0;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let index = 0; index < pointCount; index += 1) {
    const x = pointCount > 1 ? index * stepX : plotWidth / 2;
    const ratio = maxValue > 0 ? (values[index] ?? 0) / maxValue : 0;
    const y = plotHeight - ratio * plotHeight;
    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  if (pointCount === 1) {
    // A single point cannot form a line; draw a dot instead.
    ctx.arc(plotWidth / 2, plotHeight, DOT_RADIUS, 0, TWO_PI);
    ctx.fill();
    return;
  }
  ctx.stroke();
}

function buildLegend(incomeColor: string, expenseColor: string): HTMLElement {
  const legend = document.createElement("div");
  legend.className = "chart-legend";
  legend.appendChild(buildLegendItem(incomeColor, INCOME_LABEL));
  legend.appendChild(buildLegendItem(expenseColor, EXPENSE_LABEL));
  return legend;
}

function buildLegendItem(color: string, label: string): HTMLElement {
  const item = document.createElement("span");
  item.className = "chart-legend-item";
  const dot = document.createElement("span");
  dot.className = "chart-legend-dot";
  dot.style.backgroundColor = color;
  item.appendChild(dot);
  item.appendChild(document.createTextNode(label));
  return item;
}
