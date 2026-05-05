"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Clock3, RefreshCw, TimerReset } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Controls } from "@/components/Controls";
import { HeroYieldComparison } from "@/components/HeroYieldComparison";
import { Methodology } from "@/components/Methodology";
import { NarrativeComparison } from "@/components/NarrativeComparison";
import { OrdiKpiCard } from "@/components/OrdiKpiCard";
import { ShareToX, type ShareOption } from "@/components/ShareToX";
import { StrategyKpiCard } from "@/components/StrategyKpiCard";
import { StrategySimulator } from "@/components/StrategySimulator";
import { YieldChart } from "@/components/YieldChart";
import { YieldTable } from "@/components/YieldTable";
import {
  buildYieldSeries,
  calculateAssetBtcMetrics,
  calculateStrategyFromInitialBtc,
  getCommonDateOnOrAfter,
  getCommonLatestDate,
  getPointByDate,
  getWinnerNarrative
} from "@/lib/btcYield";
import { formatBtc, formatCompactUsd, formatPercent, formatUsd } from "@/lib/formatters";
import { calculateOrdiBtcYieldKpi } from "@/lib/ordiBtcYield";
import { calculateStrategyBtcYieldKpi } from "@/lib/strategyBtcYield";
import { getTimeframeStartDate } from "@/lib/timeframes";
import type { DisplayCurrency, MarketDataSet, Timeframe } from "@/types/market";

type PriceApiResponse = MarketDataSet | { error: string };

type DashboardProps = {
  initialMarketData?: MarketDataSet;
  initialError?: string;
};

const AUTO_REFRESH_SECONDS = 60;
const SHARE_TIMEFRAMES: Array<{
  timeframe: Exclude<Timeframe, "custom">;
  label: string;
  tweetLabel: string;
}> = [
  { timeframe: "mint", label: "Since Mint", tweetLabel: "Since mint" },
  { timeframe: "year", label: "Yearly", tweetLabel: "1Y" },
  { timeframe: "month", label: "Monthly", tweetLabel: "1M" },
  { timeframe: "week", label: "Weekly", tweetLabel: "1W" }
];

export function Dashboard({ initialMarketData, initialError }: DashboardProps) {
  const [marketData, setMarketData] = useState<MarketDataSet | undefined>(initialMarketData);
  const [liveError, setLiveError] = useState<string | undefined>(initialError);
  const [isLiveLoading, setIsLiveLoading] = useState(false);
  const isLiveLoadingRef = useRef(false);

  const loadLivePrices = useCallback(async () => {
    if (isLiveLoadingRef.current) return;

    isLiveLoadingRef.current = true;
    setIsLiveLoading(true);
    setLiveError(undefined);

    try {
      const response = await fetch("/api/prices", { cache: "no-store" });
      const payload = (await response.json()) as PriceApiResponse;

      if (!response.ok || "error" in payload) {
        throw new Error("error" in payload ? payload.error : "Unable to load prices");
      }

      setMarketData(payload);
    } catch (error) {
      setLiveError(error instanceof Error ? error.message : "Unable to load prices");
    } finally {
      isLiveLoadingRef.current = false;
      setIsLiveLoading(false);
    }
  }, []);

  if (!marketData) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-8">
        <Card className="w-full max-w-xl border-primary/25">
          <CardHeader>
            <Badge tone="orange" className="w-fit">
              Live Yahoo Finance
            </Badge>
            <CardTitle className="mt-3">Live Price Data Required</CardTitle>
            <CardDescription>
              BTC-USD, ORDI-USD, and MSTR prices must load before yields can be calculated.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {liveError ? (
              <p className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm leading-6 text-destructive">
                {liveError}
              </p>
            ) : null}
            <Button type="button" onClick={loadLivePrices} disabled={isLiveLoading}>
              {isLiveLoading ? "Loading live prices..." : "Retry Live Data"}
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <DashboardContent
      marketData={marketData}
      isRefreshing={isLiveLoading}
      refreshError={liveError}
      onRefresh={loadLivePrices}
    />
  );
}

type DashboardContentProps = {
  marketData: MarketDataSet;
  isRefreshing: boolean;
  refreshError?: string;
  onRefresh: () => Promise<void>;
};

