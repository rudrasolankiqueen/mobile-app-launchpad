import { Link } from "@tanstack/react-router";
import { CalendarDays, Users, ArrowUpRight } from "lucide-react";
import { SkillTag } from "./SkillTag";
import { TFCard } from "./TFCard";
import type { Listing } from "@/lib/listings.functions";
export function ListingCard({ listing: l }: { listing: Listing }) {
  return <TFCard interactive className="flex h-full flex-col rounded-lg">
    <div className="flex items-start justify-between gap-3"><Link to="/listing/$id" params={{ id: l.id }} className="break-words text-lg font-semibold hover:text-primary">{l.event_name}</Link><ArrowUpRight className="size-5 shrink-0 text-accent" /></div>
    <p className="mt-2 text-sm text-muted-foreground">{l.finder_cards?.display_name ?? "Team organizer"}{l.finder_cards?.college ? ` · ${l.finder_cards.college}` : ""}</p>
    <p className="mt-4 line-clamp-3 break-words text-sm">{l.description || "A new team is taking shape."}</p>
    <div className="my-4 flex flex-wrap gap-1.5">{l.skills_needed.map(s => <SkillTag key={s} label={s} />)}</div>
    <div className="mt-auto flex flex-wrap gap-3 border-t pt-3 text-xs text-muted-foreground"><span className="flex items-center gap-1"><CalendarDays className="size-3.5" />{l.deadline ?? "No deadline"}</span>{l.open_spots && <span className="flex items-center gap-1"><Users className="size-3.5" />{l.open_spots} open spots</span>}<span className="capitalize">{l.status}</span></div>
  </TFCard>;
}