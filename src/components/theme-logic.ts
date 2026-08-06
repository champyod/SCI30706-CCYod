// CSS custom property -> computed color string. document may be absent in
// test runners, so every access is guarded. The palette tokens themselves are
// defined statically in styles.css :root.
export function resolveToken(name: string): string | null {
  if (typeof document === "undefined" || typeof getComputedStyle === "undefined") {
    return null;
  }
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value.length > 0 ? value : null;
}
