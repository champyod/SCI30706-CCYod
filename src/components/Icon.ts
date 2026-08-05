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

// Mirrors lucide's IconNode tuple shape; lucide does not export its node types.
type IconNode = readonly [
  tag: string,
  attrs: Record<string, string | number>,
  children?: readonly IconNode[],
];

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
const SVG_VIEWBOX = "0 0 24 24";
const DEFAULT_ICON_SIZE = 20;
const STROKE_WIDTH = 2;

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
    svg.appendChild(renderIconNode(child));
  }
}

function renderIconNode(node: IconNode): SVGElement {
  const [tag, attrs] = node;
  const element = document.createElementNS(SVG_NAMESPACE, tag);
  for (const [attrName, attrValue] of Object.entries(attrs)) {
    element.setAttribute(attrName, String(attrValue));
  }
  for (const child of node[2] ?? []) {
    element.appendChild(renderIconNode(child));
  }
  return element;
}
