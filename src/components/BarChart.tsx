// Monthly expense bar chart backed by recharts. Colors resolve from CSS theme
// tokens at render time; generatePalette is only a fallback so charts never
// carry literals.

import type { ReactElement } from "react";
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { generatePalette } from "../lib/color";
import { resolveToken } from "./theme-logic";

const GRID_HUE_FALLBACK = 262; // mirrors --p-primary
const EXPENSE_HUE_FALLBACK = 25; // mirrors --p-red

export interface BarChartProps {
  data: number[];
  labels: string[];
}

export function BarChart({ data, labels }: BarChartProps): ReactElement {
  const expenseColor =
    resolveToken("--s-expense") ?? generatePalette(EXPENSE_HUE_FALLBACK).expense;
  const gridColor =
    resolveToken("--c-card-border") ?? generatePalette(GRID_HUE_FALLBACK).primary;
  const textColor =
    resolveToken("--s-text") ?? generatePalette(GRID_HUE_FALLBACK).onSurface;

  const rows = labels.map((label, index) => ({
    label,
    value: data[index] ?? 0,
  }));

  return (
    <div className="h-44 w-full">
      <RechartsBarChart
        width="100%"
        height={176}
        data={rows}
        margin={{ top: 4, right: 8, bottom: 0, left: -16 }}
      >
        <CartesianGrid stroke={gridColor} vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: textColor, fontSize: 11 }}
          axisLine={{ stroke: gridColor }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: textColor, fontSize: 11 }}
          axisLine={{ stroke: gridColor }}
          tickLine={false}
          width={44}
        />
        <Tooltip />
        <Bar dataKey="value" fill={expenseColor} radius={[2, 2, 0, 0]} />
      </RechartsBarChart>
    </div>
  );
}
