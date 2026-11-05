import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SkillTag } from "@/components/teamfit/SkillTag";
import { TFCard } from "@/components/teamfit/TFCard";
import { Modal } from "@/components/teamfit/Modal";
import { EmptyState } from "@/components/teamfit/EmptyState";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TeamFit — Find your perfect team" },
      { name: "description", content: "Form skill-based student teams for hackathons, competitions and research." },
      { property: "og:title", content: "TeamFit — Find your perfect team" },
      { property: "og:description", content: "Form skill-based student teams for hackathons, competitions and research." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [open, setOpen] = useState(false);
  return (
    <main className="mx-auto max-w-4xl space-y-10 px-4 py-12">
      <header>
        <p className="font-mono text-xs text-accent">phase 0 · foundations</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">
          Find your perfect team. <span className="text-primary">Not just your friends.</span>
        </h1>
        <p className="mt-3 text-muted-foreground">TeamFit building blocks preview.</p>
      </header>

      <section className="grid gap-5 md:grid-cols-2">
        <TFCard interactive>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold">HackMIT 2026</h3>
              <p className="text-sm text-muted-foreground">Priya S. · IIT Bombay</p>
            </div>
            <span className="pill-tag bg-warning/15 text-warning-foreground">3 days left</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <SkillTag label="React" hasEvidence />
            <SkillTag label="Python" hasEvidence />
            <SkillTag label="Figma" />
          </div>
          <p className="mt-3 font-mono text-xs text-muted-foreground">github.com/priya/vision-app</p>
          <p className="mt-3 text-sm italic text-muted-foreground">"Prefer async, only join if you're serious."</p>
        </TFCard>
        <EmptyState
          title="No listings yet"
          description="Be the first to post a team listing for your event."
          action={<Button>Post a Listing</Button>}
        />
      </section>

      <section className="flex flex-wrap gap-3">
        <SkillTag label="ML" variant="needed" />
        <SkillTag label="Pitching" variant="neutral" onRemove={() => toast("Removed Pitching")} />
        <Button onClick={() => setOpen(true)}>Open modal</Button>
        <Button variant="outline" onClick={() => toast.success("Request sent!")}>Show toast</Button>
      </section>

      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Create a free account"
        description="It takes 30 seconds."
        footer={<Button onClick={() => setOpen(false)}>Got it</Button>}
      />
    </main>
  );
}
