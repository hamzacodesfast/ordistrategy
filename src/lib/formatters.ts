export function formatUsd(value: number) {
  const fractionDigits = Math.abs(value) < 1 ? 4 : 2;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits
  }).format(value);
}

export function formatBtc(value: number) {
  return `${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 8,
    minimumFractionDigits: value >= 1 ? 2 : 8
  }).format(value)} BTC`;
}

export function formatBtcAmount(value: number) {
  return `${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 8,
    minimumFractionDigits: value >= 1 ? 2 : 0
  }).format(value)} BTC`;
}

export function formatPercent(value: number) {
  return `${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: Math.abs(value) >= 100 ? 0 : 1,
    minimumFractionDigits: Math.abs(value) >= 100 ? 0 : 1
  }).format(value * 100)}%`;
}

export function formatMultiple(value: number) {
  return `${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: value >= 100 ? 1 : 2,
    minimumFractionDigits: value >= 100 ? 1 : 2
  }).format(value)}x`;
}

export function formatCompactUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 2
  }).format(value);
}

export function formatCompactBtc(value: number) {
  return `${new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2
  }).format(value)} BTC`;
}

export function formatSats(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0
  }).format(value);
}

