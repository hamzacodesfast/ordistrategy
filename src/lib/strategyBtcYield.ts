import type { StrategyBtcKpiPoint } from "@/types/market";

export type StrategyBtcYieldMetrics = {
  startPoint: StrategyBtcKpiPoint;
  endPoint: StrategyBtcKpiPoint;
  btcYield: number;
  btcGain: number;
  btcUsdGain: number;
  bpsMultiple: number;
  periodLabel: string;
};

function sortPoints(points: StrategyBtcKpiPoint[]) {
  return [...points].sort((a, b) => a.date.localeCompare(b.date));
}

function getPointOnOrBefore(points: StrategyBtcKpiPoint[], date: string) {
  const sorted = sortPoints(points);
  const point = [...sorted].reverse().find((item) => item.date <= date);
  return point ?? sorted[0];
}

export function calculateStrategyBtcYieldKpi(
  points: StrategyBtcKpiPoint[],
  startDate: string,
  endDate: string,
  btcUsdPrice: number
): StrategyBtcYieldMetrics {
  const startPoint = getPointOnOrBefore(points, startDate);
  const endPoint = getPointOnOrBefore(points, endDate);
  const bpsMultiple = endPoint.bitcoinPerShare / startPoint.bitcoinPerShare;
  const btcYield = bpsMultiple - 1;
  const btcGain = startPoint.totalBtc * btcYield;
  const btcUsdGain = btcGain * btcUsdPrice;

  return {
    startPoint,
    endPoint,
    btcYield,
    btcGain,
    btcUsdGain,
    bpsMultiple,
    periodLabel: `${startPoint.date} to ${endPoint.date}`
  };
}

