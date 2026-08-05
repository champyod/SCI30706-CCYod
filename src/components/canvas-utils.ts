// Shared canvas primitives for chart components. Nothing here knows about a
// specific chart's data or domain — only raw drawing, sizing, and tokens.

const GRID_FONT = "11px system-ui";
const GRID_LABEL_X = 4;
const GRID_LABEL_OFFSET_Y = 2;

const AXIS_FORMATTER = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export interface GridOptions {
  steps: number;
  maxValue: number;
  minValue: number;
  lineColor: string;
  textColor: string;
}

// Backing store is scaled by devicePixelRatio so lines stay crisp; the 2d
// context is scaled back so callers draw in CSS pixels.
export function setupCanvas(
  canvas: HTMLCanvasElement,
  cssWidth: number,
  cssHeight: number,
): CanvasRenderingContext2D | null {
  const dpr = globalThis.devicePixelRatio ?? 1;
  canvas.width = Math.max(1, Math.round(cssWidth * dpr));
  canvas.height = Math.max(1, Math.round(cssHeight * dpr));
  const ctx = canvas.getContext("2d");
  if (ctx === null) {
    return null;
  }
  ctx.scale(dpr, dpr);
  return ctx;
}

// Resets the transform, wipes the CSS-pixel region, then restores the dpr
// scale so the caller keeps drawing in CSS pixels.
export function clearCanvas(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
): void {
  const dpr = globalThis.devicePixelRatio ?? 1;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, width * dpr, height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

// Horizontal gridlines from minValue (bottom) to maxValue (top) with a raw
// numeric label on the left edge of every line.
export function drawGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  options: GridOptions,
): void {
  ctx.font = GRID_FONT;
  ctx.textBaseline = "bottom";
  for (let step = 0; step <= options.steps; step += 1) {
    const ratio = step / options.steps;
    const y = height - height * ratio;
    ctx.strokeStyle = options.lineColor;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
    const value = options.minValue + (options.maxValue - options.minValue) * ratio;
    ctx.fillStyle = options.textColor;
    ctx.fillText(formatAxisValue(value), GRID_LABEL_X, y - GRID_LABEL_OFFSET_Y);
  }
}

// Left and bottom axis lines. Color comes from the caller (a resolved token).
export function drawAxes(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  color: string,
): void {
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, height);
  ctx.lineTo(width, height);
  ctx.moveTo(0, 0);
  ctx.lineTo(0, height);
  ctx.stroke();
}

// CSS custom property -> computed color string. document may be absent in
// test runners, so every access is guarded.
export function resolveToken(name: string): string | null {
  if (typeof document === "undefined" || typeof getComputedStyle === "undefined") {
    return null;
  }
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value.length > 0 ? value : null;
}

// Charts are laid out via CSS (.chart-wrap); measure the wrapper, not the
// canvas, because only the wrapper has a guaranteed definite size.
export function measureSize(
  element: HTMLElement,
): { width: number; height: number } | null {
  const width = element.clientWidth;
  const height = element.clientHeight;
  if (
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    width <= 0 ||
    height <= 0
  ) {
    return null;
  }
  return { width, height };
}

// Re-draw on every size change. The observer is deliberately not retained:
// once the wrapper is removed and unreferenced, the observer and its closure
// are collected together, so no window listener can leak.
export function observeResize(element: HTMLElement, onResize: () => void): void {
  if (typeof ResizeObserver === "undefined") {
    return;
  }
  const observer = new ResizeObserver(() => {
    onResize();
  });
  observer.observe(element);
}

// Re-render contract: a fresh render replaces the previous chart of the same
// class, dropping the old wrapper (and with it its observer).
export function removeChartContainers(
  element: HTMLElement,
  className: string,
): void {
  for (const existing of Array.from(element.querySelectorAll(`.${className}`))) {
    existing.remove();
  }
}

// Smallest "nice" (1/2/5 x 10^k) multiple of `steps` that covers maxValue, so
// gridlines land on round numbers.
export function computeNiceMax(maxValue: number, steps: number): number {
  if (maxValue <= 0 || steps <= 0) {
    return 0;
  }
  const rawStep = maxValue / steps;
  const magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const factor = rawStep / magnitude;
  const niceFactor = factor <= 1 ? 1 : factor <= 2 ? 2 : factor <= 5 ? 5 : 10;
  return niceFactor * magnitude * steps;
}

export function formatAxisValue(value: number): string {
  return AXIS_FORMATTER.format(value);
}
