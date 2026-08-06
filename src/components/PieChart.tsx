// Category donut chart backed by recharts. Slice colors are derived at render
// time from the --s-primary hue (rotated per slice) via generatePalette —
// never literals.

import { parse } from "culori";
import { useMemo } from "react";
import type { ReactElement } from "react";
import { Cell, Pie, PieChart as RechartsPieChart, Tooltip } from "recharts";
import { generatePalette } from "../lib/color";
import { formatBaht } from "../lib/money";
import { resolveToken } from "./theme-logic";

const INNER_RATIO = 0.6;
const OUTER_RATIO = 0.9;
const HUE_STEP = 30;
const PRIMARY_HUE_FALLBACK = 262; // mirrors --p-primary

export interface PieSlice {
  category: string;
  total: number;
}

export interface PieChartProps {
  data: PieSlice[];
}

export function PieChart({ data }: PieChartProps): ReactElement {
  const colors = useMemo(() => sliceColors(data.length), [data.length]);

  return (
    <div className="h-44 w-full">
      <RechartsPieChart width="100%" height={176}>
        <Pie
          data={data}
          dataKey="total"
          nameKey="category"
          cx="50%"
          cy="50%"
          innerRadius={`${INNER_RATIO * 100}%`}
          outerRadius={`${OUTER_RATIO * 100}%`}
          paddingAngle={2}
          strokeWidth={0}
        >
          {data.map((slice, index) => (
            <Cell
              key={slice.category}
              fill={colors[index] ?? generatePalette(PRIMARY_HUE_FALLBACK).primary}
            />
          ))}
        </Pie>
        <Tooltip formatter={(value) => formatBaht(Number(value))} />
      </RechartsPieChart>
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
