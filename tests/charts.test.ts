import { describe, expect, test } from "bun:test";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { BarChart } from "../src/components/BarChart";
import { LineChart } from "../src/components/LineChart";
import { PieChart, sliceColors } from "../src/components/PieChart";

// Charts are React components now: renderToString asserts the static markup
// (wrapper class, canvas, legend). The actual canvas pixels are drawn by the
// effect in a browser and are WYSIWYG — not unit-tested post-pivot.

describe("BarChart", () => {
  test("renders a chart-wrap container holding a canvas", () => {
    const html = renderToString(
      createElement(BarChart, {
        data: [100, 250, 75],
        labels: ["ม.ค.", "ก.พ.", "มี.ค."],
      }),
    );
    expect(html).toContain('class="chart-wrap chart-bar"');
    expect(html).toContain("<canvas");
  });

  test("renders empty data and labels without crashing", () => {
    const html = renderToString(createElement(BarChart, { data: [], labels: [] }));
    expect(html).toContain('class="chart-wrap chart-bar"');
    expect(html).toContain("<canvas");
  });
});

describe("LineChart", () => {
  test("renders a legend with the income and expense labels", () => {
    const html = renderToString(
      createElement(LineChart, {
        data: {
          labels: ["2026-01", "2026-02"],
          income: [1000, 2000],
          expense: [500, 800],
        },
      }),
    );
    expect(html).toContain('class="chart-wrap chart-line"');
    expect(html).toContain("<canvas");
    expect(html).toContain("chart-legend-dot");
    expect(html).toContain("รายรับ");
    expect(html).toContain("รายจ่าย");
  });

  test("renders empty series without crashing", () => {
    const html = renderToString(
      createElement(LineChart, { data: { labels: [], income: [], expense: [] } }),
    );
    expect(html).toContain('class="chart-wrap chart-line"');
    expect(html).toContain("<canvas");
  });
});

describe("PieChart", () => {
  test("renders one legend item per slice with formatted amounts", () => {
    const html = renderToString(
      createElement(PieChart, {
        data: [
          { category: "อาหาร", total: 1200 },
          { category: "เดินทาง", total: 300 },
        ],
      }),
    );
    expect(html).toContain('class="chart-wrap chart-pie"');
    expect(html).toContain("<canvas");
    expect(html).toContain("อาหาร 1,200.00");
    expect(html).toContain("เดินทาง 300.00");
  });

  test("renders empty data without crashing", () => {
    const html = renderToString(createElement(PieChart, { data: [] }));
    expect(html).toContain('class="chart-wrap chart-pie"');
    expect(html).toContain("<canvas");
  });
});

describe("sliceColors", () => {
  test("derives one palette color per slice with no duplicates", () => {
    const colors = sliceColors(4);
    expect(colors.length).toBe(4);
    expect(new Set(colors).size).toBe(4);
    expect(colors.every((color) => color.length > 0)).toBe(true);
  });

  test("is stable: same count yields the same colors", () => {
    expect(sliceColors(3)).toEqual(sliceColors(3));
  });
});