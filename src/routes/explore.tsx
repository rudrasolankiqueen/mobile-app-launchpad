import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Search, Plus, ArrowLeft, ArrowRight } from "lucide-react";
import { pageHead } from "@/lib/page-head";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ListingCard } from "@/components/teamfit/ListingCard";
import { EmptyState } from "@/components/teamfit/EmptyState";
import { ListingError, ListingMissing } from "@/components/teamfit/ListingBoundary";
import { exploreSchema, safeFilters } from "@/lib/listings";
import { exploreOptions } from "@/lib/listings.queries";

export const Route = createFileRoute("/explore")({
  validateSearch: exploreSchema,
  loaderDeps: ({ search }) => safeFilters(search),
  loader: ({ context, deps }) => context.queryClient.ensureQueryData(exploreOptions(deps)),
  head: () => pageHead("Explore teams", "Find TeamFit teams by event, skill and deadline, and meet your next teammates."),
  errorComponent: ListingError,
  notFoundComponent: ListingMissing,
  component: Explore,
});

function Explore() {
  const filters = safeFilters(Route.useSearch());
  const navigate = useNavigate({ from: "/explore" });
  const { data } = useSuspenseQuery(exploreOptions(filters));
  const pages = Math.max(1, Math.ceil(data.count / 9));
  function update(next: Partial<typeof filters>) { navigate({ search: { ...filters, ...next, page: next.page ?? 1 } }); }
  return <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-semibold text-accent">FIND YOUR PEOPLE</p><h1 className="mt-2 text-3xl font-bold">Explore teams</h1></div><Button asChild><Link to="/create-listing"><Plus className="size-4" />Post a Listing</Link></Button></div>
    <div className="my-7 flex flex-wrap gap-2 border-b pb-4" role="tablist" aria-label="Explore type"><Button role="tab" aria-selected={filters.tab !== "join"} variant={filters.tab !== "join" ? "default" : "outline"} onClick={() => update({ tab: "members" })}>Looking for Members</Button><Button role="tab" aria-selected={filters.tab === "join"} variant={filters.tab === "join" ? "default" : "outline"} onClick={() => update({ tab: "join" })}>Looking to Join</Button></div>
    {filters.tab === "join" ? <EmptyState title="Looking to Join is coming soon" description="Student cards will be available in Phase 7." /> : <>
      <form key={`${filters.q}:${filters.skill}:${filters.deadline}:${filters.sort}`} onSubmit={e => { e.preventDefault(); const form = new FormData(e.currentTarget); update({ q: String(form.get("q") ?? ""), skill: String(form.get("skill") ?? ""), deadline: String(form.get("deadline") ?? ""), sort: String(form.get("sort") ?? "newest") }); }} className="grid items-end gap-4 border-b pb-6 md:grid-cols-2 lg:grid-cols-5">
        <div className="space-y-2 lg:col-span-2"><Label htmlFor="search-teams">Search teams</Label><Input id="search-teams" name="q" defaultValue={filters.q} maxLength={120} placeholder="Event, project or skill" /></div>
        <div className="space-y-2"><Label htmlFor="filter-skill">Skill needed</Label><Input id="filter-skill" name="skill" defaultValue={filters.skill} maxLength={40} placeholder="e.g. React" /></div>
        <div className="space-y-2"><Label htmlFor="filter-deadline">Deadline on or before</Label><Input id="filter-deadline" name="deadline" type="date" defaultValue={filters.deadline} /></div>
        <div className="space-y-2"><Label htmlFor="sort-teams">Sort by</Label><select id="sort-teams" name="sort" defaultValue={filters.sort} className="h-10 w-full rounded-md border border-input bg-card px-3 text-sm"><option value="newest">Newest first</option><option value="deadline">Deadline first</option></select></div>
        <div className="flex gap-2 lg:col-span-5"><Button type="submit"><Search className="size-4" />Search</Button><Button type="button" variant="ghost" onClick={() => update({ q: "", skill: "", deadline: "", sort: "newest" })}>Clear filters</Button></div>
      </form>
      <p className="my-6 text-sm text-muted-foreground">{data.count} {data.count === 1 ? "team" : "teams"}</p>
      {data.rows.length ? <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{data.rows.map(listing => <ListingCard key={listing.id} listing={listing} />)}</div> : <EmptyState title="No teams found" description="Try another search or start a new team." action={<Button asChild><Link to="/create-listing">Post a Listing</Link></Button>} />}
      {(pages > 1 || filters.page > 1) && <nav aria-label="Explore pages" className="mt-8 flex items-center justify-center gap-4"><Button variant="outline" disabled={filters.page <= 1} onClick={() => update({ page: filters.page - 1 })}><ArrowLeft className="size-4" />Previous</Button><span className="text-sm">Page {filters.page} of {pages}</span><Button variant="outline" disabled={filters.page >= pages} onClick={() => update({ page: filters.page + 1 })}>Next<ArrowRight className="size-4" /></Button></nav>}
    </>}
  </main>;
}
