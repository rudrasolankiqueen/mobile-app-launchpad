import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Fingerprint, ShieldCheck, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { pageHead } from "@/lib/page-head";
import campusImage from "@/assets/teamfit-campus.jpg";

export const Route = createFileRoute("/about")({
  head: () => pageHead("About", "TeamFit helps college students form teams around complementary skills and shared ambition."),
  component: About,
});

function About() {
  return <main>
    <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-primary">About TeamFit</p>
      <h1 className="mt-4 max-w-2xl text-3xl leading-tight font-bold sm:text-4xl">Great ideas deserve the right team.</h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">Friendship is a good start. Complementary skills make it a team.</p>
      <img src={campusImage} alt="Students working together on a campus project" width={1600} height={912} loading="lazy" className="mt-10 aspect-[16/7] w-full rounded-lg object-cover object-center" />
    </section>
    <section className="border-y bg-card">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 sm:px-8 md:grid-cols-2"><h2 className="text-2xl font-bold">Built around what you bring.<br />Not who you already know.</h2><div className="space-y-4 text-sm leading-relaxed text-muted-foreground"><p>TeamFit is a lightweight space for college students to find teammates for hackathons, competitions, research and academic projects. A designer can meet a developer. A researcher can find someone who loves telling the story.</p><p>Your Finder Card captures your skills, optional evidence and working style. Save it for next time or use it once. You don't need a permanent, polished profile to make a meaningful connection.</p></div></div>
    </section>
    <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8"><div className="grid gap-8 md:grid-cols-3">{[{ Icon: Fingerprint, title: "Skills before status", text: "What you can contribute matters more than a perfect résumé. Evidence adds context, not a verification label." }, { Icon: UsersRound, title: "Room for different styles", text: "A personal note makes space for how you work, when you're available and what commitment means to you." }, { Icon: ShieldCheck, title: "Contact by mutual choice", text: "Contact emails stay private until an interest request is accepted. You choose who you connect with." }].map(({ Icon, title, text }) => <div key={title}><Icon className="size-7 text-primary" /><h2 className="mt-4 text-lg font-semibold">{title}</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p></div>)}</div><div className="mt-12 border-t pt-8"><Button asChild size="lg"><Link to="/finder-card">Bring your skills to TeamFit<ArrowUpRight /></Link></Button></div></section>
  </main>;
}