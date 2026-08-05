import type { ReactElement } from "react";
import { getDailyQuote } from "../lib/quote";
import { Icon } from "./Icon";

export function QuoteBox(): ReactElement {
  return (
    <section className="card quote-box">
      <Icon name="Quote" />
      <p className="quote-text">{getDailyQuote()}</p>
    </section>
  );
}
