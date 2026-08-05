const THAI_MONTH_ABBREVIATIONS = [
  "ม.ค.",
  "ก.พ.",
  "มี.ค.",
  "เม.ย.",
  "พ.ค.",
  "มิ.ย.",
  "ก.ค.",
  "ส.ค.",
  "ก.ย.",
  "ต.ค.",
  "พ.ย.",
  "ธ.ค.",
];

const BUDDHIST_YEAR_OFFSET = 543;

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

export function todayKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`;
}

export function monthKey(dateKey: string): string {
  return dateKey.slice(0, 7);
}

export function formatThaiDate(dateKey: string): string {
  const parts = dateKey.split("-");
  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);
  const date = new Date(year, month - 1, day);
  const buddhistYear = date.getFullYear() + BUDDHIST_YEAR_OFFSET;
  return `${date.getDate()} ${THAI_MONTH_ABBREVIATIONS[date.getMonth()]} ${buddhistYear}`;
}

export const CHART_MONTHS: string[] = (() => {
  const now = new Date();
  const months: string[] = [];
  for (let offset = 5; offset >= 0; offset -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    months.push(`${date.getFullYear()}-${pad2(date.getMonth() + 1)}`);
  }
  return months;
})();