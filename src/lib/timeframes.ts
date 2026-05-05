import type { Timeframe } from "@/types/market";

export const timeframeOptions: Array<{ value: Timeframe; label: string }> = [
  { value: "mint", label: "Since Mint" },
  { value: "week", label: "Weekly" },
  { value: "month", label: "Monthly" },
  { value: "year", label: "Yearly" }
];

function toUtcDate(date: string) {
  return new Date(`${date}T00:00:00Z`);
}

function toDateString(date: Date) {
  return date.toISOString().slice(0, 10);
}

function clampDate(date: string, minDate: string, maxDate: string) {
  if (date < minDate) return minDate;
  if (date > maxDate) return maxDate;
  return date;
}

export function getTimeframeStartDate(
  timeframe: Timeframe,
  endDate: string,
  mintDate: string,
  customStartDate: string
) {
  if (timeframe === "custom") {
    return clampDate(customStartDate, mintDate, endDate);
  }

  if (timeframe === "mint") {
    return mintDate;
  }

  const date = toUtcDate(endDate);

  if (timeframe === "week") date.setUTCDate(date.getUTCDate() - 7);
  if (timeframe === "month") date.setUTCMonth(date.getUTCMonth() - 1);
  if (timeframe === "year") date.setUTCFullYear(date.getUTCFullYear() - 1);

  return clampDate(toDateString(date), mintDate, endDate);
}

