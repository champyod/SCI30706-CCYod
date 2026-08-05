import { describe, expect, test } from "bun:test";
import {
  clearCanvas,
  computeNiceMax,
  drawAxes,
  drawGrid,
  formatAxisValue,
  measureSize,
  resolveToken,
  setupCanvas,
  type GridOptions,
} from "../src/components/canvas-utils";
import { FakeElement, setupFakeDom } from "./fake-dom";

// Recording 2d context: no-op methods, captures every call for later asserts.
class FakeContext {
  strokeStyle: string | CanvasGradient | CanvasPattern = "";
  fillStyle: string | CanvasGradient | CanvasPattern = "";
  font = "";
  textAlign: CanvasTextAlign = "start";
  textBaseline: CanvasTextBaseline = "alphabetic";
  lineWidth = 1;
  lineJoin: CanvasLineJoin = "miter";
  lineCap: CanvasLineCap = "butt";
  readonly calls: Array<{ method: string; args: unknown[] }> = [];

  private record(method: string, args: unknown[]): void {
    this.calls.push({ method, args });
  }

  scale(x: number, y: number): void {
    this.record("scale", [x, y]);
  }
  setTransform(...args: number[]): void {
    this.record("setTransform", args);
  }
  clearRect(x: number, y: number, w: number, h: number): void {
    this.record("clearRect", [x, y, w, h]);
  }
  beginPath(): void {
    this.record("beginPath", []);
  }
  moveTo(x: number, y: number): void {
    this.record("moveTo", [x, y]);
  }
  lineTo(x: number, y: number): void {
    this.record("lineTo", [x, y]);
  }
  stroke(): void {
    this.record("stroke", []);
  }
  fill(): void {
    this.record("fill", []);
  }
  fillText(text: string, x: number, y: number): void {
    this.record("fillText", [text, x, y]);
  }
  arc(x: number, y: number, radius: number, start: number, end: number): void {
    this.record("arc", [x, y, radius, start, end]);
  }
  closePath(): void {
    this.record("closePath", []);
  }
  fillRect(x: number, y: number, w: number, h: number): void {
    this.record("fillRect", [x, y, w, h]);
  }
  save(): void {
    this.record("save", []);
  }
  restore(): void {
    this.record("restore", []);
  }
  translate(x: number, y: number): void {
    this.record("translate", [x, y]);
  }
}

class FakeCanvas {
  width = 0;
  height = 0;
  readonly context = new FakeContext();
  getContext(kind: string): FakeContext | null {
    return kind === "2d" ? this.context : null;
  }
}

describe("computeNiceMax", () => {
  test("rounds up to a nice 1/2/5 multiple of steps", () => {
    expect(computeNiceMax(1000, 4)).toBe(2000);
    expect(computeNiceMax(150, 4)).toBe(200);
    expect(computeNiceMax(10, 4)).toBe(20);
    expect(computeNiceMax(7, 4)).toBe(8);
    expect(computeNiceMax(250, 5)).toBe(250);
  });

  test("returns 0 for empty or invalid input", () => {
    expect(computeNiceMax(0, 4)).toBe(0);
    expect(computeNiceMax(-5, 4)).toBe(0);
    expect(computeNiceMax(100, 0)).toBe(0);
  });
});

describe("formatAxisValue", () => {
  test("compacts large values and keeps small ones plain", () => {
    expect(formatAxisValue(12000)).toBe("12K");
    expect(formatAxisValue(1500)).toBe("1.5K");
    expect(formatAxisValue(500)).toBe("500");
  });
});

describe("resolveToken", () => {
  test("returns null when document is unavailable", () => {
    expect(resolveToken("--s-expense")).toBeNull();
  });

  test("resolves a known token and null for unknown or empty", () => {
    setupFakeDom();
    expect(resolveToken("--s-expense")).toBe("oklch(0.6 0.19 25)");
    expect(resolveToken("--nope")).toBeNull();
  });
});

describe("setupCanvas", () => {
  test("sizes the backing store by dpr and scales the context", () => {
    const canvas = new FakeCanvas();
    const ctx = setupCanvas(canvas as unknown as HTMLCanvasElement, 320, 240);
    expect(ctx).not.toBeNull();
    expect(canvas.width).toBe(320);
    expect(canvas.height).toBe(240);
    expect(canvas.context.calls).toContainEqual({ method: "scale", args: [1, 1] });
  });

  test("returns null when getContext fails", () => {
    const canvas = { width: 0, height: 0, getContext: () => null };
    expect(
      setupCanvas(canvas as unknown as HTMLCanvasElement, 320, 240),
    ).toBeNull();
  });
});

describe("clearCanvas", () => {
  test("resets the transform, clears the css region, and restores dpr scale", () => {
    const ctx = new FakeContext();
    clearCanvas(
      new FakeCanvas() as unknown as HTMLCanvasElement,
      ctx as unknown as CanvasRenderingContext2D,
      320,
      240,
    );
    expect(ctx.calls.map((call) => call.method)).toEqual([
      "setTransform",
      "clearRect",
      "setTransform",
    ]);
  });
});

describe("drawGrid", () => {
  test("draws one horizontal line per step plus labels", () => {
    const ctx = new FakeContext();
    const options: GridOptions = {
      steps: 4,
      maxValue: 2000,
      minValue: 0,
      lineColor: "gray",
      textColor: "black",
    };
    drawGrid(ctx as unknown as CanvasRenderingContext2D, 500, 200, options);
    const strokes = ctx.calls.filter((call) => call.method === "stroke");
    expect(strokes.length).toBe(5);
    const labels = ctx.calls
      .filter((call) => call.method === "fillText")
      .map((call) => call.args[0]);
    expect(labels).toEqual(["0", "500", "1K", "1.5K", "2K"]);
  });
});

describe("drawAxes", () => {
  test("draws left and bottom axis lines in one stroke", () => {
    const ctx = new FakeContext();
    drawAxes(ctx as unknown as CanvasRenderingContext2D, 500, 200, "gray");
    const strokes = ctx.calls.filter((call) => call.method === "stroke");
    expect(strokes.length).toBe(1);
    const moveTos = ctx.calls.filter((call) => call.method === "moveTo");
    expect(moveTos.length).toBe(2);
  });
});

describe("measureSize", () => {
  test("returns null when the element has no layout size", () => {
    const element = new FakeElement("div");
    expect(measureSize(element as unknown as HTMLElement)).toBeNull();
  });

  test("returns client dimensions when present", () => {
    const element = new FakeElement("div");
    element.clientWidth = 320;
    element.clientHeight = 240;
    expect(measureSize(element as unknown as HTMLElement)).toEqual({
      width: 320,
      height: 240,
    });
  });
});
