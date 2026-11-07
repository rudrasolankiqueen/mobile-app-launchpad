import { Link } from "@tanstack/react-router";
import { ArrowLeft, Construction } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PlaceholderPage({ title, description }: { title: string; description: string }) {
  return <main id="main-content" className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8">
    <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">Up next</p>
    <h1 className="text-3xl font-bold">{title}</h1>
    <div className="mt-12 flex max-w-xl flex-col items-start gap-5 border-t pt-10">
      <Construction className="size-10 text-accent" aria-hidden="true" />
      <h2 className="text-xl font-semibold">Coming soon</h2>
      <p className="text-muted-foreground">{description}</p>
      <Button asChild variant="outline"><Link to="/"><ArrowLeft />Back to TeamFit</Link></Button>
    </div>
  </main>;
}