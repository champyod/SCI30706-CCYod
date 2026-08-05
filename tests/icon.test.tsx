import { describe, expect, test } from "bun:test";
import { renderToString } from "react-dom/server";
import { Icon } from "../src/components/Icon";
import type { LucideIconName } from "../src/components/Icon";

// Representative sample of the allowlist, including icons with several
// child nodes (paths/lines) so nested rendering is exercised.
const SAMPLE_ICONS: readonly LucideIconName[] = [
  "Activity",
  "Home",
  "Sparkles",
  "Wand2",
  "Quote",
  "PiggyBank",
  "TrendingUp",
  "Wallet",
];

describe("Icon", () => {
  test("renders an svg with the standard attribute set", () => {
    const markup = renderToString(<Icon name="Activity" />);
    expect(markup).toContain("<svg");
    expect(markup).toContain('aria-hidden="true"');
    expect(markup).toContain('viewBox="0 0 24 24"');
    expect(markup).toContain('fill="none"');
    expect(markup).toContain('stroke="currentColor"');
    expect(markup).toContain('stroke-width="2"');
    expect(markup).toContain('stroke-linecap="round"');
    expect(markup).toContain('stroke-linejoin="round"');
  });

  test("renders the invariant attribute set for every allowlist sample", () => {
    for (const name of SAMPLE_ICONS) {
      const markup = renderToString(<Icon name={name} />);
      expect(markup).toContain("<svg");
      expect(markup).toContain('aria-hidden="true"');
      expect(markup).toContain('viewBox="0 0 24 24"');
      expect(markup).toContain('fill="none"');
      expect(markup).toContain('stroke="currentColor"');
      expect(markup).toContain('stroke-width="2"');
    }
  });

  test("defaults to size 20 when no size is given", () => {
    const markup = renderToString(<Icon name="Home" />);
    expect(markup).toContain('width="20"');
    expect(markup).toContain('height="20"');
  });

  test("honors a custom size", () => {
    const markup = renderToString(<Icon name="Home" size={32} />);
    expect(markup).toContain('width="32"');
    expect(markup).toContain('height="32"');
  });

  test("renders the icon paths inside the svg", () => {
    const markup = renderToString(<Icon name="Activity" />);
    expect(markup).toContain("<path");
  });

  test("renders different shapes for different icons", () => {
    const activity = renderToString(<Icon name="Activity" />);
    const home = renderToString(<Icon name="Home" />);
    expect(activity).not.toBe(home);
  });

  test("throws for an unknown icon name", () => {
    expect(() =>
      renderToString(<Icon name={"NotAnIcon" as LucideIconName} />),
    ).toThrow("Unknown icon name: NotAnIcon");
  });

  test("renders no external references in the markup", () => {
    const markup = renderToString(<Icon name="Sparkles" />);
    expect(markup).not.toContain("http://");
    expect(markup).not.toContain("https://");
  });
});