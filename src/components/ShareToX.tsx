import { ExternalLink, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type ShareOption = {
  label: string;
  href: string;
  summary: string;
  isActive: boolean;
};

type ShareToXProps = {
  options: ShareOption[];
};

export function ShareToX({ options }: ShareToXProps) {
  return (
    <Card className="border-secondary/20 bg-card/85">
      <CardHeader className="space-y-3 pb-3">
        <Badge tone="cyan" className="w-fit gap-2">
          <Share2 className="h-3.5 w-3.5" />
          Share live BTC yield
        </Badge>
        <div className="grid gap-2 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <CardTitle>Share BTC yield snapshots</CardTitle>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Live ORDI, Strategy, and MSTR BTC-denominated returns formatted for X.
            </p>
          </div>
          <p className="text-xs uppercase text-muted-foreground">ordistrategy.com</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {options.map((option) => (
            <a
              key={option.label}
              href={option.href}
              target="_blank"
              rel="noreferrer"
              aria-label={`Share ${option.label} ORDI Strategy data to X`}
              className={cn(
                "group flex min-h-28 flex-col justify-between rounded-md border bg-muted/35 p-4 transition hover:border-secondary/60 hover:bg-secondary/10",
                option.isActive ? "border-primary/55 bg-primary/10" : "border-border"
              )}
            >
              <span className="flex items-center justify-between gap-3">
                <span className="font-medium text-foreground">{option.label}</span>
                <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:text-secondary" />
              </span>
              <span className="mt-4 text-sm leading-6 text-muted-foreground">
                {option.summary}
              </span>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
