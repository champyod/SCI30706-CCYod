import { describe, expect, test } from "bun:test";
import { renderToString } from "react-dom/server";
import { Icon } from "../src/components/Icon";
import type { LucideIconName } from "../src/components/Icon";

// Every icon in the allowlist; each has several child nodes (paths/lines) so
// nested rendering is exercised.
const SAMPLE_ICONS: readonly LucideIconName[] = ["Quote", "Trash2", "Wallet"];

describe("Icon", () => {
  test("renders an svg with the standard attribute set", () => {
    const markup = renderToString(<Icon name="Wallet" />);
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
    const markup = renderToString(<Icon name="Quote" />);
    expect(markup).toContain('width="20"');
    expect(markup).toContain('height="20"');
  });

  test("honors a custom size", () => {
    const markup = renderToString(<Icon name="Quote" size={32} />);
    expect(markup).toContain('width="32"');
    expect(markup).toContain('height="32"');
  });

  test("renders the icon paths inside the svg", () => {
    const markup = renderToString(<Icon name="Trash2" />);
    expect(markup).toContain("<path");
  });

  test("renders different shapes for different icons", () => {
    const wallet = renderToString(<Icon name="Wallet" />);
    const quote = renderToString(<Icon name="Quote" />);
    expect(wallet).not.toBe(quote);
  });

  test("throws for an unknown icon name", () => {
    expect(() =>
      renderToString(<Icon name={"NotAnIcon" as LucideIconName} />),
    ).toThrow("Unknown icon name: NotAnIcon");
  });

  test("renders no external references in the markup", () => {
    const markup = renderToString(<Icon name="Trash2" />);
    expect(markup).not.toContain("http://");
    expect(markup).not.toContain("https://");
  });
});