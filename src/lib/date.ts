function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

export function todayKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`;
}