function buildDashboardSnapshot(
  marketData: MarketDataSet,
  commonEndDate: string,
  requestedStartDate: string,
  initialBtc: number
) {
  const effectiveStartDate = getCommonDateOnOrAfter(
    [marketData.btc.history, marketData.ordi.history, marketData.mstr.history],
    requestedStartDate
  );
  const btcStart = getPointByDate(marketData.btc.history, effectiveStartDate);
  const ordiStart = getPointByDate(marketData.ordi.history, effectiveStartDate);
  const mstrStart = getPointByDate(marketData.mstr.history, effectiveStartDate);
  const btcCurrent = getPointByDate(marketData.btc.history, commonEndDate);
  const ordiCurrent = getPointByDate(marketData.ordi.history, commonEndDate);
  const mstrCurrent = getPointByDate(marketData.mstr.history, commonEndDate);
  const ordiMetrics = calculateAssetBtcMetrics(
    ordiStart.close,
    ordiCurrent.close,
    btcStart.close,
    btcCurrent.close
  );
  const mstrMetrics = calculateAssetBtcMetrics(
    mstrStart.close,
    mstrCurrent.close,
    btcStart.close,
    btcCurrent.close
  );
  const strategyKpi = calculateStrategyBtcYieldKpi(
    marketData.strategy.points,
    effectiveStartDate,
    commonEndDate,
    btcCurrent.close
  );
  const ordiKpi = calculateOrdiBtcYieldKpi(ordiMetrics, effectiveStartDate, commonEndDate);
  const yieldSpread = ordiMetrics.btcYield - strategyKpi.btcYield;
  const winner = getWinnerNarrative(ordiMetrics.btcYield, strategyKpi.btcYield);
  const ordiStrategy = calculateStrategyFromInitialBtc(
    initialBtc,
    ordiStart.close,
    ordiCurrent.close,
    btcStart.close,
    btcCurrent.close
  );
  const mstrStrategy = calculateStrategyFromInitialBtc(
    initialBtc,
    mstrStart.close,
    mstrCurrent.close,
    btcStart.close,
    btcCurrent.close
  );
  const series = buildYieldSeries(
    marketData.btc.history,
    marketData.ordi.history,
    marketData.mstr.history,
    effectiveStartDate
  );

  return {
    effectiveStartDate,
    endDate: commonEndDate,
    btcStart,
    btcCurrent,
    ordiMetrics,
    ordiKpi,
    mstrMetrics,
    strategyKpi,
    yieldSpread,
    winner,
    series,
    strategyRows: [
      {
        strategy: "Hold BTC",
        yieldType: "Baseline",
        startingBtc: initialBtc,
        currentBtc: initialBtc,
        currentUsd: initialBtc * btcCurrent.close,
        btcMultiple: 1
      },
      {
        strategy: "Buy ORDI",
        yieldType: "Decentralized",
        startingBtc: initialBtc,
        currentBtc: ordiStrategy.currentBtc,
        currentUsd: ordiStrategy.currentUsd,
        btcMultiple: ordiStrategy.btcMultiple
      },
      {
        strategy: "Buy MSTR",
        yieldType: "Engineered",
        startingBtc: initialBtc,
        currentBtc: mstrStrategy.currentBtc,
        currentUsd: mstrStrategy.currentUsd,
        btcMultiple: mstrStrategy.btcMultiple
      }
    ]
  };
}

function formatSignedPercent(value: number) {
  const formatted = formatPercent(value);
  return value > 0 ? `+${formatted}` : formatted;
}

function buildShareText(label: string, snapshot: ReturnType<typeof buildDashboardSnapshot>) {
  return [
    `ORDI Strategy | ${label}`,
    "",
    `ORDI BTC Yield: ${formatSignedPercent(snapshot.ordiMetrics.btcYield)}`,
    `Strategy BTC Yield KPI: ${formatSignedPercent(snapshot.strategyKpi.btcYield)}`,
    `MSTR Market BTC Return: ${formatSignedPercent(snapshot.mstrMetrics.btcYield)}`,
    `Spread: ${formatSignedPercent(snapshot.yieldSpread)}`,
    "",
    `${snapshot.effectiveStartDate} to ${snapshot.endDate}`,
    "Decentralized vs engineered BTC yield."
  ].join("\n");
}

