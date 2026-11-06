import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Modal } from "@/components/teamfit/Modal";
import { FinderCardForm } from "@/components/finder-card/FinderCardForm";
import { FinderCardDisplay } from "@/components/finder-card/FinderCardDisplay";
import { useAuth } from "@/lib/auth";
import {
  deleteFinderCard,
  emptyFinderCard,
  fetchSavedFinderCard,
  saveFinderCard,
  validateFinderCard,
  type FinderCardValue,
} from "@/lib/finder-card";

export const Route = createFileRoute("/_authenticated/profile/edit")({
  head: () => ({
    meta: [
      { title: "Edit your Finder Card — TeamFit" },
      { name: "description", content: "Update your skills, evidence and personal note." },
      { property: "og:title", content: "Edit your Finder Card — TeamFit" },
      { property: "og:description", content: "Update your skills, evidence and personal note." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: EditProfile,
});

function EditProfile() {
  const { user } = useAuth();
  const userId = user?.id ?? "";
  const navigate = useNavigate();
  const qc = useQueryClient();
  const key = ["finder-card", "saved", userId];
  const { data, isLoading, error, refetch } = useQuery({ queryKey: key, queryFn: () => fetchSavedFinderCard(userId), enabled: !!userId });
  const [value, setValue] = useState<FinderCardValue>(emptyFinderCard);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (data) setValue(data);
  }, [data]);

  const save = useMutation({
    mutationFn: () => saveFinderCard(userId, value, true),
    onSuccess: (id) => {
      setValue((v) => ({ ...v, id }));
      qc.invalidateQueries({ queryKey: ["finder-card"] });
      toast.success("Finder Card saved");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: () => {
      if (!value.id) throw new Error("No saved Finder Card to delete");
      return deleteFinderCard(value.id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["finder-card"] });
      setValue(emptyFinderCard);
      setConfirmDelete(false);
      toast.success("Finder Card deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function onSave() {
    const err = validateFinderCard(value);
    if (err) return void toast.error(err);
    save.mutate();
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-bold">Your Finder Card</h1>
      <p className="mt-1 text-sm text-muted-foreground">Saved once, reused whenever you post or apply.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="min-w-0">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-10" /> <Skeleton className="h-11" /> <Skeleton className="h-6 w-40" />
            </div>
          ) : error ? (
            <div role="alert" className="space-y-3"><p className="text-sm text-destructive">Your saved card could not be loaded.</p><Button variant="outline" onClick={() => refetch()}>Try again</Button></div>
          ) : (
            <FinderCardForm value={value} onChange={setValue} />
          )}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t pt-5">
            {value.id ? (
              <Button variant="ghost" className="text-destructive hover:text-destructive" onClick={() => setConfirmDelete(true)}>
                Delete profile
              </Button>
            ) : (
              <span />
            )}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate({ to: "/dashboard" })}>Cancel</Button>
              <Button onClick={onSave} disabled={save.isPending || remove.isPending || isLoading || !!error}>{save.isPending ? "Saving…" : "Save"}</Button>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Preview</p>
          <FinderCardDisplay card={value} />
          <FinderCardDisplay card={value} variant="compact" />
        </div>
      </div>

      <Modal
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Delete your Finder Card?"
        description="Your saved skills, evidence and note will be removed. Requests you already sent keep their copy."
        footer={
          <>
            <Button variant="outline" onClick={() => setConfirmDelete(false)}>Keep it</Button>
            <Button variant="destructive" onClick={() => remove.mutate()} disabled={remove.isPending}>
              Delete
            </Button>
          </>
        }
      />
    </main>
  );
}
