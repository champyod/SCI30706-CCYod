import { renderIcon } from "./Icon";
import { getDailyQuote } from "../lib/quote";

/**
 * Daily savings quote card. The quote is picked from SAVINGS_QUOTES by
 * calendar date, so it is stable for a whole day without any state.
 */
export function renderQuoteBox(): HTMLElement {
  const card = document.createElement("section");
  card.className = "card quote-box";
  card.appendChild(renderIcon("Quote"));
  card.appendChild(createQuoteText(getDailyQuote()));
  return card;
}

function createQuoteText(quote: string): HTMLElement {
  const text = document.createElement("p");
  text.className = "quote-text";
  text.textContent = quote;
  return text;
}
