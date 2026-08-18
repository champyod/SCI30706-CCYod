import { createElement } from "react";
import type { ReactElement } from "react";
import { Quote, Trash2, Wallet } from "lucide";

// Allowlist of every icon the app renders; the union below is derived from
// these keys, so adding an icon here is the single step needed to expose it.
const ICONS = {
  Quote,
  Trash2,
  Wallet,
} as const;

export type LucideIconName = keyof typeof ICONS;

// Mirrors lucide's IconNode tuple shape; re-declared locally to allow recursive
// nesting (lucide's exported IconNodeChild children are flat 2-tuples).
type IconNode = readonly [
  tag: string,
  attrs: Record<string, string | number>,
  children?: readonly IconNode[],
];

const SVG_VIEWBOX = "0 0 24 24";
const DEFAULT_ICON_SIZE = 20;
const STROKE_WIDTH = 2;

export interface IconProps {
  name: LucideIconName;
  size?: number;
}

export function Icon({ name, size = DEFAULT_ICON_SIZE }: IconProps): ReactElement {
  const node = ICONS[name];
  // ICONS is a closed allowlist; an unlisted name is a call-site bug, so fail
  // loudly instead of rendering an empty svg.
  if (node === undefined) {
    throw new Error(`Unknown icon name: ${name}`);
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox={SVG_VIEWBOX}
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE_WIDTH}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {node[2]?.map(renderIconNode)}
    </svg>
  );
}

function renderIconNode(node: IconNode, index: number): ReactElement {
  const [tag, attrs] = node;
  const children = node[2]?.map(renderIconNode) ?? [];
  return createElement(tag, { ...attrs, key: index }, ...children);
}
