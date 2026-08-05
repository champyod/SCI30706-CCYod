import type { ReactElement } from "react";
import { AnimatedIcon } from "./AnimatedIcon";
import type { GoalMode } from "../lib/types";

export interface ModeSelectorProps {
  mode: GoalMode;
  onModeChange: (mode: GoalMode) => void;
}

export const MODE_OPTIONS: readonly GoalMode[] = ["daily", "weekly"];

const MODE_LABELS: Record<GoalMode, string> = {
  daily: "รายวัน",
  weekly: "รายสัปดาห์",
};

// Duration is not in the icon allowlist, so weekly uses Target as the closest
// stand-in and daily uses CalendarDays.
const MODE_ICONS: Record<GoalMode, "CalendarDays" | "Target"> = {
  daily: "CalendarDays",
  weekly: "Target",
};

// Buttons set an explicit mode (not a two-way toggle), so the target is always
// the result; kept pure so it is testable without firing DOM events.
export function toggleMode(_current: GoalMode, target: GoalMode): GoalMode {
  return target;
}

export function modeLabel(mode: GoalMode): string {
  return MODE_LABELS[mode];
}

export function modeIcon(mode: GoalMode): "CalendarDays" | "Target" {
  return MODE_ICONS[mode];
}

export function ModeSelector({ mode, onModeChange }: ModeSelectorProps): ReactElement {
  return (
    <div className="mode-selector" role="group" aria-label="โหมดเป้าหมาย">
      {MODE_OPTIONS.map((option) => {
        const active = option === mode;
        return (
          <button
            key={option}
            type="button"
            data-mode={option}
            aria-pressed={active}
            className={active ? "mode-btn mode-active" : "mode-btn"}
            onClick={() => onModeChange(toggleMode(mode, option))}
          >
            <AnimatedIcon name={modeIcon(option)} size={16} />
            <span>{modeLabel(option)}</span>
          </button>
        );
      })}
    </div>
  );
}
