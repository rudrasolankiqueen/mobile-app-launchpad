import { useMemo, useState, type KeyboardEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { SkillTag } from "@/components/teamfit/SkillTag";
import { fetchSkillNames } from "@/lib/finder-card";
import { cn } from "@/lib/utils";

/** Hybrid tag input: pick from the master skill list or type your own. */
export function SkillTagInput({
  value,
  onChange,
  evidenceFor,
  placeholder = "Type a skill, e.g. React",
  max = 15,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  evidenceFor?: (name: string) => boolean;
  placeholder?: string;
  max?: number;
}) {
  const { data: options = [] } = useQuery({ queryKey: ["skills"], queryFn: fetchSkillNames, staleTime: 3_600_000 });
  const [text, setText] = useState("");
  const [focused, setFocused] = useState(false);
  const [active, setActive] = useState(0);
  const lower = value.map((v) => v.toLowerCase());

  const matches = useMemo(() => {
    const q = text.trim().toLowerCase();
    return options
      .filter((o) => !lower.includes(o.toLowerCase()) && (!q || o.toLowerCase().includes(q)))
      .slice(0, 8);
  }, [options, text, lower]);

  const trimmed = text.trim();
  const showCustom = trimmed && !options.some((o) => o.toLowerCase() === trimmed.toLowerCase());
  const items = [...matches, ...(showCustom ? [trimmed] : [])];

  function add(name: string) {
    const n = name.trim().slice(0, 40);
    if (!n || lower.includes(n.toLowerCase()) || value.length >= max) return;
    const canonical = options.find((o) => o.toLowerCase() === n.toLowerCase()) ?? n;
    onChange([...value, canonical]);
    setText("");
    setActive(0);
  }

  function onKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add(items[active] ?? trimmed);
    } else if (e.key === "Backspace" && !text && value.length) {
      onChange(value.slice(0, -1));
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    }
  }

  return (
    <div className="relative">
      <div className="flex min-h-11 flex-wrap items-center gap-1.5 rounded-lg border border-input bg-card px-2 py-1.5 focus-within:ring-2 focus-within:ring-ring/40">
        {value.map((s) => (
          <SkillTag
            key={s}
            label={s}
            hasEvidence={evidenceFor?.(s)}
            onRemove={() => onChange(value.filter((v) => v !== s))}
          />
        ))}
        <input
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setActive(0);
          }}
          onKeyDown={onKey}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 120)}
          placeholder={value.length ? "" : placeholder}
          aria-label="Add a skill"
          className="min-w-[8rem] flex-1 bg-transparent px-1 py-1 text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>
      {focused && items.length > 0 && (
        <ul className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-lg border bg-popover p-1 shadow-card">
          {items.map((o, i) => (
            <li key={o}>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  add(o);
                }}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm",
                  i === active ? "bg-primary-soft text-primary" : "hover:bg-muted",
                )}
              >
                {showCustom && i === items.length - 1 ? (
                  <>
                    <Plus className="size-3.5" /> Add “{o}”
                  </>
                ) : (
                  o
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
