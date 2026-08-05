import { goalProgress } from "../lib/finance";
import { formatBaht } from "../lib/money";
import type { Goal } from "../lib/types";

const BAR_MAX_PERCENT = 100;

/**
 * Progress card for one goal: name, an accessible progress bar whose fill
 * width mirrors goalProgress (0..1 scaled to percent), and current/target
 * amounts. The width is layout data so it is set inline; color stays in CSS.
 */
export function renderGoalProgress(goal: Goal): HTMLElement {
  const progress = goalProgress(goal);
  const card = document.createElement("article");
  card.className = "card";
  card.appendChild(createTitle(goal.name));
  card.appendChild(createProgressBar(progress));
  card.appendChild(createAmounts(goal.current, goal.target));
  return card;
}

function createTitle(name: string): HTMLElement {
  const title = document.createElement("h3");
  title.className = "card-title";
  title.textContent = name;
  return title;
}

function createProgressBar(progress: number): HTMLElement {
  const percent = Math.round(progress * BAR_MAX_PERCENT);
  const track = document.createElement("div");
  track.className = "progress";
  track.setAttribute("role", "progressbar");
  track.setAttribute("aria-valuemin", "0");
  track.setAttribute("aria-valuemax", String(BAR_MAX_PERCENT));
  track.setAttribute("aria-valuenow", String(percent));
  const fill = document.createElement("div");
  fill.className = "progress-fill";
  fill.style.width = `${percent}%`;
  track.appendChild(fill);
  return track;
}

function createAmounts(current: number, target: number): HTMLElement {
  const amounts = document.createElement("p");
  amounts.className = "goal-amounts";
  amounts.textContent = `${formatBaht(current)} / ${formatBaht(target)}`;
  return amounts;
}
