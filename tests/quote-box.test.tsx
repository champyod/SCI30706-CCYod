import { describe, expect, test } from "bun:test";
import { renderToString } from "react-dom/server";
import { QuoteBox } from "../src/components/QuoteBox";
import { SAVINGS_QUOTES } from "../src/lib/constants";

describe("QuoteBox", () => {
  test("renders the quote card", () => {
    const markup = renderToString(<QuoteBox />);
    expect(markup).toContain("rounded-2xl");
  });

  test("contains an svg icon", () => {
    const markup = renderToString(<QuoteBox />);
    expect(markup).toContain("<svg");
  });

  test("shows a non-empty quote from the configured list", () => {
    const markup = renderToString(<QuoteBox />);
    const match = markup.match(/<p class="m-0 text-sm italic leading-relaxed text-ink-dim">([^<]+)<\/p>/);
    const quote = match?.[1] ?? "";
    expect(quote.length).toBeGreaterThan(0);
    expect(SAVINGS_QUOTES).toContain(quote);
  });
});