import type { ChangeEvent, ReactElement } from "react";
import { generatePalette } from "../lib/color";
import { applyTheme, MAX_HUE, MIN_HUE, presetHues } from "./theme-logic";

export interface ThemePickerProps {
  hue: number;
  onHueChange: (hue: number) => void;
}

const HUE_STEP = 1;
const RANGE_ARIA_LABEL = "Theme hue";

export function ThemePicker({ hue, onHueChange }: ThemePickerProps): ReactElement {
  // The parent owns state (persist + mount-time restore happen there via
  // applyTheme/loadHue); this component only reports the change and re-applies.
  function commitHue(nextHue: number): void {
    onHueChange(nextHue);
    applyTheme(nextHue);
  }

  function handleRangeChange(event: ChangeEvent<HTMLInputElement>): void {
    commitHue(Number(event.target.value));
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="range"
        min={MIN_HUE}
        max={MAX_HUE}
        step={HUE_STEP}
        value={hue}
        aria-label={RANGE_ARIA_LABEL}
        className="h-1.5 w-24 cursor-pointer accent-primary"
        onChange={handleRangeChange}
      />
      {presetHues.map((presetHue) => (
        <button
          key={presetHue}
          type="button"
          className={`h-5 w-5 cursor-pointer rounded-full border-2 transition-transform hover:scale-110 ${
            presetHue === hue
              ? "border-ink shadow-md"
              : "border-white/60 hover:border-white"
          }`}
          style={{ backgroundColor: generatePalette(presetHue).primary }}
          aria-label={`Set hue to ${presetHue}`}
          aria-pressed={presetHue === hue}
          onClick={() => commitHue(presetHue)}
        />
      ))}
    </div>
  );
}
