import type { ReactElement } from "react";
import { Icon } from "./Icon";

const APP_TITLE = "FinGoal";
const APP_TAGLINE = "วางแผนการเงิน — ถึงเป้าหมายอย่างฉลาด";

export function Header(): ReactElement {
  return (
    <header className="mb-4 rounded-2xl border border-edge bg-card shadow-sm">
      <div className="flex items-center justify-between gap-4 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-on-primary">
            <Icon name="Wallet" size={22} />
          </span>
          <div>
            <h1 className="m-0 text-xl font-bold tracking-wide text-ink">{APP_TITLE}</h1>
            <p className="m-0 text-xs text-ink-dim">{APP_TAGLINE}</p>
          </div>
        </div>
      </div>
    </header>
  );
}