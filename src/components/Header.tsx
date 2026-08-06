import type { ReactElement } from "react";
import { Icon } from "./Icon";

const APP_TITLE = "FinGoal";
const APP_TAGLINE = "วางแผนการเงิน — ถึงเป้าหมายอย่างฉลาด";

// Slots stay empty until ThemePicker mounts, so Header must not assume content.
const SLOT_NAMES = ["theme-picker"] as const;

export function Header(): ReactElement {
  return (
    <header className="mb-4 overflow-hidden rounded-2xl bg-gradient-to-br from-aqua-dark to-aqua text-on-primary shadow-lg shadow-aqua-dark/20">
      <div className="flex items-center justify-between gap-4 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl opacity-90">
            <Icon name="Wallet" size={28} />
          </span>
          <div>
            <h1 className="m-0 flex items-center gap-2 text-xl font-bold tracking-wide">
              {APP_TITLE}
            </h1>
            <p className="m-0 text-xs opacity-85">{APP_TAGLINE}</p>
          </div>
        </div>
        {SLOT_NAMES.map(createSlot)}
      </div>
    </header>
  );
}

function createSlot(name: string): ReactElement {
  return <div key={name} data-slot={name} />;
}
