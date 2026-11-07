import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { TFCard } from "@/components/teamfit/TFCard";

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <main className="flex min-h-[65svh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-6 block text-center text-xl font-extrabold tracking-tight text-primary">
          TeamFit
        </Link>
        <TFCard className="p-6">
          <h1 className="text-xl font-bold">{title}</h1>
          <p className="mb-5 mt-1 text-sm text-muted-foreground">{subtitle}</p>
          {children}
        </TFCard>
      </div>
    </main>
  );
}
