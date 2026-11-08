import { useRouter, type ErrorComponentProps } from "@tanstack/react-router";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { EmptyState } from "./EmptyState";
export function ListingError({ reset }: ErrorComponentProps) {
  const router = useRouter(); const boundary = useQueryErrorResetBoundary();
  return <main className="mx-auto max-w-3xl px-4 py-16"><EmptyState title="Teams couldn't be loaded" action={<Button onClick={() => { boundary.reset(); router.invalidate(); reset(); }}>Try again</Button>} /></main>;
}
export function ListingMissing() { return <main className="mx-auto max-w-3xl px-4 py-16"><EmptyState title="Listing unavailable" description="It may be a private draft, or no longer available." /></main>; }