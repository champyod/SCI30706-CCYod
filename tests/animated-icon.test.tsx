import { describe, expect, test } from "bun:test";
import { renderToString } from "react-dom/server";
import { AnimatedIcon } from "../src/components/AnimatedIcon";

describe("AnimatedIcon", () => {
  test("renders a span wrapping an svg", () => {
    const markup = renderToString(<AnimatedIcon name="Activity" />);
    expect(markup).toMatch(/^<span/);
    expect(markup).toContain("<svg");
  });

  test("span carries the animated-icon class", () => {
    const markup = renderToString(<AnimatedIcon name="Home" />);
    expect(markup).toContain('class="animated-icon"');
  });

  test("does not crash SSR when pulse is on", () => {
    const markup = renderToString(<AnimatedIcon name="Activity" pulse />);
    expect(markup).toContain("<svg");
  });

  test("does not crash SSR with a custom hover scale", () => {
    const markup = renderToString(<AnimatedIcon name="Star" hoverScale={1.4} />);
    expect(markup).toContain("<svg");
  });

  test("passes size through to the svg", () => {
    const markup = renderToString(<AnimatedIcon name="Star" size={24} />);
    expect(markup).toContain('width="24"');
  });

  test("does not crash SSR with pulse and hoverScale combined", () => {
    const markup = renderToString(<AnimatedIcon name="Wallet" pulse hoverScale={1.3} />);
    expect(markup).toContain("<svg");
  });
});