import { type ClassValue, clsx } from "clsx";

/**
 * Merge class names with Tailwind support via clsx.
 * Install: bun add clsx tailwind-merge
 */
export function cn(...inputs: ClassValue[]): string {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { twMerge } = require("tailwind-merge");
  return twMerge(clsx(inputs));
}

/**
 * Format a date string to locale format.
 */
export function formatDate(date: Date | string, locale = "en-US"): string {
  return new Date(date).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format a number with commas.
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(num);
}

/**
 * Delay execution (useful for testing/demo).
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Safely access nested object properties.
 */
export function get<T = unknown>(
  obj: Record<string, unknown>,
  path: string,
  defaultValue?: T,
): T | undefined {
  const keys = path.split(".");
  let result: unknown = obj;
  for (const key of keys) {
    if (result === null || result === undefined) return defaultValue;
    result = (result as Record<string, unknown>)[key];
  }
  return (result as T) ?? defaultValue;
}
