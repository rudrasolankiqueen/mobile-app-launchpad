import { z } from "zod";

/** Suggestions start once the event name has this many characters. */
export const ADVISOR_MIN_CHARS = 3;
/** Wait this long after typing stops before asking the advisor. */
export const ADVISOR_DEBOUNCE_MS = 1200;
export const MAX_SUGGESTIONS = 6;

export const advisorInputSchema = z.object({
  eventName: z.string().trim().min(ADVISOR_MIN_CHARS, "Type at least 3 characters of the event name").max(120),
  description: z.string().trim().max(3000).default(""),
  mySkills: z.array(z.string().trim().min(1).max(40)).max(20).default([]),
  skillsNeeded: z.array(z.string().trim().min(1).max(40)).max(15).default([]),
});
export type AdvisorInput = z.infer<typeof advisorInputSchema>;

export type SkillSuggestion = { skill: string; rationale: string };
export type AdvisorResult =
  | { status: "ok"; suggestions: SkillSuggestion[] }
  | { status: "rate_limited" | "cap_reached" | "unavailable"; message: string };

/** Strict JSON schema the model must follow: an array of { skill, rationale }. */
export const advisorJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["suggestions"],
  properties: {
    suggestions: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["skill", "rationale"],
        properties: { skill: { type: "string" }, rationale: { type: "string" } },
      },
    },
  },
} as const;

const rawSchema = z.object({ suggestions: z.array(z.object({ skill: z.string(), rationale: z.string() })) });

/** Whether the event name is long enough to ask for suggestions. */
export function canSuggest(eventName: string): boolean {
  return eventName.trim().length >= ADVISOR_MIN_CHARS;
}

/**
 * Parse and clean model output: drop skills the user already has or needs,
 * remove duplicates, match master skill names, trim lengths and cap the count.
 * Returns null when the output is not the expected JSON shape.
 */
export function normalizeSuggestions(text: string, exclude: string[], masterSkills: string[] = []): SkillSuggestion[] | null {
  let parsed: unknown;
  try { parsed = JSON.parse(text); } catch { return null; }
  const result = rawSchema.safeParse(parsed);
  if (!result.success) return null;
  const seen = new Set(exclude.map(s => s.trim().toLowerCase()));
  const canonical = new Map(masterSkills.map(s => [s.toLowerCase(), s]));
  const out: SkillSuggestion[] = [];
  for (const item of result.data.suggestions) {
    const raw = item.skill.replace(/\s+/g, " ").trim().slice(0, 40);
    const rationale = item.rationale.replace(/\s+/g, " ").trim().slice(0, 200);
    if (!raw || !rationale) continue;
    const key = raw.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ skill: canonical.get(key) ?? raw, rationale });
    if (out.length >= MAX_SUGGESTIONS) break;
  }
  return out;
}

/** Suggestions still worth showing: not already added and not dismissed. */
export function visibleSuggestions(all: SkillSuggestion[], skillsNeeded: string[], dismissed: string[]): SkillSuggestion[] {
  const hidden = new Set([...skillsNeeded, ...dismissed].map(s => s.toLowerCase()));
  return all.filter(s => !hidden.has(s.skill.toLowerCase()));
}
