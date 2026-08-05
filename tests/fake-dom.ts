// Minimal DOM stand-ins for headless bun tests. Only what the chart
// components touch — no layout engine, no pixels.

export class FakeElement {
  tagName: string;
  className = "";
  clientWidth = 0;
  clientHeight = 0;
  style: { backgroundColor: string } = { backgroundColor: "" };
  parent: FakeElement | null = null;
  readonly children: Array<FakeElement | string> = [];

  constructor(tagName: string) {
    this.tagName = tagName;
  }

  appendChild(child: FakeElement | string): void {
    if (child instanceof FakeElement) {
      child.parent = this;
    }
    this.children.push(child);
  }

  remove(): void {
    const parent = this.parent;
    if (parent !== null) {
      const index = parent.children.indexOf(this);
      if (index >= 0) {
        parent.children.splice(index, 1);
      }
    }
    this.parent = null;
  }

  querySelectorAll(selector: string): FakeElement[] {
    const className = selector.replace(".", "");
    return this.children.filter(
      (child): child is FakeElement =>
        child instanceof FakeElement && child.className.includes(className),
    );
  }

  addEventListener(_type: string, _handler: () => void): void {
    // charts never attach window listeners; kept for structural parity
  }

  removeEventListener(_type: string, _handler: () => void): void {
    // charts never attach window listeners; kept for structural parity
  }
}

export const CSS_VARS: Record<string, string> = {
  "--s-income": "oklch(0.62 0.072 158)",
  "--s-expense": "oklch(0.6 0.19 25)",
  "--s-primary": "oklch(0.55 0.15 262)",
  "--s-text": "oklch(0.2 0.02 0)",
  "--c-card-border": "oklch(0.88 0.02 0)",
};

export function setupFakeDom(): void {
  globalThis.getComputedStyle = (() => {
    return {
      getPropertyValue(name: string): string {
        return CSS_VARS[name] ?? "";
      },
    };
  }) as unknown as typeof getComputedStyle;
  globalThis.document = {
    createElement(tag: string): FakeElement {
      return new FakeElement(tag);
    },
    createTextNode(text: string): string {
      return text;
    },
    documentElement: new FakeElement("html"),
  } as unknown as Document;
}
