"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type SwitchProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  "aria-label"?: string;
};

export function Switch({ checked, onCheckedChange, "aria-label": ariaLabel }: SwitchProps) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-pressed={checked}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative h-6 w-11 rounded-full border transition",
        checked
          ? "border-primary/60 bg-primary/70"
          : "border-border bg-muted"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 h-5 w-5 rounded-full bg-white transition",
          checked ? "left-5" : "left-0.5"
        )}
      />
    </button>
  );
}
