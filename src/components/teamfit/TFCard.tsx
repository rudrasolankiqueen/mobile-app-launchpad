import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function TFCard({
  children,
  className,
  interactive,
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-5 text-card-foreground shadow-card",
        interactive &&
          "transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-card-hover",
        className,
      )}
    >
      {children}
    </div>
  );
}
