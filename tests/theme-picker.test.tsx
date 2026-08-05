import { describe, expect, mock, test } from "bun:test";
import { renderToString } from "react-dom/server";
import { ThemePicker } from "../src/components/ThemePicker";
import { DEFAULT_HUE, MAX_HUE, MIN_HUE, presetHues } from "../src/components/theme-logic";

const noop = mock((_hue: number): void => {});

describe("ThemePicker", () => {
  test("renders the theme-picker container", () => {
    const markup = renderToString(<ThemePicker hue={180} onHueChange={noop} />);
    expect(markup).toContain('<div class="theme-picker">');
  });

  test("renders a range input bound to the current hue", () => {
    const markup = renderToString(<ThemePicker hue={180} onHueChange={noop} />);
    expect(markup).toContain('type="range"');
    expect(markup).toContain(`min="${MIN_HUE}"`);
    expect(markup).toContain(`max="${MAX_HUE}"`);
    expect(markup).toContain('step="1"');
    expect(markup).toContain('value="180"');
    expect(markup).toContain('aria-label="Theme hue"');
  });

  test("renders one swatch button per preset hue", () => {
    const markup = renderToString(<ThemePicker hue={180} onHueChange={noop} />);
    const buttonCount = markup.split('type="button"').length - 1;
    expect(buttonCount).toBe(presetHues.length);
  });

  test("marks the swatch matching the current hue as active", () => {
    const markup = renderToString(<ThemePicker hue={180} onHueChange={noop} />);
    expect(markup).toContain('aria-label="Set hue to 180"');
    expect(markup).toContain("swatch swatch-active");
    expect(markup).toContain('aria-pressed="true"');
  });

  test("leaves every swatch inactive when the hue is not a preset", () => {
    const markup = renderToString(<ThemePicker hue={200} onHueChange={noop} />);
    expect(markup).not.toContain("swatch-active");
    expect(markup).not.toContain('aria-pressed="true"');
    expect(markup).toContain('value="200"');
  });

  test("renders without touching the document (SSR-safe)", () => {
    expect(() =>
      renderToString(<ThemePicker hue={DEFAULT_HUE} onHueChange={noop} />),
    ).not.toThrow();
  });
});
