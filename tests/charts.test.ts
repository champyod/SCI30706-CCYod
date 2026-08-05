import { describe, expect, test } from "bun:test";
import { renderBarChart } from "../src/components/BarChart";
import { renderLineChart } from "../src/components/LineChart";
import { renderPieChart, sliceColors } from "../src/components/PieChart";
import { FakeElement, setupFakeDom } from "./fake-dom";

// No-op 2d context: charts must survive drawing into a stub without pixels.
const NOOP_CONTEXT: Record<string, unknown> = {
  strokeStyle: "",
  fillStyle: "",
  font: "",
  textAlign: "start",
  textBaseline: "alphabetic",
  lineWidth: 1,
  lineJoin: "miter",
  lineCap: "butt",
  scale() {},
  setTransform() {},
  clearRect() {},
  beginPath() {},
  moveTo() {},
  lineTo() {},
  stroke() {},
  fill() {},
  fillText() {},
  arc() {},
  closePath() {},
  fillRect() {},
  save() {},
  restore() {},
  translate() {},
};

setupFakeDom();

// Everything created by the fake document gets a layout size so the draw path
// runs end to end; canvases additionally hand out a no-op 2d context.
const dom = globalThis.document as unknown as {
  createElement: (tag: string) => FakeElement;
};
const originalCreate = dom.createElement;
dom.createElement = (tag: string) => {
  const element = originalCreate(tag);
  element.clientWidth = 320;
  element.clientHeight = 240;
  if (tag === "canvas") {
    Object.defineProperty(element, "getContext", {
      value: (kind: string) => (kind === "2d" ? NOOP_CONTEXT : null),
    });
  }
  return element;
};

function chartWraps(host: FakeElement, className: string): FakeElement[] {
  return host.querySelectorAll(className);
}

describe("renderBarChart", () => {
  test("returns a chart-wrap container holding a canvas", () => {
    const host = new FakeElement("div");
    const wrap = renderBarChart(
      host as unknown as HTMLElement,
      [100, 250, 75],
      ["ม.ค.", "ก.พ.", "มี.ค."],
    ) as unknown as FakeElement;
    expect(wrap.className).toContain("chart-wrap");
    expect(wrap.className).toContain("chart-bar");
    const canvas = wrap.children.find(
      (child) => child instanceof FakeElement && child.tagName === "canvas",
    );
    expect(canvas).toBeDefined();
  });

  test("re-rendering replaces the previous chart instead of stacking", () => {
    const host = new FakeElement("div");
    renderBarChart(host as unknown as HTMLElement, [1, 2], ["a", "b"]);
    renderBarChart(host as unknown as HTMLElement, [3, 4], ["a", "b"]);
    expect(chartWraps(host, "chart-bar").length).toBe(1);
  });
});

describe("renderLineChart", () => {
  test("renders a legend with two token-colored dots", () => {
    const host = new FakeElement("div");
    const wrap = renderLineChart(host as unknown as HTMLElement, {
      labels: ["2026-01", "2026-02"],
      income: [1000, 2000],
      expense: [500, 800],
    }) as unknown as FakeElement;
    const legend = wrap.children.find(
      (child): child is FakeElement =>
        child instanceof FakeElement && child.className === "chart-legend",
    );
    expect(legend).toBeDefined();
    const items = legend?.children.filter(
      (child): child is FakeElement => child instanceof FakeElement,
    );
    expect(items?.length).toBe(2);
    const dots = items?.map((item) => item.children[0] as FakeElement);
    expect(dots?.every((dot) => dot.className === "chart-legend-dot")).toBe(true);
    expect(dots?.[0]?.style.backgroundColor).toBe("oklch(0.62 0.072 158)");
    expect(dots?.[1]?.style.backgroundColor).toBe("oklch(0.6 0.19 25)");
  });

  test("re-rendering replaces the previous chart instead of stacking", () => {
    const host = new FakeElement("div");
    const data = { labels: ["2026-01"], income: [1], expense: [2] };
    renderLineChart(host as unknown as HTMLElement, data);
    renderLineChart(host as unknown as HTMLElement, data);
    expect(chartWraps(host, "chart-line").length).toBe(1);
  });
});

describe("renderPieChart", () => {
  test("renders one legend item per slice with formatted amounts", () => {
    const host = new FakeElement("div");
    const wrap = renderPieChart(host as unknown as HTMLElement, [
      { category: "อาหาร", total: 1200 },
      { category: "เดินทาง", total: 300 },
    ]) as unknown as FakeElement;
    const legend = wrap.children.find(
      (child): child is FakeElement =>
        child instanceof FakeElement && child.className === "chart-legend",
    );
    expect(legend).toBeDefined();
    const items = legend?.children.filter(
      (child): child is FakeElement => child instanceof FakeElement,
    );
    expect(items?.length).toBe(2);
    expect(items?.[0]?.children[1]).toBe("อาหาร 1,200.00");
    expect(items?.[1]?.children[1]).toBe("เดินทาง 300.00");
  });

  test("re-rendering replaces the previous chart instead of stacking", () => {
    const host = new FakeElement("div");
    renderPieChart(host as unknown as HTMLElement, [
      { category: "อาหาร", total: 100 },
    ]);
    renderPieChart(host as unknown as HTMLElement, [
      { category: "อาหาร", total: 100 },
    ]);
    expect(chartWraps(host, "chart-pie").length).toBe(1);
  });
});

describe("sliceColors", () => {
  test("derives one palette color per slice with no duplicates", () => {
    const colors = sliceColors(4);
    expect(colors.length).toBe(4);
    expect(new Set(colors).size).toBe(4);
    expect(colors.every((color) => color.length > 0)).toBe(true);
  });
});
