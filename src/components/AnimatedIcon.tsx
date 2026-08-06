import { useEffect, useRef } from "react";
import type { ReactElement } from "react";
import { animate } from "motion";
import type {
  AnimationOptions,
  AnimationPlaybackControls,
  DOMKeyframesDefinition,
} from "motion";
import { Icon } from "./Icon";
import type { LucideIconName } from "./Icon";

export interface AnimatedIconProps {
  name: LucideIconName;
  size?: number;
  hoverScale?: number;
  pulse?: boolean;
}

const DEFAULT_HOVER_SCALE = 1.1;
const HOVER_ANIMATION_DURATION = 0.15;
const PULSE_ANIMATION_DURATION = 0.9;
const PULSE_OPACITY_KEYFRAMES = [1, 0.6, 1];

export function AnimatedIcon({
  name,
  size,
  hoverScale = DEFAULT_HOVER_SCALE,
  pulse = false,
}: AnimatedIconProps): ReactElement {
  const spanRef = useRef<HTMLSpanElement>(null);
  const animationRef = useRef<AnimationPlaybackControls | null>(null);

  // Stopping the previous animation before starting a new one guarantees the
  // pulse loop never fights a hover animation (and vice versa).
  function startAnimation(
    keyframes: DOMKeyframesDefinition,
    options: AnimationOptions,
  ): AnimationPlaybackControls | null {
    const span = spanRef.current;
    if (span === null) {
      return null;
    }
    animationRef.current?.stop();
    const animation = animate(span, keyframes, options);
    animationRef.current = animation;
    return animation;
  }

  useEffect(() => {
    const span = spanRef.current;
    if (span === null) {
      return;
    }
    const onEnter = (): void => {
      startAnimation({ scale: hoverScale }, { duration: HOVER_ANIMATION_DURATION });
    };
    const onLeave = (): void => {
      startAnimation({ scale: 1 }, { duration: HOVER_ANIMATION_DURATION });
    };
    span.addEventListener("mouseenter", onEnter);
    span.addEventListener("mouseleave", onLeave);
    return () => {
      span.removeEventListener("mouseenter", onEnter);
      span.removeEventListener("mouseleave", onLeave);
      animationRef.current?.stop();
      animationRef.current = null;
    };
  }, [hoverScale]);

  useEffect(() => {
    if (pulse !== true) {
      return;
    }
    const pulseAnimation = startAnimation(
      { opacity: PULSE_OPACITY_KEYFRAMES },
      { duration: PULSE_ANIMATION_DURATION, repeat: Infinity, repeatType: "loop" },
    );
    return () => {
      pulseAnimation?.stop();
    };
  }, [pulse]);

  return (
    <span ref={spanRef} className="inline-flex">
      <Icon name={name} size={size} />
    </span>
  );
}
