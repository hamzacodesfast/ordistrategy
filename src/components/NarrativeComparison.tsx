import { Card } from "@/components/ui/card";

export function NarrativeComparison() {
  return (
    <section className="grid gap-5 xl:grid-cols-2">
      <NarrativeCard
        title="ORDI: Decentralized BTC Capture"
        body="ORDI captures BTC value through decentralized market demand, Ordinals-native scarcity, cultural premium, liquidity, speculation, and Bitcoin-native attention. It does not rely on corporate debt issuance, equity dilution, treasury management, or centralized capital markets."
        bullets={[
          "Decentralized Ordinals-native asset",
          "No corporate treasury",
          "No debt issuance",
          "No equity dilution mechanism",
          "Captures BTC-native attention and speculative demand",
          "Yield measured by ORDI appreciation versus BTC"
        ]}
      />
      <NarrativeCard
        title="MSTR: Engineered BTC Capture"
        body="MSTR captures BTC exposure through a public-company treasury strategy. It uses equity, debt, convertibles, market premium, and corporate financial engineering to accumulate BTC and amplify shareholder BTC exposure."
        bullets={[
          "Public company equity",
          "Corporate BTC treasury",
          "Uses debt, equity, and convertibles",
          "Can trade at premium or discount to BTC NAV",
          "BTC exposure depends on capital markets",
          "Yield measured by MSTR appreciation versus BTC"
        ]}
      />
    </section>
  );
}

function NarrativeCard({
  title,
  body,
  bullets
}: {
  title: string;
  body: string;
  bullets: string[];
}) {
  return (
    <Card className="p-5">
      <h3 className="text-xl font-semibold text-foreground">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">{body}</p>
      <ul className="mt-5 space-y-2 text-sm text-foreground/88">
        {bullets.map((bullet) => (
          <li key={bullet} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

