import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useNavigate } from "@tanstack/react-router";
import { Bookmark, Send, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FinderCardForm } from "@/components/finder-card/FinderCardForm";
import { SkillTagInput } from "@/components/finder-card/SkillTagInput";
import { fetchSavedFinderCard, saveFinderCard, fromRow } from "@/lib/finder-card";
import { useAuth } from "@/lib/auth";
import { emptyListing, listingSchema, type ListingInput } from "@/lib/listings";
import { getListingSession, saveListing } from "@/lib/listings.functions";
import { Modal } from "./Modal";
import { EmptyState } from "./EmptyState";

export function ListingEditor({ id }: { id?: string }) {
  const { user, requireAuth } = useAuth(); const navigate = useNavigate(); const cache = useQueryClient();
  const [value, setValue] = useState<ListingInput>(emptyListing); const [ready, setReady] = useState(false); const [error, setError] = useState(""); const [posted, setPosted] = useState<string | null>(null);
  const readSession = useServerFn(getListingSession); const write = useServerFn(saveListing);
  const own = useQuery({ queryKey: ["listing-editor", id, user?.id], queryFn: () => readSession({ data: id ?? "" }), enabled: Boolean(id && user), retry: false });
  const saved = useQuery({ queryKey: ["saved-finder-card", user?.id], queryFn: () => fetchSavedFinderCard(user?.id ?? ""), enabled: Boolean(user) });
  const key = `teamfit-listing-form:${id ?? "new"}`;
  useEffect(() => { if (id) return; try { const raw = localStorage.getItem(key); if (raw) { const parsed = JSON.parse(raw); const draft = listingSchema.safeParse({ ...parsed, status: "draft", eventName: parsed.eventName || "Untitled" }); if (draft.success) setValue({ ...draft.data, eventName: parsed.eventName }); } } catch { /* Ignore invalid local forms. */ } setReady(true); }, [id, key]);
  useEffect(() => { const l = own.data?.listing; if (!l || ready) return; setValue({ id: l.id, eventName: l.event_name, description: l.description ?? "", skillsNeeded: l.skills_needed, openSpots: l.open_spots, deadline: l.deadline ?? "", status: "draft", card: l.finder_cards ? fromRow(l.finder_cards) : emptyListing.card }); setReady(true); }, [own.data, ready]);
  useEffect(() => { if (!ready || posted) return; try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* Saving remains available without local storage. */ } }, [value, ready, key, posted]);
  const mutation = useMutation({ mutationFn: (data: ListingInput) => write({ data }), onSuccess: async (listingId, input) => { await cache.invalidateQueries({ queryKey: ["listings"] }); cache.invalidateQueries({ queryKey: ["own-listings"] }); if (input.status === "draft") { setValue(v => ({ ...v, id: listingId })); toast.success("Draft saved"); } else { localStorage.removeItem(key); setPosted(listingId); } }, onError: e => setError(e instanceof Error ? e.message : "Couldn't save listing") });
  const profile = useMutation({ mutationFn: async () => { if (!user) throw new Error("Sign in to save your profile"); return saveFinderCard(user.id, { ...value.card, id: saved.data?.id }, true); }, onSuccess: () => { cache.invalidateQueries({ queryKey: ["saved-finder-card"] }); toast.success("Profile saved"); finish(); }, onError: () => toast.error("Couldn't save your profile. Your listing is posted.") });
  function finish() { if (posted) navigate({ to: "/listing/$id", params: { id: posted } }); }
  function submit(status: "draft" | "active") { setError(""); const parsed = listingSchema.safeParse({ ...value, status }); if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? "Check your form"); return; } const run = () => mutation.mutate(parsed.data); if (requireAuth("post", run)) run(); }
  if (id && !user) return <main className="mx-auto max-w-3xl px-4 py-16"><EmptyState title="Sign in to edit your listing" action={<Button onClick={() => requireAuth("post")}>Log in</Button>} /></main>;
  if (id && own.isPending) return <main className="px-4 py-16 text-center">Loading your listing…</main>;
  if (id && (own.isError || !own.data?.listing || own.data.listing.owner_id !== user?.id)) return <main className="mx-auto max-w-3xl px-4 py-16"><EmptyState title="This listing can't be edited" description="Only its organizer can make changes." /></main>;
  return <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6"><p className="text-sm font-semibold text-accent">TEAM UP</p><h1 className="mt-2 text-3xl font-bold">{id ? "Edit your listing" : "Post a team listing"}</h1>
    <nav aria-label="Listing sections" className="my-8 flex flex-wrap gap-6 border-b pb-4 text-sm font-medium"><a href="#event" className="text-primary">01 Event</a><a href="#finder-card">02 Finder Card</a><a href="#skills-needed">03 Skills Needed</a></nav>
    <form onSubmit={e => { e.preventDefault(); submit("active"); }} className="space-y-10">
      <section id="event" className="scroll-mt-24 space-y-5"><h2 className="text-xl font-semibold">01 · Event</h2><div className="space-y-2"><Label htmlFor="event-name">Event name *</Label><Input id="event-name" maxLength={120} value={value.eventName} onChange={e => setValue({ ...value, eventName: e.target.value })} placeholder="e.g. Smart India Hackathon" /></div><div className="space-y-2"><Label htmlFor="event-description">Project description</Label><Textarea id="event-description" rows={5} maxLength={3000} value={value.description} onChange={e => setValue({ ...value, description: e.target.value })} placeholder="What are you building?" /></div><div className="grid gap-5 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="event-spots">Open spots</Label><Input id="event-spots" type="number" min={1} max={100} value={value.openSpots ?? ""} onChange={e => setValue({ ...value, openSpots: e.target.value ? Number(e.target.value) : null })} /></div><div className="space-y-2"><Label htmlFor="event-deadline">Deadline</Label><Input id="event-deadline" type="date" value={value.deadline} onChange={e => setValue({ ...value, deadline: e.target.value })} /></div></div></section>
      <section id="finder-card" className="scroll-mt-24 space-y-5 border-t pt-8"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-semibold">02 · Finder Card</h2>{saved.data && <Button type="button" variant="outline" onClick={() => setValue({ ...value, card: saved.data ?? emptyListing.card })}><Check className="size-4" />Use saved Finder Card</Button>}</div><FinderCardForm value={value.card} onChange={card => setValue({ ...value, card })} /></section>
      <section id="skills-needed" className="scroll-mt-24 space-y-5 border-t pt-8"><h2 className="text-xl font-semibold">03 · Skills Needed</h2><SkillTagInput value={value.skillsNeeded} onChange={skillsNeeded => setValue({ ...value, skillsNeeded })} placeholder="Add the skills your team needs" /></section>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}<div className="flex flex-wrap gap-3 border-t pt-6"><Button type="submit" disabled={mutation.isPending}><Send className="size-4" />{mutation.isPending ? "Saving…" : "Save & Post Listing"}</Button><Button type="button" variant="outline" disabled={mutation.isPending} onClick={() => submit("draft")}><Bookmark className="size-4" />Save Draft</Button></div>
    </form><Modal open={Boolean(posted)} onOpenChange={open => { if (!open) finish(); }} title="Your listing is posted" description="Save this Finder Card as your reusable profile?" footer={<><Button variant="outline" onClick={finish}>Not now</Button><Button disabled={profile.isPending} onClick={() => profile.mutate()}>{profile.isPending ? "Saving…" : "Save Profile"}</Button></>} /></main>;
}