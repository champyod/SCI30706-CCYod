// Income vs expense line chart backed by recharts. Line colors resolve from
// CSS theme tokens at render time; generatePalette is only a fallback so
// charts never carry literals.

import type { ReactElement } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { generatePalette } from "../lib/color";
import { resolveToken } from "./theme-logic";

const INCOME_HUE_FALLBACK = 140; // mirrors --p-green
const EXPENSE_HUE_FALLBACK = 25; // mirrors --p-red
const GRID_HUE_FALLBACK = 262; // mirrors --p-primary
const INCOME_LABEL = "รายรับ";
const EXPENSE_LABEL = "รายจ่าย";

export interface LineSeries {
  labels: string[];
  income: number[];
  expense: number[];
}

export interface LineChartProps {
  data: LineSeries;
}

export function LineChart({ data }: LineChartProps): ReactElement {
  const incomeColor =
    resolveToken("--s-income") ?? generatePalette(INCOME_HUE_FALLBACK).income;
  const expenseColor =
    resolveToken("--s-expense") ?? generatePalette(EXPENSE_HUE_FALLBACK).expense;
  const gridColor =
    resolveToken("--c-card-border") ?? generatePalette(GRID_HUE_FALLBACK).primary;
  const textColor =
    resolveToken("--s-text") ?? generatePalette(GRID_HUE_FALLBACK).onSurface;

  const rows = data.labels.map((label, index) => ({
    label,
    income: data.income[index] ?? 0,
    expense: data.expense[index] ?? 0,
  }));

  return (
    <div className="h-44 w-full">
      <RechartsLineChart
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
        <Legend
          wrapperStyle={{ fontSize: 12, color: textColor }}
          formatter={(value) => (
            <span className="text-ink-dim">{value}</span>
          )}
        />
        <Line
          type="monotone"
          dataKey="income"
          name={INCOME_LABEL}
          stroke={incomeColor}
          strokeWidth={2}
          dot={{ r: 3, fill: incomeColor, strokeWidth: 0 }}
        />
        <Line
          type="monotone"
          dataKey="expense"
          name={EXPENSE_LABEL}
          stroke={expenseColor}
          strokeWidth={2}
          dot={{ r: 3, fill: expenseColor, strokeWidth: 0 }}
        />
      </RechartsLineChart>
    </div>
  );
}
