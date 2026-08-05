// Category donut chart. Slice colors are derived at render time from the
// --s-primary hue (rotated per slice) via generatePalette — never literals.
// The canvas is owned by React: the effect draws after mount and re-draws on
// wrapper resize.

import { parse } from "culori";
import { useCallback, useEffect, useMemo, useRef } from "react";
import type { ReactElement } from "react";
import { generatePalette } from "../lib/color";
import { formatBaht } from "../lib/money";
import {
  clearCanvas,
  measureSize,
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

export interface PieChartProps {
  data: PieSlice[];
}

export function PieChart({ data }: PieChartProps): ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Memoized on the count so a data identity change with the same length does
  // not rebuild draw (colors depend only on how many slices there are).
  const colors = useMemo(() => sliceColors(data.length), [data.length]);
  const textColor =
    resolveToken("--s-text") ?? generatePalette(PRIMARY_HUE_FALLBACK).onSurface;

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
    drawDonut(ctx, size.width, size.height, data, colors, textColor);
  }, [data, colors, textColor]);

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
        {data.map((slice, index) => (
          <span key={index} className="chart-legend-item">
            <span
              className="chart-legend-dot"
              style={{
                backgroundColor:
                  colors[index] ??
                  generatePalette(PRIMARY_HUE_FALLBACK).primary,
              }}
            />
            {`${slice.category} ${formatBaht(slice.total)}`}
          </span>
        ))}
      </div>
    </div>
  );
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
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  data: PieSlice[],
  colors: string[],
  textColor: string,
): void {
  const total = data.reduce((sum, slice) => sum + slice.total, 0);
  const radius = Math.min(width, height) / 2 - PADDING;
  if (radius <= 0 || total <= 0) {
    return;
  }

  ctx.save();
  ctx.translate(width / 2, height / 2);
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