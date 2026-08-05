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
    <div className="theme-picker">
      <input
        type="range"
        min={MIN_HUE}
        max={MAX_HUE}
        step={HUE_STEP}
        value={hue}
        aria-label={RANGE_ARIA_LABEL}
        onChange={handleRangeChange}
      />
      {presetHues.map((presetHue) => (
        <button
          key={presetHue}
          type="button"
          className={presetHue === hue ? "swatch swatch-active" : "swatch"}
          style={{ backgroundColor: generatePalette(presetHue).primary }}
          aria-label={`Set hue to ${presetHue}`}
          aria-pressed={presetHue === hue}
          onClick={() => commitHue(presetHue)}
        />
      ))}
    </div>
  );
}
