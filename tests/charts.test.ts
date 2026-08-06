import { describe, expect, test } from "bun:test";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { BarChart } from "../src/components/BarChart";
import { LineChart } from "../src/components/LineChart";
import { PieChart, sliceColors } from "../src/components/PieChart";

// Charts are recharts-backed now: recharts defers SVG construction to a
// client-side effect, so renderToString only sees the sizing wrapper. The
// actual SVG (svg.recharts-surface) is asserted by the browser E2E script;
// here we only pin the static wrapper and the pure sliceColors logic.

describe("BarChart", () => {
  test("renders a sized wrapper without crashing", () => {
    const html = renderToString(
      createElement(BarChart, {
        data: [100, 250, 75],
        labels: ["ม.ค.", "ก.พ.", "มี.ค."],
      }),
    );
    expect(html).toContain('class="h-44 w-full"');
    expect(html).toContain("recharts-wrapper");
  });

  test("renders empty data and labels without crashing", () => {
    const html = renderToString(createElement(BarChart, { data: [], labels: [] }));
    expect(html).toContain("recharts-wrapper");
  });
});

describe("LineChart", () => {
  test("renders a sized wrapper without crashing", () => {
    const html = renderToString(
      createElement(LineChart, {
        data: {
          labels: ["2026-01", "2026-02"],
          income: [1000, 2000],
          expense: [500, 800],
        },
      }),
    );
    expect(html).toContain('class="h-44 w-full"');
    expect(html).toContain("recharts-wrapper");
  });

  test("renders empty series without crashing", () => {
    const html = renderToString(
      createElement(LineChart, { data: { labels: [], income: [], expense: [] } }),
    );
    expect(html).toContain("recharts-wrapper");
  });
});

describe("PieChart", () => {
  test("renders a sized wrapper without crashing", () => {
    const html = renderToString(
      createElement(PieChart, {
        data: [
          { category: "อาหาร", total: 1200 },
          { category: "เดินทาง", total: 300 },
        ],
      }),
    );
    expect(html).toContain('class="h-44 w-full"');
    expect(html).toContain("recharts-wrapper");
  });

  test("renders empty data without crashing", () => {
    const html = renderToString(createElement(PieChart, { data: [] }));
    expect(html).toContain("recharts-wrapper");
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
