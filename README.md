# ORDI Strategy

Live site: [ordistrategy.com](https://ordistrategy.com)

ORDI Strategy is a Bitcoin-denominated analytics dashboard comparing ORDI's decentralized BTC yield against MSTR's engineered BTC exposure.

The core question:

> Since ORDI's mint day, did ORDI generate more BTC purchasing power than MSTR?

This is not a USD-first performance dashboard. The main scoreboard is BTC purchasing power.

## What It Compares

### ORDI: Decentralized BTC Capture

ORDI captures BTC value through open-market demand, Ordinals-native scarcity, cultural premium, liquidity, speculation, and Bitcoin-native attention.

In this dashboard, ORDI's KPI is measured per token:

- BTC per ORDI
- sats per ORDI
- percentage change in BTC per ORDI
- ORDI BTC yield from mint price

ORDI does not have a corporate treasury, assumed diluted share count, debt stack, or equity dilution mechanism. The denominator is one ORDI token.

### MSTR: Engineered BTC Capture

MSTR, now Strategy, captures BTC exposure through a public-company treasury strategy using equity, debt, convertibles, market premium, and capital markets.

The dashboard separates two ideas:

- MSTR market BTC return: MSTR stock performance measured against BTC
- Strategy official BTC Yield KPI: percentage change in Bitcoin per assumed diluted share

This distinction matters because Strategy's official BTC Yield KPI is not the same thing as traditional investment return, interest yield, or MSTR stock price return.

## Core Formula

Asset price in BTC:

```ts
assetStartBtcPrice = assetStartUsdPrice / btcStartUsdPrice;
assetCurrentBtcPrice = assetCurrentUsdPrice / btcCurrentUsdPrice;
```

BTC yield:

```ts
btcYield = assetCurrentBtcPrice / assetStartBtcPrice - 1;
```

BTC multiple:

```ts
btcMultiple = assetCurrentBtcPrice / assetStartBtcPrice;
```

Yield spread:

```ts
yieldSpread = ordiBtcYield - mstrBtcYield;
```

If an asset's BTC-denominated price rises, it increased BTC purchasing power. If it falls, it underperformed holding BTC.

## Features

- Live BTC-USD, ORDI-USD, and MSTR market data
- ORDI mint price basis anchored at `$0.005`
- Default start date: `2023-03-08`
- Since-mint, weekly, monthly, yearly, and custom timeframes
- Share-to-X buttons for since-mint, yearly, monthly, and weekly snapshots
- ORDI BTC yield and BTC multiple
- MSTR market BTC return
- Strategy official BTC Yield KPI panel
- ORDI per-token BTC KPI panel
- ORDI minus MSTR yield spread
- Strategy simulator for holding BTC, buying ORDI, or buying MSTR
- Normalized ORDI/BTC vs MSTR/BTC charts
- Methodology section with visible formulas

## Data Sources

Market data is fetched live from Yahoo Finance:

- `BTC-USD`
- `ORDI-USD`
- `MSTR`

Strategy official KPI inputs are parsed from Strategy's published shares data when available, with fallback KPI points used if the page cannot be parsed.

The API route is served from:

```text
/api/prices
```

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Recharts
- local shadcn-style UI components
- PM2 and Nginx in production

## Local Development

Install dependencies:

```bash
npm ci
```

Start the dev server:

```bash
npm run dev
```

Run checks:

```bash
npm run lint
npm run typecheck
npm run build
```

## Production

The app is deployed as a dynamic Next.js server because it serves live market data through `/api/prices`.

Production process:

```bash
npm ci
npm run build
pm2 start ecosystem.config.cjs
```

## Important Notes

This dashboard is for research and analytics only.

It does not provide:

- trading recommendations
- buy or sell signals
- wallet connection
- brokerage integration
- custody features
- portfolio management

## License

Private project. All rights reserved.
