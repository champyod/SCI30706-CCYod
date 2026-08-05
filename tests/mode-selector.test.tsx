import { describe, expect, test } from "bun:test";
import { renderToString } from "react-dom/server";
import { MODE_OPTIONS, ModeSelector, modeIcon, modeLabel, toggleMode } from "../src/components/ModeSelector";

function buttonMarkup(markup: string, mode: string): string {
  return markup.match(new RegExp(`<button[^>]*data-mode="${mode}"[^>]*>`))?.[0] ?? "";
}

describe("ModeSelector", () => {
  test("renders exactly two toggle buttons with stable data-mode attributes", () => {
    const markup = renderToString(<ModeSelector mode="daily" onModeChange={() => {}} />);
    expect(markup.split('data-mode="').length - 1).toBe(2);
    for (const option of MODE_OPTIONS) {
      expect(buttonMarkup(markup, option)).toContain(`data-mode="${option}"`);
    }
  });

  test("active mode button carries mode-active and aria-pressed true", () => {
    const markup = renderToString(<ModeSelector mode="weekly" onModeChange={() => {}} />);
    expect(buttonMarkup(markup, "weekly")).toContain("mode-active");
    expect(buttonMarkup(markup, "weekly")).toContain('aria-pressed="true"');
    expect(buttonMarkup(markup, "daily")).not.toContain("mode-active");
    expect(buttonMarkup(markup, "daily")).toContain('aria-pressed="false"');
  });

  test("modeLabel maps modes to Thai labels", () => {
    expect(modeLabel("daily")).toBe("รายวัน");
    expect(modeLabel("weekly")).toBe("รายสัปดาห์");
  });

  test("modeIcon maps daily to CalendarDays and weekly to Target", () => {
    expect(modeIcon("daily")).toBe("CalendarDays");
    expect(modeIcon("weekly")).toBe("Target");
  });

  test("toggleMode returns the clicked target for either direction", () => {
    expect(toggleMode("daily", "weekly")).toBe("weekly");
    expect(toggleMode("weekly", "daily")).toBe("daily");
  });
});
