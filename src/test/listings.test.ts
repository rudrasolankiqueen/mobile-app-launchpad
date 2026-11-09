import { describe, expect, it, vi, afterEach } from "vitest";
import { emptyListing, listingSchema, safeFilters, exploreSchema } from "@/lib/listings";

const active = () => ({ ...emptyListing, eventName: "Campus Hackathon", status: "active", skillsNeeded: ["React"], card: { displayName: "Rudra", college: "", personalNote: "", skills: [{ name: "Python", evidence: "", evidenceUrl: "" }] } });
afterEach(() => vi.useRealTimers());
describe("Team listing rules", () => {
  it("allows incomplete Finder Cards in drafts", () => { expect(listingSchema.safeParse({ ...emptyListing, eventName: "Draft" }).success).toBe(true); });
  it("requires an event name", () => { expect(listingSchema.safeParse({ ...active(), eventName: "" }).success).toBe(false); });
  it("requires a display name before posting", () => { const v = active(); v.card.displayName = ""; expect(listingSchema.safeParse(v).success).toBe(false); });
  it("requires a Finder Card skill before posting", () => { const v = active(); v.card.skills = []; expect(listingSchema.safeParse(v).success).toBe(false); });
  it("requires skills needed before posting", () => { expect(listingSchema.safeParse({ ...active(), skillsNeeded: [] }).success).toBe(false); });
  it("rejects past deadlines but accepts today", () => { vi.useFakeTimers(); vi.setSystemTime(new Date("2026-11-09T09:00:00Z")); expect(listingSchema.safeParse({ ...active(), deadline: "2026-11-08" }).success).toBe(false); expect(listingSchema.safeParse({ ...active(), deadline: "2026-11-09" }).success).toBe(true); });
  it("rejects impossible dates", () => { expect(listingSchema.safeParse({ ...emptyListing, eventName: "Draft", deadline: "2027-02-30" }).success).toBe(false); });
  it("rejects unsafe evidence links", () => { const v = active(); v.card.skills[0] = { name: "Python", evidence: "", evidenceUrl: "javascript:alert(1)" }; expect(listingSchema.safeParse(v).success).toBe(false); });
  it("normalizes search pagination, dates and tab", () => { expect(safeFilters(exploreSchema.parse({ page: -4, deadline: "2027-02-30", tab: "unknown", sort: "other" }))).toMatchObject({ page: 1, deadline: "", tab: "members", sort: "newest" }); });
});