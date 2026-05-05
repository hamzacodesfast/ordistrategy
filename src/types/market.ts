export type PriceDataSource = "yahoo_finance";

export type DisplayCurrency = "USD" | "BTC";

export type Timeframe = "mint" | "week" | "month" | "year" | "custom";

export type PricePoint = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type AssetPriceHistory = {
  startUsd: number;
  currentUsd: number;
  history: PricePoint[];
};

export type StrategyBtcKpiPoint = {
  date: string;
  totalBtc: number;
  assumedDilutedShares: number;
  bitcoinPerShare: number;
  satoshisPerShare: number;
};

export type StrategyBtcKpiData = {
  sourceUrl: string;
  points: StrategyBtcKpiPoint[];
  isFallback?: boolean;
};

export type MarketDataSet = {
  source: PriceDataSource;
  label: string;
  asOf?: string;
  fetchedAt: string;
  startDate: string;
  endDate: string;
  btc: AssetPriceHistory;
  ordi: AssetPriceHistory;
  mstr: AssetPriceHistory;
  strategy: StrategyBtcKpiData;
};

