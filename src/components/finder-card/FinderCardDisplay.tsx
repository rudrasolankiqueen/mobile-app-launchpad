import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { SkillTag } from "@/components/teamfit/SkillTag";
import { TFCard } from "@/components/teamfit/TFCard";
import { hasEvidence, safeUrl, type FinderCardValue } from "@/lib/finder-card";

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("") || "?";
}

export function FinderCardDisplay({
  card,
  variant = "full",
  className,
}: {
  card: FinderCardValue;
  variant?: "compact" | "full";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const compact = variant === "compact";
  const shown = compact ? card.skills.slice(0, 4) : card.skills;
  const withEvidence = card.skills.filter(hasEvidence);

  return (
    <TFCard className={className} interactive={compact}>
      <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
          {initials(card.displayName)}
        </div>
        <div className="min-w-0">
          <p className="truncate font-semibold">{card.displayName || "Your name"}</p>
          {card.college && <p className="truncate text-sm text-muted-foreground">{card.college}</p>}
        </div>
      </div>

      {card.skills.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {shown.map((s) => (
            <SkillTag key={s.name} label={s.name} hasEvidence={hasEvidence(s)} />
          ))}
          {compact && card.skills.length > 4 && (
            <span className="pill-tag bg-muted text-muted-foreground">+{card.skills.length - 4}</span>
          )}
        </div>
      )}

      {card.personalNote && (
        <p className={`mt-3 text-sm italic text-muted-foreground ${compact ? "line-clamp-2" : ""}`}>
          “{card.personalNote}”
        </p>
      )}

      {!compact && withEvidence.length > 0 && (
        <div className="mt-4 border-t pt-3">
          <button type="button" onClick={() => setOpen(!open)} className="text-sm font-medium text-primary hover:underline">
            {open ? "Hide evidence" : `Show evidence (${withEvidence.length})`}
          </button>
          {open && (
            <ul className="mt-3 space-y-2">
              {withEvidence.map((s) => {
                const url = safeUrl(s.evidenceUrl);
                return (
                  <li key={s.name} className="text-sm">
                    <span className="font-medium">{s.name}</span>
                    {s.evidence && <span className="text-muted-foreground"> — {s.evidence}</span>}
                    {url && (
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="mt-0.5 flex items-center gap-1 break-all font-mono text-xs text-accent hover:underline"
                      >
                        {url.replace(/^https?:\/\//, "")} <ExternalLink className="size-3 shrink-0" />
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </TFCard>
  );
}
