import { NextResponse } from "next/server";
import { getYahooMarketData } from "@/lib/yahooFinance";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const marketData = await getYahooMarketData();
    return NextResponse.json(marketData, {
      headers: {
        "Cache-Control": "no-store"
      }
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to load live market data."
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store"
        }
      }
    );
  }
}
