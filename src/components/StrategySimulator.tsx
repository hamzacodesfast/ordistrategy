import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatBtcAmount, formatMultiple, formatUsd } from "@/lib/formatters";
import type { DisplayCurrency } from "@/types/market";

type StrategyRow = {
  strategy: string;
  yieldType: string;
  startingBtc: number;
  currentBtc: number;
  currentUsd: number;
  btcMultiple: number;
};

type StrategySimulatorProps = {
  rows: StrategyRow[];
  initialBtc: number;
  displayCurrency: DisplayCurrency;
};

export function StrategySimulator({ rows, initialBtc, displayCurrency }: StrategySimulatorProps) {
  return (
    <Card className="overflow-hidden border-primary/20">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border p-5">
        <div>
          <p className="text-lg font-semibold text-foreground">Strategy Simulator</p>
          <p className="mt-1 text-sm text-muted-foreground">
            If I started with {formatBtcAmount(initialBtc)} on ORDI mint day, what would I have today?
          </p>
        </div>
        <Badge tone="green">Current focus: {displayCurrency}</Badge>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[780px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="px-5 py-3 font-medium">Strategy</th>
              <th className="px-5 py-3 font-medium">Yield Type</th>
              <th className="px-5 py-3 text-right font-medium">Starting BTC</th>
              <th className="px-5 py-3 text-right font-medium">Current BTC</th>
              <th className="px-5 py-3 text-right font-medium">Current USD</th>
              <th className="px-5 py-3 text-right font-medium">BTC Multiple</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.strategy} className="border-b border-border/70 last:border-0">
                <td className="px-5 py-4 font-semibold text-foreground">{row.strategy}</td>
                <td className="px-5 py-4 text-muted-foreground">{row.yieldType}</td>
                <td className="px-5 py-4 text-right">{formatBtcAmount(row.startingBtc)}</td>
                <td className="px-5 py-4 text-right font-semibold text-primary">
                  {formatBtcAmount(row.currentBtc)}
                </td>
                <td className="px-5 py-4 text-right font-semibold">{formatUsd(row.currentUsd)}</td>
                <td className="px-5 py-4 text-right font-semibold">{formatMultiple(row.btcMultiple)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
