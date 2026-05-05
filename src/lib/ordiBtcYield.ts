import type { AssetBtcMetrics } from "@/lib/btcYield";

export type OrdiBtcYieldKpiMetrics = {
  btcYield: number;
  btcMultiple: number;
  startBtcPerOrdi: number;
  endBtcPerOrdi: number;
  startSatsPerOrdi: number;
  endSatsPerOrdi: number;
  periodLabel: string;
};

const SATS_PER_BTC = 100_000_000;

export function calculateOrdiBtcYieldKpi(
  metrics: AssetBtcMetrics,
  startDate: string,
  endDate: string
): OrdiBtcYieldKpiMetrics {
  return {
    btcYield: metrics.btcYield,
    btcMultiple: metrics.btcMultiple,
    startBtcPerOrdi: metrics.startBtcPrice,
    endBtcPerOrdi: metrics.currentBtcPrice,
    startSatsPerOrdi: metrics.startBtcPrice * SATS_PER_BTC,
    endSatsPerOrdi: metrics.currentBtcPrice * SATS_PER_BTC,
    periodLabel: `${startDate} to ${endDate}`
  };
}

