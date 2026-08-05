import { createElement } from "react";
import type { ReactElement } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowDown,
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Banknote,
  Bell,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleDollarSign,
  Coins,
  Download,
  Edit,
  EllipsisVertical,
  Eye,
  EyeOff,
  Filter,
  Goal,
  Heart,
  Home,
  Info,
  Landmark,
  Lightbulb,
  List,
  LoaderCircle,
  Lock,
  Menu,
  Minus,
  Moon,
  PiggyBank,
  Plus,
  PlusCircle,
  Quote,
  Receipt,
  RefreshCcw,
  Rocket,
  Save,
  Search,
  Send,
  Settings,
  Share2,
  ShoppingCart,
  Sparkles,
  Star,
  Sun,
  Target,
  Trash2,
  TrendingDown,
  TrendingUp,
  Upload,
  Wallet,
  Wand2,
  X,
  XCircle,
} from "lucide";

// Allowlist of every icon the app renders; the union below is derived from
// these keys, so adding an icon here is the single step needed to expose it.
const ICONS = {
  Activity,
  AlertTriangle,
  ArrowDown,
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Banknote,
  Bell,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleDollarSign,
  Coins,
  Download,
  Edit,
  EllipsisVertical,
  Eye,
  EyeOff,
  Filter,
  Goal,
  Heart,
  Home,
  Info,
  Landmark,
  Lightbulb,
  List,
  LoaderCircle,
  Lock,
  Menu,
  Minus,
  Moon,
  PiggyBank,
  Plus,
  PlusCircle,
  Quote,
  Receipt,
  RefreshCcw,
  Rocket,
  Save,
  Search,
  Send,
  Settings,
  Share2,
  ShoppingCart,
  Sparkles,
  Star,
  Sun,
  Target,
  Trash2,
  TrendingDown,
  TrendingUp,
  Upload,
  Wallet,
  Wand2,
  X,
  XCircle,
} as const;

export type LucideIconName = keyof typeof ICONS;

// Mirrors lucide's IconNode tuple shape; re-declared locally to allow recursive
// nesting (lucide's exported IconNodeChild children are flat 2-tuples).
type IconNode = readonly [
  tag: string,
  attrs: Record<string, string | number>,
  children?: readonly IconNode[],
];

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
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

// Temporary bridge: Header.ts and QuoteBox.ts (PIVOT-C files) still call
// renderIcon; kept until PIVOT-C rewrites them, then removed.
export function renderIcon(name: LucideIconName, size = DEFAULT_ICON_SIZE): SVGElement {
  const node = ICONS[name];
  if (node === undefined) {
    throw new Error(`Unknown icon name: ${name}`);
  }
  const svg = document.createElementNS(SVG_NAMESPACE, "svg");
  setSvgAttributes(svg, size);
  appendIconChildren(svg, node);
  return svg;
}

function setSvgAttributes(svg: SVGElement, size: number): void {
  svg.setAttribute("width", String(size));
  svg.setAttribute("height", String(size));
  svg.setAttribute("viewBox", SVG_VIEWBOX);
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", String(STROKE_WIDTH));
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  svg.setAttribute("aria-hidden", "true");
}

function appendIconChildren(svg: SVGElement, node: IconNode): void {
  for (const child of node[2] ?? []) {
    svg.appendChild(renderIconNodeDom(child));
  }
}

function renderIconNodeDom(node: IconNode): SVGElement {
  const [tag, attrs] = node;
  const element = document.createElementNS(SVG_NAMESPACE, tag);
  for (const [attrName, attrValue] of Object.entries(attrs)) {
    element.setAttribute(attrName, String(attrValue));
  }
  for (const child of node[2] ?? []) {
    element.appendChild(renderIconNodeDom(child));
  }
  return element;
}
