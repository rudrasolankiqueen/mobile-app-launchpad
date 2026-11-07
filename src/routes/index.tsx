import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Fingerprint, Search, Handshake, Check, Code2, FlaskConical, Trophy, Lightbulb } from "lucide-react";
import { FinderCardDisplay } from "@/components/finder-card/FinderCardDisplay";
import campusImage from "@/assets/teamfit-campus.jpg";

const examples = [
  { displayName: "Priya S.", college: "IIT Bombay", skills: [{ name: "React", evidence: "Built a campus events app", evidenceUrl: "" }, { name: "Python", evidence: "Computer vision project", evidenceUrl: "" }, { name: "Figma", evidence: "", evidenceUrl: "" }], personalNote: "Prefer async. Ready to build something that matters." },
  { displayName: "Arjun M.", college: "BITS Pilani", skills: [{ name: "Machine Learning", evidence: "Image classification project", evidenceUrl: "" }, { name: "Python", evidence: "", evidenceUrl: "" }, { name: "Data Analysis", evidence: "Research internship", evidenceUrl: "" }], personalNote: "Weekend deep-work sessions and a good whiteboard." },
  { displayName: "Meera K.", college: "NIT Trichy", skills: [{ name: "UI/UX Design", evidence: "Student app redesign", evidenceUrl: "" }, { name: "Pitching", evidence: "", evidenceUrl: "" }, { name: "Research", evidence: "", evidenceUrl: "" }], personalNote: "Big on clear communication. Let's make it useful." },
];

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
  const { user } = useAuth();
  return (
    <main>
      <section className="campus-hero relative isolate flex items-center overflow-hidden bg-overlay text-cover-foreground">
        <img src={campusImage} alt="College students collaborating on a laptop and robotics prototype" width={1600} height={912} fetchPriority="high" className="absolute inset-0 -z-20 h-full w-full object-cover object-center" />
        <div className="campus-shade absolute inset-0 -z-10" />
        <div className="mx-auto w-full max-w-7xl px-5 py-9 sm:px-8 sm:py-12">
          <p className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-cover-muted"><span className="h-0.5 w-7 bg-accent" />TeamFit · Your campus. Your next team.</p>
          <h1 className="max-w-lg text-[32px] leading-[1.15] font-extrabold sm:text-[44px] lg:text-[48px]">Find your perfect team.<br /><span className="text-cover-muted">Not just your friends.</span></h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-cover-muted sm:text-base">Different skills. Shared ambition. Meet the people who bring what your next big idea needs.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg" className="px-5"><Link to={user ? "/dashboard" : "/explore"}>{user ? "Go to Dashboard" : "Find Teammates"}<ArrowRight /></Link></Button>
            <Button asChild variant="outline" size="lg" className="border-cover-foreground/40 bg-transparent px-5 text-cover-foreground hover:bg-cover-foreground/10 hover:text-cover-foreground"><Link to="/create-listing">Post a Listing<ArrowUpRight /></Link></Button>
          </div>
        </div>
      </section>
      <div className="border-b bg-card">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-5 py-6 text-sm text-muted-foreground sm:px-8 md:grid-cols-4">
          {[{ Icon: Code2, label: "Hackathons" }, { Icon: Trophy, label: "Competitions" }, { Icon: FlaskConical, label: "Research" }, { Icon: Lightbulb, label: "Campus projects" }].map(({ Icon, label }) => <div key={label} className="flex items-center justify-center gap-2.5"><Icon className="size-4 text-primary" />{label}</div>)}
        </div>
      </div>
      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-18">
        <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-widest text-primary">How it works</p><h2 className="mt-3 text-2xl font-bold sm:text-3xl">Less networking. More building.</h2></div><span className="text-sm text-muted-foreground">Three steps to your next team.</span></div>
        <div className="mt-9 grid gap-8 md:grid-cols-3">
          {[{ Icon: Fingerprint, title: "Bring your skills", text: "A few skills, a little evidence, and a note about how you work. No polished résumé required." }, { Icon: Search, title: "Find your complement", text: "Look for a team that needs what you bring, or post your idea and find the skills you're missing." }, { Icon: Handshake, title: "Make it a team", text: "Send an interest request. When it's accepted, exchange contact details and start building." }].map(({ Icon, title, text }, i) => <div key={title} className="border-t pt-5"><div className="flex items-center justify-between"><Icon className="size-7 text-primary" /><span className="font-mono text-xs text-muted-foreground">0{i + 1}</span></div><h3 className="mt-5 text-lg font-semibold">{title}</h3><p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">{text}</p></div>)}
        </div>
      </section>
      <section className="border-y bg-muted/60">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-18">
          <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-widest text-primary">The Finder Card</p><h2 className="mt-3 text-2xl font-bold sm:text-3xl">Your skills tell your story.</h2><p className="mt-3 text-sm text-muted-foreground">A small card. A much better starting point.</p></div><Button asChild variant="link" className="px-0"><Link to="/finder-card">Create your card<ArrowRight /></Link></Button></div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">{examples.map((card) => <FinderCardDisplay key={card.displayName} card={card} variant="compact" />)}</div>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground"><span>Illustrative student cards · not real profiles</span><span className="inline-flex items-center gap-1.5"><Check className="size-3.5 text-evidence" />Evidence provided, not independently verified</span></div>
        </div>
      </section>
      <section className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-5 py-14 sm:px-8 md:flex-row md:items-center"><div><h2 className="text-2xl font-bold">Your next teammate is out there.</h2><p className="mt-2 text-sm text-muted-foreground">Start with what you bring. Build something together.</p></div><Button asChild size="lg"><Link to="/explore">Explore TeamFit<ArrowUpRight /></Link></Button></section>
    </main>
  );
}
