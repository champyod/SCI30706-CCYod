import { describe, expect, test } from "bun:test";
import { renderToString } from "react-dom/server";
import { Header } from "../src/components/Header";

describe("Header", () => {
  test("renders the app header element", () => {
    const markup = renderToString(<Header />);
    expect(markup).toContain('<header class="app-header">');
  });

  test("contains the FinGoal title", () => {
    const markup = renderToString(<Header />);
    expect(markup).toContain('<h1 class="app-title">');
    expect(markup).toContain("FinGoal");
  });

  test("contains an aria-hidden svg icon", () => {
    const markup = renderToString(<Header />);
    expect(markup).toContain("<svg");
    expect(markup).toContain('aria-hidden="true"');
  });

  test("renders both slot divs empty", () => {
    const markup = renderToString(<Header />);
    expect(markup).toContain('<div data-slot="connection-status"></div>');
    expect(markup).toContain('<div data-slot="theme-picker"></div>');
  });
});