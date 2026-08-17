import { afterEach, describe, expect, test } from "bun:test";
import { AutoInvestRow } from "../src/components/AutoInvestRow";
import type { Settings } from "../src/lib/types";
import { Window } from "happy-dom";

const DEFAULT_SETTINGS: Settings = {
  savingsBalance: 0,
  autoInvestPercent: 10,
  autoSavePercent: 20,
};

let savedGlobals: { [key: string]: unknown } | undefined;

afterEach(() => {
  if (savedGlobals) {
    for (const [key, value] of Object.entries(savedGlobals)) {
      if (value === undefined) {
        delete (globalThis as Record<string, unknown>)[key];
      } else {
        (globalThis as Record<string, unknown>)[key] = value;
      }
    }
    savedGlobals = undefined;
  }
});

interface MountedRow {
  window: Window;
  investInput: HTMLInputElement;
  saveInput: HTMLInputElement;
  updates: Array<Partial<Settings>>;
}

function mountRow(settings: Settings = DEFAULT_SETTINGS): MountedRow {
  const window = new Window();
  const globalKeys = ["window", "document", "navigator", "getComputedStyle"] as const;
  savedGlobals = {};
  for (const key of globalKeys) {
    savedGlobals[key] = (globalThis as Record<string, unknown>)[key];
  }
  Object.assign(globalThis, {
    window,
    document: window.document,
    navigator: window.navigator,
    getComputedStyle: window.getComputedStyle.bind(window),
  });
  const root = window.document.createElement("div");
  window.document.body.appendChild(root);

  const updates: Array<Partial<Settings>> = [];
  const { createRoot } = require("react-dom/client");
  const { act } = require("react");
  act(() => {
    createRoot(root).render(
      <AutoInvestRow
        settings={settings}
        onUpdate={(patch: Partial<Settings>) => {
          updates.push(patch);
        }}
      />,
    );
  });

  const investInput = window.document.querySelector(
    'input[name="auto-invest-percent"]',
  ) as HTMLInputElement | null;
  const saveInput = window.document.querySelector(
    'input[name="auto-save-percent"]',
  ) as HTMLInputElement | null;
  if (!investInput || !saveInput) {
    throw new Error("AutoInvestRow inputs not found");
  }
  return { window, investInput, saveInput, updates };
}

function typeInto(input: HTMLInputElement, window: Window, value: string): void {
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
  if (!setter) {
    throw new Error("HTMLInputElement value setter unavailable");
  }
  const { act } = require("react");
  act(() => {
    setter.call(input, value);
    input.dispatchEvent(new window.Event("input", { bubbles: true }) as unknown as Event);
  });
}

function blur(input: HTMLInputElement, window: Window): void {
  const { act } = require("react");
  act(() => {
    // React 19 delegates onBlur via the bubbling focusout event.
    input.dispatchEvent(new window.FocusEvent("focusout", { bubbles: true }) as unknown as Event);
  });
}

function pressEnter(input: HTMLInputElement, window: Window): void {
  const { act } = require("react");
  act(() => {
    input.dispatchEvent(
      new window.KeyboardEvent("keydown", { key: "Enter", bubbles: true }) as unknown as Event,
    );
  });
}

describe("AutoInvestRow", () => {
  test("typing does not commit while editing", () => {
    const { investInput, saveInput, window, updates } = mountRow();
    typeInto(investInput, window, "50");
    typeInto(saveInput, window, "30");
    expect(updates).toEqual([]);
  });

  test("blur commits both fields", () => {
    const { investInput, saveInput, window, updates } = mountRow();
    typeInto(investInput, window, "50");
    typeInto(saveInput, window, "30");
    blur(investInput, window);
    expect(updates).toEqual([{ autoInvestPercent: 50, autoSavePercent: 30 }]);
  });

  test("Enter commits both fields", () => {
    const { investInput, saveInput, window, updates } = mountRow();
    typeInto(investInput, window, "50");
    typeInto(saveInput, window, "30");
    pressEnter(saveInput, window);
    expect(updates).toEqual([{ autoInvestPercent: 50, autoSavePercent: 30 }]);
  });

  test("empty input on blur does not commit Number('') as 0", () => {
    const { investInput, saveInput, window, updates } = mountRow();
    typeInto(investInput, window, "");
    typeInto(saveInput, window, "30");
    blur(investInput, window);
    expect(updates).toEqual([]);
  });

  test("invalid split on blur shows error and does not commit", () => {
    const { investInput, saveInput, window, updates } = mountRow();
    typeInto(investInput, window, "90");
    typeInto(saveInput, window, "90");
    blur(saveInput, window);
    expect(updates).toEqual([]);
    const alert = window.document.querySelector('[role="alert"]');
    expect(alert?.textContent).toBeTruthy();
  });
});