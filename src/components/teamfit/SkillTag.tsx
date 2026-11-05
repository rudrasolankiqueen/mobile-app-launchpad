import { BadgeCheck, X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const skillTagVariants = cva("pill-tag border transition-colors", {
  variants: {
    variant: {
      default: "border-primary/15 bg-primary-soft text-primary",
      needed: "border-dashed border-secondary/40 bg-card text-foreground",
      neutral: "border-border bg-muted text-foreground",
    },
  },
  defaultVariants: { variant: "default" },
});

type SkillTagProps = VariantProps<typeof skillTagVariants> & {
  label: string;
  hasEvidence?: boolean | undefined;
  onRemove?: () => void;
  className?: string | undefined;
};

export function SkillTag({ label, hasEvidence, onRemove, variant, className }: SkillTagProps) {
  return (
    <span className={cn(skillTagVariants({ variant }), className)}>
      {label}
      {hasEvidence && (
        <BadgeCheck className="size-4 text-accent" aria-label="Has evidence">
          <title>Backed by evidence</title>
        </BadgeCheck>
      )}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${label}`}
          className="-mr-1 rounded-full p-0.5 opacity-60 hover:bg-foreground/10 hover:opacity-100"
        >
          <X className="size-3" />
        </button>
      )}
    </span>
  );
}
