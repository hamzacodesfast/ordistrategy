import { Dashboard } from "@/components/Dashboard";
import { getYahooMarketData } from "@/lib/yahooFinance";

export const dynamic = "force-dynamic";

export default async function Home() {
  let marketData;
  let loadError: string | undefined;

  try {
    marketData = await getYahooMarketData();
  } catch (error) {
    loadError =
      error instanceof Error ? error.message : "Unable to load live market data.";
  }

  return <Dashboard initialMarketData={marketData} initialError={loadError} />;
}
