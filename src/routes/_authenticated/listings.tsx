import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/teamfit/EmptyState";
import { ListingError, ListingMissing } from "@/components/teamfit/ListingBoundary";
import { getOwnListings } from "@/lib/listings.functions";
import { pageHead } from "@/lib/page-head";

const ownOptions = queryOptions({ queryKey: ["own-listings"], queryFn: () => getOwnListings() });
export const Route = createFileRoute("/_authenticated/listings")({
  loader: ({ context }) => context.queryClient.ensureQueryData(ownOptions),
  errorComponent: ListingError,
  notFoundComponent: ListingMissing,
  head: () => pageHead("Your listings", "Manage your TeamFit drafts, published teams and closed listings."),
  component: OwnListings,
});
function OwnListings() {
  const { data } = useSuspenseQuery(ownOptions);
  return <main className="mx-auto max-w-4xl px-4 py-10"><div className="flex flex-wrap items-center justify-between gap-4"><h1 className="text-3xl font-bold">Your listings</h1><Button asChild><Link to="/create-listing">Post a Listing</Link></Button></div>{data.length ? <ul className="mt-8 divide-y border-y">{data.map(l => <li key={l.id} className="flex flex-wrap items-center justify-between gap-4 py-5"><div className="min-w-0"><h2 className="break-words font-semibold">{l.event_name}</h2><p className="mt-1 text-sm capitalize text-muted-foreground">{l.status} · {l.deadline ?? "No deadline"}</p></div><div className="flex gap-2">{l.status !== "draft" && <Button asChild variant="outline"><Link to="/listing/$id" params={{ id: l.id }}>View</Link></Button>}<Button asChild variant="outline"><Link to="/listing/$id/edit" params={{ id: l.id }}>{l.status === "draft" ? "Continue draft" : "Edit"}</Link></Button></div></li>)}</ul> : <div className="mt-8"><EmptyState title="No listings yet" action={<Button asChild><Link to="/create-listing">Start your team</Link></Button>} /></div>}</main>;
}