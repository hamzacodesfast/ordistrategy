import { Card } from "@/components/ui/card";

const formulas = [
  ["Asset price in BTC", "assetBtcPrice = assetUsdPrice / btcUsdPrice"],
  ["BTC yield", "btcYield = assetCurrentBtcPrice / assetStartBtcPrice - 1"],
  ["BTC multiple", "btcMultiple = assetCurrentBtcPrice / assetStartBtcPrice"],
  ["Yield spread", "yieldSpread = ordiBtcYield - strategyBtcYield"]
];

export function Methodology() {
  return (
    <Card className="p-5">
      <h3 className="text-xl font-semibold text-foreground">Methodology</h3>
      <p className="mt-3 max-w-4xl text-sm leading-7 text-muted-foreground">
        BTC yield measures how much an asset appreciated or depreciated relative to
        Bitcoin. If an asset&apos;s BTC-denominated price rises, it increased BTC
        purchasing power. If it falls, it underperformed holding BTC.
      </p>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {formulas.map(([label, formula]) => (
          <div key={label} className="rounded-md border border-border bg-black/25 p-4">
            <p className="text-sm font-medium text-foreground">{label}</p>
            <code className="mt-2 block overflow-x-auto rounded bg-muted/35 p-3 text-xs text-primary">
              {formula}
            </code>
          </div>
        ))}
      </div>
      <p className="mt-5 text-sm leading-7 text-muted-foreground">
        This dashboard is for research only. It does not provide trading
        recommendations, buy/sell signals, wallet custody, or brokerage integration.
      </p>
    </Card>
  );
}
