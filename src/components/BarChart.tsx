// Monthly expense bar chart. Every color resolves from a CSS token at draw
// time; generatePalette is only a fallback so charts never carry literals.
// The canvas is owned by React: the effect draws after mount and re-draws on
// wrapper resize, so the imperative observeResize/removeChartContainers pair
// from canvas-utils is not needed.

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

const CHART_CLASS = "chart-bar";
const GRID_STEPS = 4;
const BAR_GAP = 2;
const PADDING = { top: 12, right: 8, bottom: 28, left: 44 } as const;
const AXIS_LABEL_FONT = "11px system-ui";
const AXIS_LABEL_Y_OFFSET = 14;
const EXPENSE_HUE_FALLBACK = 25; // mirrors --p-red
const GRID_HUE_FALLBACK = 262; // mirrors --p-primary

export interface BarChartProps {
  data: number[];
  labels: string[];
}

export function BarChart({ data, labels }: BarChartProps): ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Keyed on data/labels so a props change rebuilds draw and the effect
  // re-paints; the two refs are stable and safe to omit from the deps.
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
    drawBars(ctx, size.width, size.height, data, labels);
  }, [data, labels]);

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
    </div>
  );
}

function drawBars(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  data: number[],
  labels: string[],
): void {
  const barColor =
    resolveToken("--s-expense") ?? generatePalette(EXPENSE_HUE_FALLBACK).expense;
  const gridColor =
    resolveToken("--c-card-border") ?? generatePalette(GRID_HUE_FALLBACK).primary;
  const textColor =
    resolveToken("--s-text") ?? generatePalette(GRID_HUE_FALLBACK).onSurface;

  const maxValue = computeNiceMax(Math.max(0, ...data), GRID_STEPS);
  const plotWidth = width - PADDING.left - PADDING.right;
  const plotHeight = height - PADDING.top - PADDING.bottom;
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
