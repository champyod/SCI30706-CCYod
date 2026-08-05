import type { ReactElement } from "react";
import { Icon } from "./Icon";

const APP_TITLE = "FinGoal";

// Slots stay empty until T15 mounts ConnectionStatus and ThemePicker, so
// Header must not assume any slot content.
const SLOT_NAMES = ["connection-status", "theme-picker"] as const;

export function Header(): ReactElement {
  return (
    <header className="app-header">
      <h1 className="app-title">
        <Icon name="Wallet" />
        {APP_TITLE}
      </h1>
      {SLOT_NAMES.map(createSlot)}
    </header>
  );
}

function createSlot(name: string): ReactElement {
  return <div key={name} data-slot={name} />;
}
