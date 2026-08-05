import { beforeAll, describe, expect, mock, test } from "bun:test";

// The real motion package is DOM-dependent, which bun's runtime lacks; the
// module mock lets the tests verify the animation lifecycle wiring instead.
interface FakeControls {
  stop: ReturnType<typeof mock>;
}

const createdControls: FakeControls[] = [];

const animateMock = mock(
  (_element: unknown, _keyframes: unknown, _options?: unknown): FakeControls => {
    const controls: FakeControls = { stop: mock(() => {}) };
    createdControls.push(controls);
    return controls;
  },
);

mock.module("motion", () => ({ animate: animateMock }));

let renderAnimatedIcon: typeof import("../src/components/AnimatedIcon")["renderAnimatedIcon"];

class FakeElement {
  readonly tagName: string;
  readonly children: unknown[] = [];
  isConnected = true;
  private readonly listeners = new Map<string, Array<(event: unknown) => void>>();

  constructor(tagName: string) {
    this.tagName = tagName;
  }

  appendChild(child: unknown): void {
    this.children.push(child);
  }

  setAttribute(_name: string, _value: string): void {}

  addEventListener(type: string, handler: (event: unknown) => void): void {
    const handlers = this.listeners.get(type) ?? [];
    handlers.push(handler);
    this.listeners.set(type, handlers);
  }

  emit(type: string): void {
    for (const handler of this.listeners.get(type) ?? []) {
      handler({ type });
    }
  }
}

let removalObserverCallback: (() => void) | null = null;

beforeAll(async () => {
  renderAnimatedIcon = (await import("../src/components/AnimatedIcon")).renderAnimatedIcon;
  globalThis.document = {
    createElement(tagName: string): FakeElement {
      return new FakeElement(tagName);
    },
    createElementNS(_namespace: string, tagName: string): FakeElement {
      return new FakeElement(tagName);
    },
    documentElement: {},
  } as unknown as Document;
  globalThis.MutationObserver = class {
    constructor(callback: () => void) {
      removalObserverCallback = callback;
    }

    observe(): void {}
    disconnect(): void {}
  } as unknown as typeof MutationObserver;
});

describe("renderAnimatedIcon", () => {
  test("returns a span containing the icon", () => {
    const container = renderAnimatedIcon("Activity") as unknown as FakeElement;
    expect(container.tagName).toBe("span");
    expect(container.children).toHaveLength(1);
  });

  test("does not animate when pulse is off", () => {
    animateMock.mockClear();
    renderAnimatedIcon("Activity");
    expect(animateMock).not.toHaveBeenCalled();
  });

  test("starts an infinite opacity pulse when pulse is on", () => {
    animateMock.mockClear();
    createdControls.length = 0;
    const container = renderAnimatedIcon("Activity", { pulse: true }) as unknown as FakeElement;
    expect(animateMock).toHaveBeenCalledTimes(1);
    const [element, keyframes, options] = animateMock.mock.calls[0]!;
    expect(element).toBe(container);
    expect(keyframes).toEqual({ opacity: [1, 0.6, 1] });
    expect(options).toEqual({ duration: 0.9, repeat: Infinity, repeatType: "loop" });
  });

  test("stops the pulse and scales up on mouseenter", () => {
    animateMock.mockClear();
    createdControls.length = 0;
    const container = renderAnimatedIcon("Activity", { pulse: true }) as unknown as FakeElement;
    container.emit("mouseenter");
    expect(animateMock).toHaveBeenCalledTimes(2);
    expect(animateMock.mock.calls[1]![1]).toEqual({ scale: 1.1 });
    expect(createdControls[0]!.stop).toHaveBeenCalledTimes(1);
  });

  test("scales back to 1 on mouseleave without restarting the pulse", () => {
    animateMock.mockClear();
    createdControls.length = 0;
    const container = renderAnimatedIcon("Activity", { pulse: true }) as unknown as FakeElement;
    container.emit("mouseenter");
    container.emit("mouseleave");
    expect(animateMock.mock.calls[2]![1]).toEqual({ scale: 1 });
    expect(createdControls[1]!.stop).toHaveBeenCalledTimes(1);
    expect(animateMock).toHaveBeenCalledTimes(3);
  });

  test("honors a custom hover scale", () => {
    animateMock.mockClear();
    createdControls.length = 0;
    const container = renderAnimatedIcon("Activity", {
      hoverScale: 1.3,
    }) as unknown as FakeElement;
    container.emit("mouseenter");
    expect(animateMock.mock.calls[0]![1]).toEqual({ scale: 1.3 });
  });

  test("stops the pulse when the container leaves the document", () => {
    animateMock.mockClear();
    createdControls.length = 0;
    const container = renderAnimatedIcon("Activity", { pulse: true }) as unknown as FakeElement;
    expect(removalObserverCallback).not.toBeNull();
    container.isConnected = false;
    removalObserverCallback!();
    expect(createdControls[0]!.stop).toHaveBeenCalledTimes(1);
    // a second sweep must not stop the already-cleared animation again
    removalObserverCallback!();
    expect(createdControls[0]!.stop).toHaveBeenCalledTimes(1);
  });
});
