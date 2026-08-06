import type { ReactElement } from "react";
import { getDailyQuote } from "../lib/quote";
import { Icon } from "./Icon";

export function QuoteBox(): ReactElement {
  return (
    <section className="flex items-start gap-3 rounded-2xl border border-edge bg-card p-4 shadow-sm">
      <span className="mt-0.5 shrink-0 text-primary">
        <Icon name="Quote" />
      </span>
      <p className="m-0 text-sm italic leading-relaxed text-ink-dim">{getDailyQuote()}</p>
    </section>
  );
}
