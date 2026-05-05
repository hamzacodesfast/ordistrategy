import { ArrowUpRight, Bitcoin, Crown, Scale } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatMultiple, formatPercent } from "@/lib/formatters";

type HeroYieldComparisonProps = {
  ordiBtcYield: number;
  strategyBtcYield: number;
  mstrMarketBtcReturn: number;
  yieldSpread: number;
  winner: string;
  narrative: string;
  startDate: string;
  endDate: string;
  ordiMultiple: number;
  mstrMarketMultiple: number;
  strategyKpiPeriod: string;
};

export function HeroYieldComparison({
  ordiBtcYield,
  strategyBtcYield,
  mstrMarketBtcReturn,
  yieldSpread,
  winner,
  narrative,
  startDate,
  endDate,
  ordiMultiple,
  mstrMarketMultiple,
  strategyKpiPeriod
}: HeroYieldComparisonProps) {
  const metrics = [
    {
      label: "ORDI BTC Yield KPI",
      value: formatPercent(ordiBtcYield),
      detail: formatMultiple(ordiMultiple),
      tone: "orange" as const
    },
    {
      label: "Strategy BTC Yield KPI",
      value: formatPercent(strategyBtcYield),
      detail: strategyKpiPeriod,
      tone: "cyan" as const
    },
    {
      label: "MSTR Market BTC Return",
      value: formatPercent(mstrMarketBtcReturn),
      detail: formatMultiple(mstrMarketMultiple),
      tone: "neutral" as const
    },
    {
      label: "Yield Spread",
      value: formatPercent(yieldSpread),
      detail: "ORDI KPI - Strategy KPI",
      tone: yieldSpread >= 0 ? ("green" as const) : ("neutral" as const)
    },
    {
      label: "Winner",
      value: winner,
      detail: `${startDate} to ${endDate}`,
      tone:
        winner === "ORDI"
          ? ("orange" as const)
          : winner === "MSTR"
            ? ("cyan" as const)
            : ("neutral" as const)
    }
  ];

  return (
    <section className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
        <div className="space-y-5">
          <Badge tone="orange" className="gap-2">
            <Bitcoin className="h-3.5 w-3.5" />
            BTC-denominated scoreboard
          </Badge>
          <div className="space-y-4">
            <h1 className="max-w-5xl text-balance text-4xl font-semibold tracking-normal text-foreground md:text-6xl">
              ORDI vs MSTR: Decentralized BTC Yield vs Engineered BTC Yield
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
              Comparing ORDI&apos;s BTC-per-token yield KPI against Strategy&apos;s
              official BTC-per-share yield KPI, with MSTR market return versus BTC
              shown separately.
            </p>
          </div>
          <p className="max-w-3xl text-base leading-7 text-foreground/88">
            ORDI represents decentralized BTC yield per token. MSTR represents
            engineered BTC yield per assumed diluted share. This dashboard compares
            both in BTC terms.
          </p>
        </div>

        <Card className="overflow-hidden border-primary/25 bg-gradient-to-br from-primary/14 via-card to-secondary/10">
          <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5">
            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">Current leader</p>
              <p className="mt-2 text-4xl font-semibold text-foreground">{winner}</p>
            </div>
            <div className="rounded-md border border-primary/30 bg-primary/15 p-3 text-primary">
              <Crown className="h-6 w-6" />
            </div>
          </div>
          <div className="space-y-4 p-5">
            <p className="text-sm leading-6 text-muted-foreground">{narrative}</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-md border border-white/10 bg-black/20 p-3">
                <p className="text-muted-foreground">Start Date</p>
                <p className="mt-1 font-medium text-foreground">{startDate}</p>
              </div>
              <div className="rounded-md border border-white/10 bg-black/20 p-3">
                <p className="text-muted-foreground">End Date</p>
                <p className="mt-1 font-medium text-foreground">{endDate}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {metrics.map((metric) => (
          <Card key={metric.label} className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">{metric.label}</p>
                <p className="mt-3 text-3xl font-semibold text-foreground">{metric.value}</p>
                <Badge tone={metric.tone} className="mt-4">
                  {metric.detail}
                </Badge>
              </div>
              <div className="rounded-md border border-white/10 bg-white/5 p-2 text-muted-foreground">
                {metric.label === "Yield Spread" ? (
                  <Scale className="h-5 w-5" />
                ) : (
                  <ArrowUpRight className="h-5 w-5" />
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

