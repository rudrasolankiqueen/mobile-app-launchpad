import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { emptyFinderCard, fetchSavedFinderCard, saveFinderCard, validateFinderCard, type FinderCardValue } from "@/lib/finder-card";
import { FinderCardForm, type SaveMode } from "./FinderCardForm";
import { FinderCardDisplay } from "./FinderCardDisplay";

const SESSION_KEY = "teamfit:finder-card:once";

export function FinderCardEditor() {
  const [value, setValue] = useState<FinderCardValue>(emptyFinderCard);
  const [mode, setMode] = useState<SaveMode>("once");
  const [busy, setBusy] = useState(false);
  const { user, requireAuth } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as FinderCardValue;
      if (typeof parsed.displayName === "string" && typeof parsed.college === "string" && typeof parsed.personalNote === "string" && Array.isArray(parsed.skills) && parsed.skills.every((s) => typeof s.name === "string" && typeof s.evidence === "string" && typeof s.evidenceUrl === "string")) setValue(parsed);
    } catch { /* A disabled or invalid session store must not block editing. */ }
  }, []);

  async function submit() {
    const error = validateFinderCard(value);
    if (error) { toast.error(error); return; }
    if (mode === "once") {
      try {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify({ ...value, id: undefined }));
        toast.success("Finder Card ready for this session");
      } catch { toast.error("This browser could not keep your card for this session"); }
      return;
    }
    if (!user) {
      requireAuth("generic", () => toast("You're signed in. Save your Finder Card when you're ready."));
      return;
    }
    setBusy(true);
    try {
      const saved = await fetchSavedFinderCard(user.id);
      const card: FinderCardValue = { displayName: value.displayName, college: value.college, personalNote: value.personalNote, skills: value.skills };
      if (saved?.id) card.id = saved.id;
      const id = await saveFinderCard(user.id, card, true);
      setValue((v) => ({ ...v, id }));
      await queryClient.invalidateQueries({ queryKey: ["finder-card"] });
      toast.success("Finder Card saved");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Your card could not be saved"); }
    finally { setBusy(false); }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><p className="text-sm font-semibold text-primary">TeamFit</p><h1 className="mt-1 text-2xl font-bold">Your Finder Card</h1></div>
        {user && <Button asChild variant="outline"><Link to="/profile/edit">Edit saved profile</Link></Button>}
      </div>
      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0">
          <FinderCardForm value={value} onChange={setValue} saveMode={mode} onSaveModeChange={setMode} />
          <div className="mt-6 flex flex-wrap justify-end gap-2 border-t pt-5">
            <Button asChild variant="outline"><Link to="/">Cancel</Link></Button>
            <Button onClick={submit} disabled={busy}>{busy ? "Saving…" : mode === "save" ? "Save Profile" : "Use Once"}</Button>
          </div>
        </div>
        <aside className="min-w-0 space-y-4">
          <div><h2 className="mb-2 text-sm font-semibold text-muted-foreground">Full card</h2><FinderCardDisplay card={value} /></div>
          <div><h2 className="mb-2 text-sm font-semibold text-muted-foreground">Compact card</h2><FinderCardDisplay card={value} variant="compact" /></div>
        </aside>
      </div>
    </main>
  );
}