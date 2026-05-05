import type { MarketDataSet, PricePoint, StrategyBtcKpiPoint } from "@/types/market";

const START_DATE = "2023-03-08";
const ORDI_MINT_USD_PRICE = 0.005;
const STRATEGY_SHARES_URL = "https://www.strategy.com/shares";

type YahooChartResponse = {
  chart?: {
    result?: Array<{
      timestamp?: number[];
      indicators?: {
        quote?: Array<{
          open?: Array<number | null>;
          high?: Array<number | null>;
          low?: Array<number | null>;
          close?: Array<number | null>;
          volume?: Array<number | null>;
        }>;
      };
      meta?: {
        regularMarketPrice?: number;
      };
    }>;
    error?: { description?: string };
  };
};

const fallbackStrategyPoints: StrategyBtcKpiPoint[] = [
  {
    date: "2023-03-08",
    totalBtc: 132500,
    assumedDilutedShares: 156_110_000,
    bitcoinPerShare: 0.00084874,
    satoshisPerShare: 84_874
  },
  {
    date: "2024-12-31",
    totalBtc: 447470,
    assumedDilutedShares: 527_200_000,
    bitcoinPerShare: 0.00084874,
    satoshisPerShare: 84_874
  },
  {
    date: "2026-04-26",
    totalBtc: 553555,
    assumedDilutedShares: 259_100_000,
    bitcoinPerShare: 0.00213644,
    satoshisPerShare: 213_644
  }
];

function unix(date: string) {
  return Math.floor(new Date(`${date}T00:00:00Z`).getTime() / 1000);
}

function toDateString(timestamp: number) {
  return new Date(timestamp * 1000).toISOString().slice(0, 10);
}

async function fetchYahooHistory(symbol: string): Promise<PricePoint[]> {
  const period1 = unix(START_DATE);
  const period2 = Math.floor(Date.now() / 1000) + 86400;
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
    symbol
  )}?period1=${period1}&period2=${period2}&interval=1d&includePrePost=false&events=history`;
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 ORDI Strategy"
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Yahoo Finance request failed for ${symbol}.`);
  }

  const payload = (await response.json()) as YahooChartResponse;
  const result = payload.chart?.result?.[0];
  const timestamps = result?.timestamp ?? [];
  const quote = result?.indicators?.quote?.[0];

  if (!result || !quote || timestamps.length === 0) {
    throw new Error(
      payload.chart?.error?.description ?? `No Yahoo Finance data for ${symbol}.`
    );
  }

  return timestamps
    .map((timestamp, index) => {
      const close = quote.close?.[index];
      if (close == null) return null;

      return {
        date: toDateString(timestamp),
        open: quote.open?.[index] ?? close,
        high: quote.high?.[index] ?? close,
        low: quote.low?.[index] ?? close,
        close,
        volume: quote.volume?.[index] ?? 0
      };
    })
    .filter((point): point is PricePoint => point !== null)
    .sort((a, b) => a.date.localeCompare(b.date));
}

function withOrdiMintAnchor(history: PricePoint[], btcHistory: PricePoint[]) {
  const withoutDuplicate = history.filter((point) => point.date !== START_DATE);
  const btcMintPoint = btcHistory.find((point) => point.date === START_DATE);

  return [
    {
      date: START_DATE,
      open: ORDI_MINT_USD_PRICE,
      high: ORDI_MINT_USD_PRICE,
      low: ORDI_MINT_USD_PRICE,
      close: ORDI_MINT_USD_PRICE,
      volume: 0
    },
    ...withoutDuplicate.filter((point) => !btcMintPoint || point.date > START_DATE)
  ].sort((a, b) => a.date.localeCompare(b.date));
}

function latest(history: PricePoint[]) {
  return history[history.length - 1];
}

function assetHistory(history: PricePoint[]) {
  return {
    startUsd: history[0].close,
    currentUsd: latest(history).close,
    history
  };
}

function parseCompactNumber(value: string) {
  const clean = value.replace(/[$,\s]/g, "").toUpperCase();
  const number = Number.parseFloat(clean);
  if (!Number.isFinite(number)) return null;
  if (clean.endsWith("K")) return number * 1_000;
  if (clean.endsWith("M")) return number * 1_000_000;
  if (clean.endsWith("B")) return number * 1_000_000_000;
  return number;
}

function inferStrategyPoint(text: string): StrategyBtcKpiPoint | null {
  const btcMatch =
    text.match(/(?:total\s+bitcoin|bitcoin\s+holdings|total\s+btc)[^0-9]{0,80}([0-9,.]+)\s*(?:BTC|bitcoin)/i) ??
    text.match(/([0-9,.]+)\s*(?:BTC|bitcoin)[^a-z0-9]{0,40}(?:held|holdings|total)/i);
  const shareMatch =
    text.match(/assumed\s+diluted\s+shares[^0-9]{0,80}([0-9,.]+\s*[KMB]?)/i) ??
    text.match(/([0-9,.]+\s*[KMB]?)\s+assumed\s+diluted\s+shares/i);
  const btc = btcMatch ? parseCompactNumber(btcMatch[1]) : null;
  const shares = shareMatch ? parseCompactNumber(shareMatch[1]) : null;

  if (!btc || !shares) return null;

  const bitcoinPerShare = btc / shares;
  return {
    date: new Date().toISOString().slice(0, 10),
    totalBtc: btc,
    assumedDilutedShares: shares,
    bitcoinPerShare,
    satoshisPerShare: bitcoinPerShare * 100_000_000
  };
}

async function fetchStrategyPoints() {
  try {
    const response = await fetch(STRATEGY_SHARES_URL, {
      headers: {
        "User-Agent": "Mozilla/5.0 ORDI Strategy"
      },
      cache: "no-store"
    });
    if (!response.ok) throw new Error("Strategy shares page unavailable.");

    const html = await response.text();
    const text = html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<[^>]+>/g, " ");
    const inferred = inferStrategyPoint(text);

    if (!inferred) {
      return { points: fallbackStrategyPoints, isFallback: true };
    }

    const points = [
      ...fallbackStrategyPoints.filter((point) => point.date < inferred.date),
      inferred
    ].sort((a, b) => a.date.localeCompare(b.date));

    return { points, isFallback: false };
  } catch {
    return { points: fallbackStrategyPoints, isFallback: true };
  }
}

export async function getYahooMarketData(): Promise<MarketDataSet> {
  const [btcHistory, rawOrdiHistory, mstrHistory, strategy] = await Promise.all([
    fetchYahooHistory("BTC-USD"),
    fetchYahooHistory("ORDI-USD"),
    fetchYahooHistory("MSTR"),
    fetchStrategyPoints()
  ]);
  const ordiHistory = withOrdiMintAnchor(rawOrdiHistory, btcHistory);
  const endDate = [latest(btcHistory).date, latest(ordiHistory).date, latest(mstrHistory).date]
    .sort()
    .at(0) as string;

  return {
    source: "yahoo_finance",
    label: strategy.isFallback
      ? "Live Yahoo Finance market data with Strategy KPI fallback points because the Strategy shares table could not be parsed."
      : "Live Yahoo Finance market data plus Strategy's published shares data for the official BTC Yield KPI.",
    asOf: endDate,
    fetchedAt: new Date().toISOString(),
    startDate: START_DATE,
    endDate,
    btc: assetHistory(btcHistory),
    ordi: assetHistory(ordiHistory),
    mstr: assetHistory(mstrHistory),
    strategy: {
      sourceUrl: STRATEGY_SHARES_URL,
      points: strategy.points,
      isFallback: strategy.isFallback
    }
  };
}
