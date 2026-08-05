// Income vs expense line chart. Two polylines plus a legend whose dot colors
// come from the same resolved tokens as the drawn lines. The canvas is owned
// by React: the effect draws after mount and re-draws on wrapper resize.

import { useCallback, useEffect, useRef } from "react";
import type { ReactElement } from "react";
import { generatePalette } from "../lib/color";
import {
  clearCanvas,
  computeNiceMax,
  drawAxes,
  drawGrid,
  measureSize,
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

export interface LineChartProps {
  data: LineSeries;
}

export function LineChart({ data }: LineChartProps): ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Resolved once per render so the legend dots and the drawn lines share the
  // exact same colors; a token lookup cannot run inside JSX or per-draw.
  const incomeColor =
    resolveToken("--s-income") ?? generatePalette(INCOME_HUE_FALLBACK).income;
  const expenseColor =
    resolveToken("--s-expense") ?? generatePalette(EXPENSE_HUE_FALLBACK).expense;
  const gridColor =
    resolveToken("--c-card-border") ?? generatePalette(GRID_HUE_FALLBACK).primary;
  const textColor =
    resolveToken("--s-text") ?? generatePalette(GRID_HUE_FALLBACK).onSurface;

  // Keyed on data + the resolved colors so a props or theme change rebuilds
  // draw and the effect re-paints; the two refs are stable and safe to omit.
  const draw = useCallback((): void => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (canvas === null || wrap === null) {
      return;
    }
    const size = measureSize(wrap);
    if (size === null) {
      return;
    }
    const ctx = setupCanvas(canvas, size.width, size.height);
    if (ctx === null) {
      return;
    }
    clearCanvas(canvas, ctx, size.width, size.height);
    drawLines(
      ctx,
      size.width,
      size.height,
      data,
      incomeColor,
      expenseColor,
      gridColor,
      textColor,
    );
  }, [data, incomeColor, expenseColor, gridColor, textColor]);

  useEffect(() => {
    draw();
    const wrap = wrapRef.current;
    if (wrap === null || typeof ResizeObserver === "undefined") {
      return;
    }
    const observer = new ResizeObserver(draw);
    observer.observe(wrap);
    return () => {
      observer.disconnect();
    };
  }, [draw]);

  return (
    <div ref={wrapRef} className={`chart-wrap ${CHART_CLASS}`}>
      <canvas ref={canvasRef} />
      <div className="chart-legend">
        <span className="chart-legend-item">
          <span
            className="chart-legend-dot"
            style={{ backgroundColor: incomeColor }}
          />
          {INCOME_LABEL}
        </span>
        <span className="chart-legend-item">
          <span
            className="chart-legend-dot"
            style={{ backgroundColor: expenseColor }}
          />
          {EXPENSE_LABEL}
        </span>
      </div>
    </div>
  );
}

function drawLines(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  data: LineSeries,
  incomeColor: string,
  expenseColor: string,
  gridColor: string,
  textColor: string,
): void {
  const maxValue = computeNiceMax(
    Math.max(0, ...data.income, ...data.expense),
    GRID_STEPS,
  );
  const plotWidth = width - PADDING.left - PADDING.right;
  const plotHeight = height - PADDING.top - PADDING.bottom;

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
    const y = pointY(values[index] ?? 0, maxValue, plotHeight);
    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  if (pointCount === 1) {
    // A single point cannot form a line; draw a dot at the value's position.
    ctx.arc(
      plotWidth / 2,
      pointY(values[0] ?? 0, maxValue, plotHeight),
      DOT_RADIUS,
      0,
      TWO_PI,
    );
    ctx.fill();
    return;
  }
  ctx.stroke();
}

// y coordinate of a value within the plot, from baseline (0) up to the top.
function pointY(value: number, maxValue: number, plotHeight: number): number {
  const ratio = maxValue > 0 ? value / maxValue : 0;
  return plotHeight - ratio * plotHeight;
}