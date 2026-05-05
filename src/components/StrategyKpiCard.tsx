import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatBtcAmount, formatCompactUsd, formatPercent, formatSats } from "@/lib/formatters";
import type { StrategyBtcYieldMetrics } from "@/lib/strategyBtcYield";

type StrategyKpiCardProps = {
  metrics: StrategyBtcYieldMetrics;
  sourceUrl: string;
  isFallback?: boolean;
};

export function StrategyKpiCard({ metrics, sourceUrl, isFallback }: StrategyKpiCardProps) {
  return (
    <Card className="border-secondary/25 p-5">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">Strategy Official BTC Yield KPI</h3>
        <p className="text-sm leading-6 text-muted-foreground">
          Calculated as percentage change in Bitcoin per assumed diluted share.
        </p>
        <Badge tone="cyan">{isFallback ? "Fallback KPI basis" : "Official KPI basis"}</Badge>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <Metric label="BTC Yield KPI" value={formatPercent(metrics.btcYield)} tone="secondary" />
        <Metric label="BTC Gain" value={formatBtcAmount(metrics.btcGain)} />
        <Metric label="BTC $ Gain" value={formatCompactUsd(metrics.btcUsdGain)} />
        <Metric label="BPS Multiple" value={`${metrics.bpsMultiple.toFixed(2)}x`} />
      </div>
      <div className="mt-3 rounded-md border border-border bg-muted/30 p-4 text-sm leading-6 text-muted-foreground">
        <p>
          Start BPS: <span className="text-foreground">{formatSats(metrics.startPoint.satoshisPerShare)} sats/share</span>
        </p>
        <p>
          End BPS: <span className="text-foreground">{formatSats(metrics.endPoint.satoshisPerShare)} sats/share</span>
        </p>
        <p className="mt-2">{metrics.periodLabel}</p>
        <a className="text-secondary hover:underline" href={sourceUrl} target="_blank" rel="noreferrer">
          strategy.com/shares
        </a>
      </div>
    </Card>
  );
}

function Metric({ label, value, tone }: { label: string; value: string; tone?: "secondary" }) {
  return (
    <div className="rounded-md border border-border bg-black/20 p-4">
      <p className="text-xs uppercase text-muted-foreground">{label}</p>
      <p className={tone === "secondary" ? "mt-2 text-2xl font-semibold text-secondary" : "mt-2 text-2xl font-semibold text-foreground"}>
        {value}
      </p>
    </div>
  );
}

