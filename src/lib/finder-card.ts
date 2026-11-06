import { supabase } from "@/integrations/supabase/client";

export type SkillEntry = { name: string; evidence: string; evidenceUrl: string };

export type FinderCardValue = {
  id?: string;
  displayName: string;
  college: string;
  personalNote: string;
  skills: SkillEntry[];
};

export const emptyFinderCard: FinderCardValue = {
  displayName: "",
  college: "",
  personalNote: "",
  skills: [],
};

/** A skill earns the teal checkmark only when it has evidence text or a valid link. */
export function hasEvidence(s: Pick<SkillEntry, "evidence" | "evidenceUrl">): boolean {
  return s.evidence.trim().length > 0 || safeUrl(s.evidenceUrl) !== null;
}

/** Only http(s) links are allowed; anything else (javascript:, data:) is rejected. */
export function safeUrl(raw: string): string | null {
  const v = raw.trim();
  if (!v) return null;
  try {
    const u = new URL(/^[a-z]+:/i.test(v) ? v : `https://${v}`);
    return u.protocol === "http:" || u.protocol === "https:" ? u.toString() : null;
  } catch {
    return null;
  }
}

export function validateFinderCard(v: FinderCardValue): string | null {
  if (!v.displayName.trim()) return "Add your display name";
  if (v.skills.length === 0) return "Add at least one skill";
  const bad = v.skills.find((s) => s.evidenceUrl.trim() && !safeUrl(s.evidenceUrl));
  if (bad) return `The link for ${bad.name} isn't a valid web address`;
  return null;
}

type Row = {
  id: string;
  display_name: string;
  college: string | null;
  personal_note: string | null;
  skill_evidence?: { skill_name: string; evidence: string | null; evidence_url: string | null; position: number }[];
};

export function fromRow(r: Row): FinderCardValue {
  return {
    id: r.id,
    displayName: r.display_name,
    college: r.college ?? "",
    personalNote: r.personal_note ?? "",
    skills: [...(r.skill_evidence ?? [])]
      .sort((a, b) => a.position - b.position)
      .map((s) => ({ name: s.skill_name, evidence: s.evidence ?? "", evidenceUrl: s.evidence_url ?? "" })),
  };
}

const SELECT = "id, display_name, college, personal_note, skill_evidence(skill_name, evidence, evidence_url, position)";

export async function fetchSavedFinderCard(userId: string): Promise<FinderCardValue | null> {
  const { data, error } = await supabase
    .from("finder_cards")
    .select(SELECT)
    .eq("user_id", userId)
    .eq("is_saved", true)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data ? fromRow(data as Row) : null;
}

export async function fetchFinderCard(id: string): Promise<FinderCardValue | null> {
  const { data, error } = await supabase.from("finder_cards").select(SELECT).eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? fromRow(data as Row) : null;
}

/** Creates or updates a card and replaces its skills. Returns the card id. */
export async function saveFinderCard(userId: string, v: FinderCardValue, isSaved: boolean): Promise<string> {
  const payload = {
    user_id: userId,
    display_name: v.displayName.trim(),
    college: v.college.trim() || null,
    personal_note: v.personalNote.trim() || null,
    is_saved: isSaved,
  };
  let id = v.id;
  if (id) {
    const { error } = await supabase.from("finder_cards").update(payload).eq("id", id);
    if (error) throw error;
    const { error: delErr } = await supabase.from("skill_evidence").delete().eq("finder_card_id", id);
    if (delErr) throw delErr;
  } else {
    const { data, error } = await supabase.from("finder_cards").insert(payload).select("id").single();
    if (error) throw error;
    id = data.id;
  }
  if (!id) throw new Error("The Finder Card could not be saved");
  if (v.skills.length) {
    const { error } = await supabase.from("skill_evidence").insert(
      v.skills.map((s, i) => ({
        finder_card_id: id,
        skill_name: s.name,
        evidence: s.evidence.trim() || null,
        evidence_url: safeUrl(s.evidenceUrl),
        position: i,
      })),
    );
    if (error) throw error;
  }
  return id;
}

export async function deleteFinderCard(id: string) {
  const { error } = await supabase.from("finder_cards").delete().eq("id", id);
  if (error) throw error;
}

export async function fetchSkillNames(): Promise<string[]> {
  const { data, error } = await supabase.from("skills").select("name").order("name");
  if (error) throw error;
  return data.map((d) => d.name);
}
