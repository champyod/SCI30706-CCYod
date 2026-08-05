import { beforeAll, describe, expect, test } from "bun:test";
import { renderIcon } from "../src/components/Icon";
import type { LucideIconName } from "../src/components/Icon";

// bun's runtime has no DOM; a minimal recording element stands in for
// SVG elements so the produced structure can be asserted.
class FakeSvgElement {
  readonly tagName: string;
  readonly attributes = new Map<string, string>();
  readonly children: FakeSvgElement[] = [];

  constructor(tagName: string) {
    this.tagName = tagName;
  }

  setAttribute(name: string, value: string): void {
    this.attributes.set(name, value);
  }

  appendChild(child: FakeSvgElement): void {
    this.children.push(child);
  }
}

beforeAll(() => {
  globalThis.document = {
    createElementNS(_namespace: string, tagName: string): FakeSvgElement {
      return new FakeSvgElement(tagName);
    },
  } as unknown as Document;
});

describe("renderIcon", () => {
  test("renders an svg with the standard attribute set", () => {
    const svg = renderIcon("Activity") as unknown as FakeSvgElement;
    expect(svg.tagName).toBe("svg");
    expect(svg.attributes.get("width")).toBe("20");
    expect(svg.attributes.get("height")).toBe("20");
    expect(svg.attributes.get("viewBox")).toBe("0 0 24 24");
    expect(svg.attributes.get("fill")).toBe("none");
    expect(svg.attributes.get("stroke")).toBe("currentColor");
    expect(svg.attributes.get("stroke-width")).toBe("2");
    expect(svg.attributes.get("stroke-linecap")).toBe("round");
    expect(svg.attributes.get("stroke-linejoin")).toBe("round");
    expect(svg.attributes.get("aria-hidden")).toBe("true");
  });

  test("defaults to size 20 when no size is given", () => {
    const svg = renderIcon("Home") as unknown as FakeSvgElement;
    expect(svg.attributes.get("width")).toBe("20");
    expect(svg.attributes.get("height")).toBe("20");
  });

  test("honors a custom size", () => {
    const svg = renderIcon("Home", 32) as unknown as FakeSvgElement;
    expect(svg.attributes.get("width")).toBe("32");
    expect(svg.attributes.get("height")).toBe("32");
  });

  test("renders the icon paths inside the svg", () => {
    const svg = renderIcon("Activity") as unknown as FakeSvgElement;
    expect(svg.children.length).toBeGreaterThan(0);
    for (const child of svg.children) {
      expect(child.tagName).toBe("path");
      expect(child.attributes.has("d")).toBe(true);
    }
  });

  test("renders different shapes for different icons", () => {
    const activity = renderIcon("Activity") as unknown as FakeSvgElement;
    const home = renderIcon("Home") as unknown as FakeSvgElement;
    const activityPaths = activity.children.map((child) => child.attributes.get("d"));
    const homePaths = home.children.map((child) => child.attributes.get("d"));
    expect(activityPaths).not.toEqual(homePaths);
  });

  test("throws for an unknown icon name", () => {
    expect(() => renderIcon("NotAnIcon" as LucideIconName)).toThrow(
      "Unknown icon name: NotAnIcon",
    );
  });
});
