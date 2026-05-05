import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatBtc, formatMultiple, formatPercent, formatSats } from "@/lib/formatters";
import type { OrdiBtcYieldKpiMetrics } from "@/lib/ordiBtcYield";

type OrdiKpiCardProps = {
  metrics: OrdiBtcYieldKpiMetrics;
};

export function OrdiKpiCard({ metrics }: OrdiKpiCardProps) {
  return (
    <Card className="border-primary/25 p-5">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">ORDI BTC Yield KPI</h3>
        <p className="text-sm leading-6 text-muted-foreground">
          ORDI&apos;s Strategy-analog KPI: percentage change in Bitcoin per ORDI
          token, expressed as sats per ORDI.
        </p>
        <Badge tone="orange">Per-token BTC basis</Badge>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <Metric label="BTC Yield KPI" value={formatPercent(metrics.btcYield)} tone="primary" />
        <Metric label="BTC Multiple" value={formatMultiple(metrics.btcMultiple)} />
        <Metric label="Start Sats / ORDI" value={formatSats(metrics.startSatsPerOrdi)} />
        <Metric label="Current Sats / ORDI" value={formatSats(metrics.endSatsPerOrdi)} />
      </div>
      <div className="mt-3 rounded-md border border-border bg-muted/30 p-4 text-sm leading-6 text-muted-foreground">
        <p>
          Start BTC / ORDI: <span className="text-foreground">{formatBtc(metrics.startBtcPerOrdi)}</span>
        </p>
        <p>
          End BTC / ORDI: <span className="text-foreground">{formatBtc(metrics.endBtcPerOrdi)}</span>
        </p>
        <p className="mt-2">{metrics.periodLabel}</p>
      </div>
    </Card>
  );
}

function Metric({ label, value, tone }: { label: string; value: string; tone?: "primary" }) {
  return (
    <div className="rounded-md border border-border bg-black/20 p-4">
      <p className="text-xs uppercase text-muted-foreground">{label}</p>
      <p className={tone === "primary" ? "mt-2 text-2xl font-semibold text-primary" : "mt-2 text-2xl font-semibold text-foreground"}>
        {value}
      </p>
    </div>
  );
}

