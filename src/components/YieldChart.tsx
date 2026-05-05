"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { YieldSeriesPoint } from "@/lib/btcYield";

type YieldChartProps = {
  series: YieldSeriesPoint[];
  normalizeChart: boolean;
};

export function YieldChart({ series, normalizeChart }: YieldChartProps) {
  return (
    <section className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
      <Card className="p-5">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-lg font-semibold text-foreground">Normalized BTC Performance</p>
            <p className="mt-1 text-sm text-muted-foreground">
              ORDI/BTC and MSTR/BTC rebased from the selected start date.
            </p>
          </div>
          <Badge tone="green">{normalizeChart ? "Multiple view" : "Yield view"}</Badge>
        </div>
        <div className="h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={series}>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: "#9d978d", fontSize: 12 }} minTickGap={32} />
              <YAxis tick={{ fill: "#9d978d", fontSize: 12 }} width={58} />
              <Tooltip
                contentStyle={{
                  background: "#090b10",
                  border: "1px solid rgba(255,255,255,0.14)",
                  borderRadius: 8,
                  color: "#f4eee4"
                }}
              />
              <Line
                type="monotone"
                dataKey="ordiBtcNormalized"
                name="ORDI Decentralized BTC Yield"
                stroke="#f7931a"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="mstrBtcNormalized"
                name="MSTR Engineered BTC Yield"
                stroke="#19cdd6"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="btcBaseline"
                name="BTC Baseline"
                stroke="#8f8a82"
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-5">
        <div className="mb-5">
          <p className="text-lg font-semibold text-foreground">Market Return Spread</p>
          <p className="mt-1 text-sm text-muted-foreground">
            ORDI market BTC return minus MSTR market BTC return over time.
          </p>
        </div>
        <div className="h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series}>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: "#9d978d", fontSize: 12 }} minTickGap={32} />
              <YAxis tick={{ fill: "#9d978d", fontSize: 12 }} width={58} />
              <Tooltip
                contentStyle={{
                  background: "#090b10",
                  border: "1px solid rgba(255,255,255,0.14)",
                  borderRadius: 8,
                  color: "#f4eee4"
                }}
              />
              <Area
                type="monotone"
                dataKey="yieldSpreadSeries"
                name="ORDI - MSTR Yield Spread"
                stroke="#72dd65"
                fill="rgba(114,221,101,0.18)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </section>
  );
}

