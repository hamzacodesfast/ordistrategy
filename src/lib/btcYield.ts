import type { PricePoint } from "@/types/market";

export function usdToBtc(usdPrice: number, btcUsdPrice: number): number {
  return usdPrice / btcUsdPrice;
}

export function calculateBtcYield(
  assetStartUsd: number,
  assetCurrentUsd: number,
  btcStartUsd: number,
  btcCurrentUsd: number
): number {
  const assetStartBtc = usdToBtc(assetStartUsd, btcStartUsd);
  const assetCurrentBtc = usdToBtc(assetCurrentUsd, btcCurrentUsd);
  return assetCurrentBtc / assetStartBtc - 1;
}

export function calculateBtcMultiple(
  assetStartUsd: number,
  assetCurrentUsd: number,
  btcStartUsd: number,
  btcCurrentUsd: number
): number {
  return calculateBtcYield(assetStartUsd, assetCurrentUsd, btcStartUsd, btcCurrentUsd) + 1;
}

export function calculateStrategyFromInitialBtc(
  initialBtc: number,
  assetStartUsd: number,
  assetCurrentUsd: number,
  btcStartUsd: number,
  btcCurrentUsd: number
) {
  const startingUsd = initialBtc * btcStartUsd;
  const unitsBought = startingUsd / assetStartUsd;
  const currentUsd = unitsBought * assetCurrentUsd;
  const currentBtc = currentUsd / btcCurrentUsd;
  const btcMultiple = currentBtc / initialBtc;

  return { unitsBought, currentUsd, currentBtc, btcMultiple };
}

export type AssetBtcMetrics = {
  startUsd: number;
  currentUsd: number;
  startBtcPrice: number;
  currentBtcPrice: number;
  btcYield: number;
  btcMultiple: number;
};

export type YieldSeriesPoint = {
  date: string;
  ordiBtcPrice: number;
  mstrBtcPrice: number;
  ordiBtcNormalized: number;
  mstrBtcNormalized: number;
  btcBaseline: number;
  yieldSpreadSeries: number;
};

export function getPointByDate(history: PricePoint[], date: string): PricePoint {
  const point = history.find((item) => item.date === date);
  if (!point) throw new Error(`No price point found for ${date}.`);
  return point;
}

export function getCommonLatestDate(histories: PricePoint[][]): string {
  const [firstHistory, ...remainingHistories] = histories;
  const remainingDateSets = remainingHistories.map(
    (history) => new Set(history.map((point) => point.date))
  );
  const sortedDates = [...firstHistory]
    .map((point) => point.date)
    .sort((a, b) => b.localeCompare(a));
  const commonDate = sortedDates.find((date) =>
    remainingDateSets.every((set) => set.has(date))
  );

  if (!commonDate) {
    throw new Error("No common price date found across BTC, ORDI, and MSTR.");
  }

  return commonDate;
}

export function getCommonDateOnOrAfter(
  histories: PricePoint[][],
  targetDate: string
): string {
  const [firstHistory, ...remainingHistories] = histories;
  const remainingDateSets = remainingHistories.map(
    (history) => new Set(history.map((point) => point.date))
  );
  const sortedDates = [...firstHistory]
    .map((point) => point.date)
    .sort((a, b) => a.localeCompare(b));
  const commonDate = sortedDates.find(
    (date) => date >= targetDate && remainingDateSets.every((set) => set.has(date))
  );

  return commonDate ?? getCommonLatestDate(histories);
}

export function calculateAssetBtcMetrics(
  assetStartUsd: number,
  assetCurrentUsd: number,
  btcStartUsd: number,
  btcCurrentUsd: number
): AssetBtcMetrics {
  const startBtcPrice = usdToBtc(assetStartUsd, btcStartUsd);
  const currentBtcPrice = usdToBtc(assetCurrentUsd, btcCurrentUsd);
  const btcMultiple = currentBtcPrice / startBtcPrice;

  return {
    startUsd: assetStartUsd,
    currentUsd: assetCurrentUsd,
    startBtcPrice,
    currentBtcPrice,
    btcYield: btcMultiple - 1,
    btcMultiple
  };
}

export function buildYieldSeries(
  btcHistory: PricePoint[],
  ordiHistory: PricePoint[],
  mstrHistory: PricePoint[],
  startDate: string
): YieldSeriesPoint[] {
  const commonStartDate = getCommonDateOnOrAfter(
    [btcHistory, ordiHistory, mstrHistory],
    startDate
  );
  const btcStart = getPointByDate(btcHistory, commonStartDate);
  const ordiStart = getPointByDate(ordiHistory, commonStartDate);
  const mstrStart = getPointByDate(mstrHistory, commonStartDate);
  const ordiStartBtcPrice = usdToBtc(ordiStart.close, btcStart.close);
  const mstrStartBtcPrice = usdToBtc(mstrStart.close, btcStart.close);
  const btcByDate = new Map(btcHistory.map((point) => [point.date, point]));
  const mstrByDate = new Map(mstrHistory.map((point) => [point.date, point]));

  return ordiHistory
    .filter((point) => point.date >= commonStartDate)
    .map((ordiPoint) => {
      const btcPoint = btcByDate.get(ordiPoint.date);
      const mstrPoint = mstrByDate.get(ordiPoint.date);
      if (!btcPoint || !mstrPoint) return null;

      const ordiBtcPrice = usdToBtc(ordiPoint.close, btcPoint.close);
      const mstrBtcPrice = usdToBtc(mstrPoint.close, btcPoint.close);
      const ordiBtcNormalized = ordiBtcPrice / ordiStartBtcPrice;
      const mstrBtcNormalized = mstrBtcPrice / mstrStartBtcPrice;

      return {
        date: ordiPoint.date,
        ordiBtcPrice,
        mstrBtcPrice,
        ordiBtcNormalized,
        mstrBtcNormalized,
        btcBaseline: 1,
        yieldSpreadSeries: ordiBtcNormalized - mstrBtcNormalized
      };
    })
    .filter((point): point is YieldSeriesPoint => point !== null);
}

export function getWinnerNarrative(ordiBtcYield: number, strategyBtcYield: number) {
  if (ordiBtcYield > strategyBtcYield) {
    return {
      winner: "ORDI",
      narrative:
        "ORDI produced higher decentralized BTC-per-token yield than Strategy's official BTC-per-share yield KPI."
    };
  }

  if (strategyBtcYield > ordiBtcYield) {
    return {
      winner: "MSTR",
      narrative:
        "Strategy's official BTC-per-share yield KPI produced higher engineered BTC accretion than ORDI's BTC-per-token yield."
    };
  }

  return {
    winner: "Tie",
    narrative:
      "ORDI BTC-per-token yield and Strategy's official BTC-per-share yield KPI were equivalent over the selected period."
  };
}
