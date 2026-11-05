import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed bg-card px-6 py-10 text-center">
      <svg width="96" height="72" viewBox="0 0 96 72" fill="none" aria-hidden className="mb-4">
        <rect x="8" y="14" width="52" height="40" rx="8" className="fill-primary-soft stroke-primary/40" strokeWidth="2" />
        <rect x="36" y="22" width="52" height="40" rx="8" className="fill-card stroke-primary" strokeWidth="2" />
        <rect x="46" y="34" width="20" height="6" rx="3" className="fill-accent" />
        <rect x="46" y="44" width="32" height="6" rx="3" className="fill-primary-soft" />
        <circle cx="20" cy="26" r="5" className="fill-primary/50" />
      </svg>
      <h3 className="text-base font-semibold">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