function buildXIntentUrl(text: string) {
  const params = new URLSearchParams({
    text,
    url: "https://ordistrategy.com",
    hashtags: "Bitcoin,ORDI,MSTR"
  });

  return `https://twitter.com/intent/tweet?${params.toString()}`;
}

function DashboardContent({ marketData, isRefreshing, refreshError, onRefresh }: DashboardContentProps) {
  const [customStartDate, setCustomStartDate] = useState("2023-03-08");
  const [timeframe, setTimeframe] = useState<Timeframe>("mint");
  const [initialBtc, setInitialBtc] = useState(0.01);
  const [normalizeChart, setNormalizeChart] = useState(true);
  const [displayCurrency, setDisplayCurrency] = useState<DisplayCurrency>("BTC");
  const [nextRefreshIn, setNextRefreshIn] = useState(AUTO_REFRESH_SECONDS);
  const lastUpdated = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "medium"
      }).format(new Date(marketData.fetchedAt)),
    [marketData.fetchedAt]
  );

  useEffect(() => {
    const countdownId = window.setInterval(() => {
      setNextRefreshIn((seconds) => (seconds <= 1 ? AUTO_REFRESH_SECONDS : seconds - 1));
    }, 1000);
    const refreshId = window.setInterval(() => {
      setNextRefreshIn(AUTO_REFRESH_SECONDS);
      void onRefresh();
    }, AUTO_REFRESH_SECONDS * 1000);

    return () => {
      window.clearInterval(countdownId);
      window.clearInterval(refreshId);
    };
  }, [onRefresh]);

  const commonEndDate = useMemo(
    () => getCommonLatestDate([marketData.btc.history, marketData.ordi.history, marketData.mstr.history]),
    [marketData]
  );
  const startDate = getTimeframeStartDate(
    timeframe,
    commonEndDate,
    marketData.startDate,
    customStartDate
  );
  const dashboard = useMemo(
    () => buildDashboardSnapshot(marketData, commonEndDate, startDate, initialBtc),
    [commonEndDate, initialBtc, marketData, startDate]
  );
  const shareOptions = useMemo<ShareOption[]>(
    () =>
      SHARE_TIMEFRAMES.map((option) => {
        const shareStartDate = getTimeframeStartDate(
          option.timeframe,
          commonEndDate,
          marketData.startDate,
          customStartDate
        );
        const snapshot = buildDashboardSnapshot(marketData, commonEndDate, shareStartDate, initialBtc);
        const summary = [
          `ORDI ${formatSignedPercent(snapshot.ordiMetrics.btcYield)}`,
          `Spread ${formatSignedPercent(snapshot.yieldSpread)}`
        ].join(" | ");

        return {
          label: option.label,
          href: buildXIntentUrl(buildShareText(option.tweetLabel, snapshot)),
          summary,
          isActive: timeframe === option.timeframe
        };
      }),
    [commonEndDate, customStartDate, initialBtc, marketData, timeframe]
  );

  return (
    <main className="min-h-screen px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-7">
        <HeroYieldComparison
          ordiBtcYield={dashboard.ordiMetrics.btcYield}
          strategyBtcYield={dashboard.strategyKpi.btcYield}
          mstrMarketBtcReturn={dashboard.mstrMetrics.btcYield}
          yieldSpread={dashboard.yieldSpread}
          winner={dashboard.winner.winner}
          narrative={dashboard.winner.narrative}
          startDate={dashboard.effectiveStartDate}
          endDate={dashboard.endDate}
          ordiMultiple={dashboard.ordiMetrics.btcMultiple}
          mstrMarketMultiple={dashboard.mstrMetrics.btcMultiple}
          strategyKpiPeriod={dashboard.strategyKpi.periodLabel}
        />

        <ShareToX options={shareOptions} />

        <Card className="border-primary/20">
          <CardContent className="grid gap-4 p-4 md:grid-cols-[1fr_auto] md:items-center">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <Badge tone="green" className="gap-2">
                <Clock3 className="h-3.5 w-3.5" />
                Live Yahoo Finance
              </Badge>
              <span className="text-muted-foreground">
                Last updated <span className="text-foreground">{lastUpdated}</span>
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <TimerReset className="h-3.5 w-3.5" />
                Auto-refresh in {nextRefreshIn}s
              </span>
              {isRefreshing ? <span className="text-primary">Refreshing prices...</span> : null}
              {refreshError ? (
                <span className="rounded-md border border-destructive/30 bg-destructive/10 px-2 py-1 text-destructive">
                  {refreshError}
                </span>
              ) : null}
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setNextRefreshIn(AUTO_REFRESH_SECONDS);
                void onRefresh();
              }}
              disabled={isRefreshing}
            >
              <RefreshCw className={isRefreshing ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
              Refresh Prices
            </Button>
          </CardContent>
        </Card>

        <Controls
          startDate={startDate}
          minDate={marketData.startDate}
          maxDate={commonEndDate}
          timeframe={timeframe}
          initialBtc={initialBtc}
          normalizeChart={normalizeChart}
          displayCurrency={displayCurrency}
          onStartDateChange={(value) => {
            setCustomStartDate(value);
            setTimeframe("custom");
          }}
          onTimeframeChange={setTimeframe}
          onInitialBtcChange={setInitialBtc}
          onNormalizeChartChange={setNormalizeChart}
          onDisplayCurrencyChange={setDisplayCurrency}
        />

        <section className="grid gap-4 lg:grid-cols-4">
          <MetricCard label="BTC at Start" value={formatUsd(dashboard.btcStart.close)} />
          <MetricCard label="BTC Today" value={formatUsd(dashboard.btcCurrent.close)} />
          <MetricCard
            label="ORDI Current Price"
            value={
              displayCurrency === "BTC"
                ? formatBtc(dashboard.ordiMetrics.currentBtcPrice)
                : formatUsd(dashboard.ordiMetrics.currentUsd)
            }
            tone="primary"
          />
          <MetricCard
            label="MSTR Current Price"
            value={
              displayCurrency === "BTC"
                ? formatBtc(dashboard.mstrMetrics.currentBtcPrice)
                : formatUsd(dashboard.mstrMetrics.currentUsd)
            }
            tone="secondary"
          />
        </section>

        <YieldTable ordi={dashboard.ordiMetrics} mstr={dashboard.mstrMetrics} displayCurrency={displayCurrency} />

        <section className="grid gap-5 xl:grid-cols-2">
          <OrdiKpiCard metrics={dashboard.ordiKpi} />
          <StrategyKpiCard
            metrics={dashboard.strategyKpi}
            sourceUrl={marketData.strategy.sourceUrl}
            isFallback={marketData.strategy.isFallback}
          />
        </section>

        <StrategySimulator rows={dashboard.strategyRows} initialBtc={initialBtc} displayCurrency={displayCurrency} />

        <YieldChart series={dashboard.series} normalizeChart={normalizeChart} />

        <NarrativeComparison />

        <Methodology />

        <footer className="grid gap-4 rounded-lg border border-border bg-card/70 p-5 text-sm leading-6 text-muted-foreground md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="font-medium text-foreground">Data Disclosure</p>
            <p>{marketData.label}</p>
            <p>
              Active source: Yahoo Finance. Start point uses the nearest available
              common market row on or after the selected date.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 md:justify-end">
            <Badge tone="orange">ORDI {formatPercent(dashboard.ordiMetrics.btcYield)}</Badge>
            <Badge tone="cyan">Strategy KPI {formatPercent(dashboard.strategyKpi.btcYield)}</Badge>
            <Badge tone="neutral">MSTR market {formatPercent(dashboard.mstrMetrics.btcYield)}</Badge>
            <Badge tone="green">Simulated value {formatCompactUsd(dashboard.strategyRows[1].currentUsd)}</Badge>
          </div>
        </footer>
      </div>
    </main>
  );
}

function MetricCard({
  label,
  value,
  tone
}: {
  label: string;
  value: string;
  tone?: "primary" | "secondary";
}) {
  return (
    <div className="rounded-lg border border-border bg-card/80 p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p
        className={
          tone === "primary"
            ? "mt-2 text-2xl font-semibold text-primary"
            : tone === "secondary"
              ? "mt-2 text-2xl font-semibold text-secondary"
              : "mt-2 text-2xl font-semibold text-foreground"
        }
      >
        {value}
      </p>
    </div>
  );
}
