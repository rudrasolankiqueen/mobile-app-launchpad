import { z } from "zod";
import { safeUrl } from "./finder-card";

const skill = z.object({ name: z.string().trim().min(1).max(40), evidence: z.string().trim().max(200), evidenceUrl: z.string().trim().max(300).refine(v => !v || safeUrl(v) !== null, "Use a valid web address") });
export function validDate(v: string) { return /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v)) && new Date(v).toISOString().slice(0, 10) === v; }
export const listingSchema = z.object({
  id: z.string().uuid().optional(), eventName: z.string().trim().min(1, "Add an event name").max(120), description: z.string().trim().max(3000),
  skillsNeeded: z.array(z.string().trim().min(1).max(40)).max(15), openSpots: z.number().int().min(1).max(100).nullable(),
  deadline: z.string().refine(v => !v || validDate(v), "Choose a valid deadline"), status: z.enum(["draft", "active"]),
  card: z.object({ displayName: z.string().trim().max(60), college: z.string().trim().max(100), personalNote: z.string().trim().max(300), skills: z.array(skill).max(15) }),
}).superRefine((v, ctx) => {
  if (v.status !== "active") return;
  if (!v.card.displayName) ctx.addIssue({ code: "custom", message: "Add your display name", path: ["card", "displayName"] });
  if (!v.card.skills.length) ctx.addIssue({ code: "custom", message: "Add at least one skill to your Finder Card", path: ["card", "skills"] });
  if (!v.skillsNeeded.length) ctx.addIssue({ code: "custom", message: "Add at least one skill needed", path: ["skillsNeeded"] });
  if (v.deadline && v.deadline < new Date().toISOString().slice(0, 10)) ctx.addIssue({ code: "custom", message: "Deadline must be today or later", path: ["deadline"] });
});
export type ListingInput = z.infer<typeof listingSchema>;
export const emptyListing: ListingInput = { eventName: "", description: "", skillsNeeded: [], openSpots: null, deadline: "", status: "draft", card: { displayName: "", college: "", personalNote: "", skills: [] } };
export const exploreSchema = z.object({ q: z.string().default(""), skill: z.string().default(""), deadline: z.string().default(""), sort: z.string().default("newest"), page: z.coerce.number().default(1), tab: z.string().default("members") });
export type ExploreFilters = z.infer<typeof exploreSchema>;
export function safeFilters(v: ExploreFilters) { return { ...v, q: v.q.slice(0, 120), skill: v.skill.trim().slice(0, 40), deadline: validDate(v.deadline) ? v.deadline : "", page: Number.isFinite(v.page) ? Math.max(1, Math.min(10000, Math.floor(v.page))) : 1, sort: v.sort === "deadline" ? "deadline" : "newest", tab: v.tab === "join" ? "join" : "members" }; }