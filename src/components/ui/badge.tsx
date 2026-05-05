import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: "orange" | "cyan" | "green" | "neutral";
};

const tones: Record<NonNullable<BadgeProps["tone"]>, string> = {
  orange: "border-primary/35 bg-primary/12 text-primary",
  cyan: "border-secondary/35 bg-secondary/12 text-secondary",
  green: "border-accent/35 bg-accent/12 text-accent",
  neutral: "border-white/15 bg-white/8 text-muted-foreground"
};

export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}

