import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database, Json } from "@/integrations/supabase/types";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { exploreSchema, safeFilters, listingSchema } from "./listings";

const selection = "id,owner_id,event_name,description,skills_needed,open_spots,deadline,status,created_at,finder_cards(id,display_name,college,personal_note,skill_evidence(skill_name,evidence,evidence_url,position))";
function publicClient() {
  const url = process.env["SUPABASE_URL"], key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) throw new Error("Team listings are temporarily unavailable");
  return createClient<Database>(url, key, { auth: { persistSession: false, autoRefreshToken: false }, global: { fetch: (input, init) => { const headers = new Headers(init?.headers); if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization"); headers.set("apikey", key); return fetch(input, { ...init, headers }); } } });
}
export const exploreListings = createServerFn({ method: "GET" }).inputValidator((v: unknown) => exploreSchema.parse(v)).handler(async ({ data }) => {
  const f = safeFilters(data);
  if (f.tab === "join") return { rows: [], count: 0 };
  let query = publicClient().from("team_listings").select(selection, { count: "exact" }).eq("status", "active");
  if (f.q.trim()) query = query.textSearch("search_vector", f.q.trim(), { type: "websearch", config: "english" });
  if (f.skill) { const { data: skills } = await publicClient().from("skills").select("name").ilike("name", f.skill); query = query.contains("skills_needed", [skills?.find(s => s.name.toLowerCase() === f.skill.toLowerCase())?.name ?? f.skill]); }
  if (f.deadline) query = query.lte("deadline", f.deadline);
  query = query.order(f.sort === "deadline" ? "deadline" : "created_at", { ascending: f.sort === "deadline", nullsFirst: false }).order("id");
  const { data: rows, error, count } = await query.range((f.page - 1) * 9, f.page * 9 - 1);
  if (error) throw new Error("Couldn't load teams. Please try again.");
  return { rows: rows ?? [], count: count ?? 0 };
});
export const getPublicListing = createServerFn({ method: "GET" }).inputValidator((v: unknown) => z.string().uuid().parse(v)).handler(async ({ data: id }) => {
  const { data, error } = await publicClient().from("team_listings").select(selection).eq("id", id).neq("status", "draft").maybeSingle();
  if (error) throw new Error("Couldn't load this listing"); return data;
});
export const getOwnListings = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const { data, error } = await context.supabase.from("team_listings").select(selection).eq("owner_id", context.userId).order("updated_at", { ascending: false });
  if (error) throw new Error("Couldn't load your listings"); return data ?? [];
});
export const getListingSession = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).inputValidator((v: unknown) => z.string().uuid().parse(v)).handler(async ({ data: id, context }) => {
  const { data: listing, error } = await context.supabase.from("team_listings").select(selection).eq("id", id).maybeSingle();
  if (error) throw new Error("Couldn't load listing");
  let requestQuery = context.supabase.from("interest_requests").select("id,sender_id,status,created_at,finder_card_snapshot,message").eq("listing_id", id);
  if (listing?.owner_id !== context.userId) requestQuery = requestQuery.eq("sender_id", context.userId);
  const { data: requests, error: requestError } = await requestQuery.order("created_at", { ascending: false });
  if (requestError) throw new Error("Couldn't load requests");
  return { listing, requests: requests ?? [] };
});
export const saveListing = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((v: unknown) => listingSchema.parse(v)).handler(async ({ data, context }) => {
  const payload = { ...data, card: { ...data.card, skills: data.card.skills.map(s => ({ ...s, evidenceUrl: s.evidenceUrl ? new URL(/^[a-z]+:/i.test(s.evidenceUrl) ? s.evidenceUrl : `https://${s.evidenceUrl}`).toString() : "" })) } };
  const { data: id, error } = await context.supabase.rpc("save_team_listing", { payload: payload as Json });
  if (error) throw new Error(error.message); return id;
});
export const closeListing = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((v: unknown) => z.string().uuid().parse(v)).handler(async ({ data: id, context }) => {
  const { data, error } = await context.supabase.from("team_listings").update({ status: "closed" }).eq("id", id).eq("owner_id", context.userId).select("id").single();
  if (error || !data) throw new Error("Couldn't close your listing"); return data.id;
});
export type Listing = NonNullable<Awaited<ReturnType<typeof getPublicListing>>>;