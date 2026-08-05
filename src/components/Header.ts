import { renderIcon } from "./Icon";

const APP_TITLE = "FinGoal";

/**
 * App shell header: title with icon plus two empty slot containers that
 * task T15 mounts ConnectionStatus and ThemePicker into. Slots stay empty
 * until then, so renderHeader must not assume any slot content.
 */
export function renderHeader(): HTMLElement {
  const header = document.createElement("header");
  header.className = "app-header";
  header.appendChild(createTitle());
  header.appendChild(createSlot("connection-status"));
  header.appendChild(createSlot("theme-picker"));
  return header;
}

function createTitle(): HTMLElement {
  const title = document.createElement("h1");
  title.className = "app-title";
  title.appendChild(renderIcon("Wallet"));
  title.appendChild(document.createTextNode(APP_TITLE));
  return title;
}

function createSlot(name: string): HTMLElement {
  const slot = document.createElement("div");
  slot.dataset.slot = name;
  return slot;
}
