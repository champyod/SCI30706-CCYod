import { animate } from "motion";
import type {
  AnimationOptions,
  AnimationPlaybackControls,
  DOMKeyframesDefinition,
} from "motion";
import { renderIcon } from "./Icon";
import type { LucideIconName } from "./Icon";

interface AnimatedIconOptions {
  size?: number;
  hoverScale?: number;
  pulse?: boolean;
}

const DEFAULT_HOVER_SCALE = 1.1;
const HOVER_ANIMATION_DURATION = 0.15;
const PULSE_ANIMATION_DURATION = 0.9;
const PULSE_OPACITY_KEYFRAMES = [1, 0.6, 1];

interface AnimationController {
  start(keyframes: DOMKeyframesDefinition, options: AnimationOptions): void;
  stop(): void;
}

export function renderAnimatedIcon(
  name: LucideIconName,
  options: AnimatedIconOptions = {},
): HTMLElement {
  const container = document.createElement("span");
  container.appendChild(renderIcon(name, options.size));
  const controller = createAnimationController(container);
  wireHoverAnimation(container, controller, options.hoverScale ?? DEFAULT_HOVER_SCALE);
  if (options.pulse === true) {
    controller.start(
      { opacity: PULSE_OPACITY_KEYFRAMES },
      { duration: PULSE_ANIMATION_DURATION, repeat: Infinity, repeatType: "loop" },
    );
  }
  trackRemoval(container, controller);
  return container;
}

function createAnimationController(element: HTMLElement): AnimationController {
  let currentAnimation: AnimationPlaybackControls | null = null;
  return {
    // Stopping the previous animation before starting a new one guarantees
    // the pulse loop never fights a hover animation (and vice versa).
    start(keyframes: DOMKeyframesDefinition, options: AnimationOptions): void {
      currentAnimation?.stop();
      currentAnimation = animate(element, keyframes, options);
    },
    stop(): void {
      currentAnimation?.stop();
      currentAnimation = null;
    },
  };
}

function wireHoverAnimation(
  element: HTMLElement,
  controller: AnimationController,
  hoverScale: number,
): void {
  element.addEventListener("mouseenter", () => {
    controller.start({ scale: hoverScale }, { duration: HOVER_ANIMATION_DURATION });
  });
  element.addEventListener("mouseleave", () => {
    controller.start({ scale: 1 }, { duration: HOVER_ANIMATION_DURATION });
  });
}

const removalWatchers = new Map<HTMLElement, AnimationController>();
let removalObserver: MutationObserver | null = null;

// A shared observer stops any running animation the moment its container
// leaves the document, so infinite pulse loops cannot leak after removal.
function trackRemoval(container: HTMLElement, controller: AnimationController): void {
  // Non-DOM environments (unit tests) have no observer to attach to.
  if (typeof document === "undefined" || typeof MutationObserver === "undefined") {
    return;
  }
  removalWatchers.set(container, controller);
  if (removalObserver === null) {
    removalObserver = new MutationObserver(stopRemovedAnimations);
    removalObserver.observe(document.documentElement, { childList: true, subtree: true });
  }
}

function stopRemovedAnimations(): void {
  // Array.from keeps this iterable under the repo's ES5-ish target.
  for (const [container, controller] of Array.from(removalWatchers)) {
    if (container.isConnected === false) {
      controller.stop();
      removalWatchers.delete(container);
    }
  }
}
