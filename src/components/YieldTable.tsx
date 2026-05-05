import { Card } from "@/components/ui/card";
import type { AssetBtcMetrics } from "@/lib/btcYield";
import { formatBtc, formatMultiple, formatPercent, formatUsd } from "@/lib/formatters";
import type { DisplayCurrency } from "@/types/market";

type YieldTableProps = {
  ordi: AssetBtcMetrics;
  mstr: AssetBtcMetrics;
  displayCurrency: DisplayCurrency;
};

export function YieldTable({ ordi, mstr, displayCurrency }: YieldTableProps) {
  const rows = [
    ["Start USD Price", formatUsd(ordi.startUsd), formatUsd(mstr.startUsd)],
    ["Current USD Price", formatUsd(ordi.currentUsd), formatUsd(mstr.currentUsd)],
    ["BTC Price at Start", formatBtc(ordi.startBtcPrice), formatBtc(mstr.startBtcPrice)],
    ["BTC Price Today", formatBtc(ordi.currentBtcPrice), formatBtc(mstr.currentBtcPrice)],
    ["BTC Multiple", formatMultiple(ordi.btcMultiple), formatMultiple(mstr.btcMultiple)],
    ["BTC Yield", formatPercent(ordi.btcYield), formatPercent(mstr.btcYield)],
    ["Yield Type", "Decentralized", "Public Equity"]
  ];

  return (
    <Card className="overflow-hidden border-primary/20">
      <div className="border-b border-border p-5">
        <p className="text-lg font-semibold text-foreground">ORDI vs MSTR BTC Yield Comparison</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Display focus: {displayCurrency}. Both assets use the same period start.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="px-5 py-3 font-medium">Metric</th>
              <th className="px-5 py-3 text-right font-medium text-primary">ORDI</th>
              <th className="px-5 py-3 text-right font-medium text-secondary">MSTR</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([metric, ordiValue, mstrValue]) => (
              <tr key={metric} className="border-b border-border/70 last:border-0">
                <td className="px-5 py-4 font-medium text-muted-foreground">{metric}</td>
                <td className="px-5 py-4 text-right font-semibold text-primary">{ordiValue}</td>
                <td className="px-5 py-4 text-right font-semibold text-secondary">{mstrValue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

