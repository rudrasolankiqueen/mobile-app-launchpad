import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SkillTag } from "@/components/teamfit/SkillTag";
import { hasEvidence, safeUrl, type FinderCardValue, type SkillEntry } from "@/lib/finder-card";
import { SkillTagInput } from "./SkillTagInput";
import { cn } from "@/lib/utils";

export type SaveMode = "save" | "once";

/** Controlled Finder Card form, reused by listings, interest requests, Looking to Join and profile edit. */
export function FinderCardForm({
  value,
  onChange,
  saveMode,
  onSaveModeChange,
}: {
  value: FinderCardValue;
  onChange: (v: FinderCardValue) => void;
  saveMode?: SaveMode;
  onSaveModeChange?: (m: SaveMode) => void;
}) {
  const [more, setMore] = useState(
    () => value.personalNote.length > 0 || value.skills.some((s) => hasEvidence(s)),
  );
  const set = <K extends keyof FinderCardValue>(k: K, v: FinderCardValue[K]) => onChange({ ...value, [k]: v });

  function setSkillNames(names: string[]) {
    const byName = new Map(value.skills.map((s) => [s.name, s]));
    set("skills", names.map((n) => byName.get(n) ?? { name: n, evidence: "", evidenceUrl: "" }));
  }
  function patchSkill(i: number, patch: Partial<SkillEntry>) {
    set("skills", value.skills.map((s, j) => (j === i ? { ...s, ...patch } : s)));
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="fc-name">Display name *</Label>
          <Input id="fc-name" maxLength={60} value={value.displayName} onChange={(e) => set("displayName", e.target.value)} placeholder="Priya S." />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="fc-college">College</Label>
          <Input id="fc-college" maxLength={100} value={value.college} onChange={(e) => set("college", e.target.value)} placeholder="IIT Bombay" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Skills *</Label>
        <SkillTagInput
          value={value.skills.map((s) => s.name)}
          onChange={setSkillNames}
          evidenceFor={(n) => {
            const s = value.skills.find((x) => x.name === n);
            return s ? hasEvidence(s) : false;
          }}
        />
        <p className="text-xs text-muted-foreground">Pick from the list or type your own and press Enter.</p>
      </div>

      <button
        type="button"
        onClick={() => setMore(!more)}
        className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        aria-expanded={more}
      >
        <ChevronDown className={cn("size-4 transition-transform", more && "rotate-180")} />
        {more ? "Hide details" : "Add more details"}
      </button>

      {more && (
        <div className="space-y-5 rounded-xl border bg-muted/40 p-4">
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium">Evidence per skill</p>
              <p className="text-xs text-muted-foreground">
                Skills with a project, result or link get a teal checkmark.
              </p>
            </div>
            {value.skills.length === 0 && <p className="text-sm text-muted-foreground">Add skills above first.</p>}
            {value.skills.map((s, i) => {
              const badUrl = s.evidenceUrl.trim() !== "" && !safeUrl(s.evidenceUrl);
              return (
                <div key={s.name} className="space-y-2 rounded-lg border bg-card p-3">
                  <SkillTag label={s.name} hasEvidence={hasEvidence(s)} />
                  <div className="grid gap-2 sm:grid-cols-2">
                    <Input
                      aria-label={`${s.name} evidence`}
                      maxLength={200}
                      value={s.evidence}
                      onChange={(e) => patchSkill(i, { evidence: e.target.value })}
                      placeholder="Project, result or certificate"
                    />
                    <Input
                      aria-label={`${s.name} link`}
                      maxLength={300}
                      value={s.evidenceUrl}
                      onChange={(e) => patchSkill(i, { evidenceUrl: e.target.value })}
                      placeholder="github.com/you/project"
                      className={cn("font-mono text-xs", badUrl && "border-destructive")}
                    />
                  </div>
                  {badUrl && <p className="text-xs text-destructive">That link doesn't look like a web address.</p>}
                </div>
              );
            })}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="fc-note">Personal note</Label>
            <Textarea
              id="fc-note"
              maxLength={300}
              rows={3}
              value={value.personalNote}
              onChange={(e) => set("personalNote", e.target.value)}
              placeholder="e.g. Prefer async. Only join if you're serious."
            />
            <p className="text-right text-xs text-muted-foreground">{value.personalNote.length}/300</p>
          </div>
        </div>
      )}

      {saveMode && onSaveModeChange && (
        <div className="grid gap-2 sm:grid-cols-2" role="radiogroup" aria-label="Save this card?">
          {(
            [
              ["save", "Save Profile", "Reuse and edit it next time"],
              ["once", "Use Once", "Only for this time"],
            ] as const
          ).map(([m, title, sub]) => (
            <button
              key={m}
              type="button"
              role="radio"
              aria-checked={saveMode === m}
              onClick={() => onSaveModeChange(m)}
              className={cn(
                "rounded-lg border p-3 text-left transition-colors",
                saveMode === m ? "border-primary bg-primary-soft" : "bg-card hover:border-primary/40",
              )}
            >
              <p className="text-sm font-semibold">{title}</p>
              <p className="text-xs text-muted-foreground">{sub}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
