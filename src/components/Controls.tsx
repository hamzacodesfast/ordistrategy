"use client";

import { Activity, BadgeDollarSign, Bitcoin, CalendarDays, CalendarRange } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { timeframeOptions } from "@/lib/timeframes";
import type { DisplayCurrency, Timeframe } from "@/types/market";

type ControlsProps = {
  startDate: string;
  minDate: string;
  maxDate: string;
  timeframe: Timeframe;
  initialBtc: number;
  normalizeChart: boolean;
  displayCurrency: DisplayCurrency;
  onStartDateChange: (value: string) => void;
  onTimeframeChange: (value: Timeframe) => void;
  onInitialBtcChange: (value: number) => void;
  onNormalizeChartChange: (value: boolean) => void;
  onDisplayCurrencyChange: (value: DisplayCurrency) => void;
};

export function Controls({
  startDate,
  minDate,
  maxDate,
  timeframe,
  initialBtc,
  normalizeChart,
  displayCurrency,
  onStartDateChange,
  onTimeframeChange,
  onInitialBtcChange,
  onNormalizeChartChange,
  onDisplayCurrencyChange
}: ControlsProps) {
  return (
    <Card className="border-white/10">
      <CardContent className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-[1.35fr_1fr_0.8fr_0.9fr_0.8fr]">
        <div className="space-y-2 md:col-span-2 xl:col-span-1">
          <Label className="flex items-center gap-2">
            <CalendarRange className="h-3.5 w-3.5" />
            Timeframe
          </Label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-2 2xl:grid-cols-4">
            {timeframeOptions.map((option) => (
              <Button
                key={option.value}
                type="button"
                variant={timeframe === option.value ? "default" : "outline"}
                onClick={() => onTimeframeChange(option.value)}
                className="px-2"
              >
                {option.label}
              </Button>
            ))}
          </div>
          {timeframe === "custom" ? (
            <p className="text-xs leading-5 text-muted-foreground">Custom date active.</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="start-date" className="flex items-center gap-2">
            <CalendarDays className="h-3.5 w-3.5" />
            Period Start
          </Label>
          <Input
            id="start-date"
            type="date"
            min={minDate}
            max={maxDate}
            value={startDate}
            onChange={(event) => onStartDateChange(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="initial-btc" className="flex items-center gap-2">
            <Bitcoin className="h-3.5 w-3.5" />
            Initial BTC
          </Label>
          <Input
            id="initial-btc"
            min="0.01"
            step="0.01"
            type="number"
            value={initialBtc}
            onChange={(event) => {
              const value = Number(event.target.value);
              onInitialBtcChange(Number.isFinite(value) && value > 0 ? value : 0.01);
            }}
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Activity className="h-3.5 w-3.5" />
            Normalize Chart
          </Label>
          <div className="flex h-10 items-center justify-between rounded-md border border-border bg-muted/40 px-3">
            <span className="text-sm text-foreground">{normalizeChart ? "On" : "Yield %"}</span>
            <Switch
              checked={normalizeChart}
              aria-label="Toggle normalized chart"
              onCheckedChange={onNormalizeChartChange}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <BadgeDollarSign className="h-3.5 w-3.5" />
            Display Currency
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {(["USD", "BTC"] as const).map((currency) => (
              <Button
                key={currency}
                type="button"
                variant={displayCurrency === currency ? "default" : "outline"}
                onClick={() => onDisplayCurrencyChange(currency)}
              >
                {currency}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

