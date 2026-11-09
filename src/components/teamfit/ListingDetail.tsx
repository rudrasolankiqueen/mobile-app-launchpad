import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { CalendarDays, Users, Share2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FinderCardDisplay } from "@/components/finder-card/FinderCardDisplay";
import { fromRow } from "@/lib/finder-card";
import { useAuth } from "@/lib/auth";
import { closeListing, getListingSession, type Listing } from "@/lib/listings.functions";
import { SkillTag } from "./SkillTag";
import { EmptyState } from "./EmptyState";
import { Modal } from "./Modal";

export function ListingDetail({ listing }: { listing: Listing }) {
  const { user, requireAuth } = useAuth();
  const cache = useQueryClient();
  const read = useServerFn(getListingSession);
  const close = useServerFn(closeListing);
  const [confirm, setConfirm] = useState(false);
  const [interest, setInterest] = useState(false);
  const session = useQuery({ queryKey: ["listing-session", listing.id, user?.id], queryFn: () => read({ data: listing.id }), enabled: Boolean(user), retry: false });
  const owner = user?.id === listing.owner_id;
  const request = session.data?.requests.find(r => r.sender_id === user?.id);
  const mutation = useMutation({ mutationFn: () => close({ data: listing.id }), onSuccess: async () => { setConfirm(false); await cache.invalidateQueries({ queryKey: ["listings"] }); await cache.invalidateQueries({ queryKey: ["own-listings"] }); toast.success("Listing closed"); }, onError: () => toast.error("Couldn't close the listing. Please try again.") });
  async function share() { const url = window.location.href; try { if (navigator.share) await navigator.share({ title: listing.event_name, url }); else { await navigator.clipboard.writeText(url); toast.success("Link copied"); } } catch (e) { if (!(e instanceof Error && e.name === "AbortError")) toast.error("Couldn't share. Copy the address from your browser."); } }
  return <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
    <Button asChild variant="link" className="mb-5 px-0"><Link to="/explore">← Explore teams</Link></Button>
    <div className="flex flex-wrap items-start justify-between gap-4"><div className="min-w-0"><p className="text-sm font-semibold capitalize text-accent">{listing.status === "active" ? "Looking for teammates" : "Team closed"}</p><h1 className="mt-2 break-words text-3xl font-bold">{listing.event_name}</h1><div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground"><span className="flex items-center gap-2"><CalendarDays className="size-4" />{listing.deadline ?? "No deadline"}</span>{listing.open_spots !== null && <span className="flex items-center gap-2"><Users className="size-4" />{listing.open_spots} open spots</span>}</div></div><Button variant="outline" onClick={share}><Share2 className="size-4" />Share link</Button></div>
    <div className="mt-9 grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]"><div className="min-w-0 space-y-8"><section><h2 className="mb-4 text-xl font-semibold">The project</h2><p className="whitespace-pre-wrap break-words text-muted-foreground">{listing.description || "The organizer hasn't added a description yet."}</p></section><section className="border-t pt-6"><h2 className="mb-4 text-xl font-semibold">Skills needed</h2><div className="flex flex-wrap gap-2">{listing.skills_needed.map(s => <SkillTag key={s} label={s} />)}</div></section><section className="border-t pt-6"><h2 className="mb-4 text-xl font-semibold">Meet the organizer</h2>{listing.finder_cards ? <FinderCardDisplay card={fromRow(listing.finder_cards)} /> : <p className="text-muted-foreground">No Finder Card available.</p>}</section>
      {owner && <section className="border-t pt-6"><h2 className="mb-4 text-xl font-semibold">Received requests</h2>{session.isError ? <p role="alert">Couldn't load requests.</p> : session.isPending ? <p>Loading requests…</p> : session.data?.requests.length ? <ul className="divide-y">{session.data.requests.map(r => <li key={r.id} className="py-4"><p className="text-sm font-semibold capitalize">{r.status}</p><p className="mt-2 whitespace-pre-wrap break-words">{r.message}</p><p className="mt-2 text-xs text-muted-foreground">{r.created_at.slice(0, 10)}</p></li>)}</ul> : <EmptyState title="No requests yet" />}</section>}
    </div><aside className="space-y-7"><section className="border-b pb-6">{owner ? <div className="flex flex-wrap gap-3"><Button asChild><Link to="/listing/$id/edit" params={{ id: listing.id }}><Pencil className="size-4" />Edit listing</Link></Button>{listing.status === "active" && <Button variant="outline" onClick={() => setConfirm(true)}>Close listing</Button>}</div> : user && session.isPending ? <p className="text-sm text-muted-foreground">Checking request status…</p> : session.isError ? <p role="alert" className="text-sm">Couldn't check your request status. <Button variant="link" onClick={() => session.refetch()}>Retry</Button></p> : request ? <p role="status" className="font-semibold capitalize">Request Sent – {request.status}</p> : listing.status !== "active" ? <p className="font-semibold">This team is no longer accepting requests.</p> : <Button className="w-full" onClick={() => { if (requireAuth("interest", () => setInterest(true))) setInterest(true); }}>I'm Interested</Button>}</section><section><h2 className="mb-4 font-semibold">Looking to Join</h2><p className="text-sm text-muted-foreground">Matching student cards arrive in Phase 7.</p></section></aside></div>
    <Modal open={confirm} onOpenChange={setConfirm} title="Close this listing?" description="It will no longer appear in Explore. The shared link will remain available." footer={<><Button variant="outline" onClick={() => setConfirm(false)}>Cancel</Button><Button disabled={mutation.isPending} onClick={() => mutation.mutate()}>{mutation.isPending ? "Closing…" : "Close listing"}</Button></>} />
    <Modal open={interest} onOpenChange={setInterest} title="Interest requests are coming soon" description="Sending a Finder Card and accepting requests will be available in Phase 6." />
  </main>;
}