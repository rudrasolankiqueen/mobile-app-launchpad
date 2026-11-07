import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/privacy")({
  head: () => pageHead("Privacy", "How TeamFit handles Finder Cards, account information and contact sharing. Draft privacy notice."),
  component: Privacy,
});

function Privacy() {
  return <main className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
    <ShieldCheck className="size-8 text-primary" />
    <h1 className="mt-5 text-3xl font-bold">Privacy at TeamFit</h1>
    <p className="mt-3 text-sm text-muted-foreground">Draft notice · Updated November 7, 2026</p>
    <div className="mt-8 border-l-2 border-warning bg-warning/10 p-4 text-sm leading-relaxed"><strong>Before launch:</strong> this draft describes the current product and its planned contact-sharing flow. The operator's identity, privacy contact, retention periods and applicable legal details must be added before publication.</div>
    <div className="mt-10 space-y-9 text-sm leading-relaxed">
      <section><h2 className="text-lg font-semibold">What you share</h2><p className="mt-3 text-muted-foreground">An account uses your email and sign-in information. A Finder Card can include your display name, college, skills, optional evidence links and a personal note. Team listings and Looking to Join cards may also include event, project and availability information. Only share information you are comfortable making public.</p></section>
      <section><h2 className="text-lg font-semibold">Public cards and private contact details</h2><p className="mt-3 text-muted-foreground">Saved Finder Cards and published listings are publicly readable. Draft listings are visible only to their owner. Contact email addresses are not included in public cards or listing queries. The planned request flow shares contact details with both participants only after the recipient accepts.</p></section>
      <section><h2 className="text-lg font-semibold">Temporary cards and local storage</h2><p className="mt-3 text-muted-foreground">Choosing Use Once keeps your Finder Card in your browser's session storage rather than saving it to your account. Your sign-in session is stored in your browser so you can stay signed in. On a shared device, sign out and close the browser when you're finished.</p></section>
      <section><h2 className="text-lg font-semibold">Requests and notifications</h2><p className="mt-3 text-muted-foreground">The planned interest-request flow lets only its sender and recipient read the request. It keeps a copy of the Finder Card as it was sent, so later edits do not change that request. Account notifications are private to the account that receives them.</p></section>
      <section><h2 className="text-lg font-semibold">Services and future AI features</h2><p className="mt-3 text-muted-foreground">TeamFit uses Supabase for account and data services. Fonts are loaded from Google Fonts, which receives the network information needed to deliver them. The planned skill-gap advisor will process event details and skills with an AI service; its provider and data-handling terms need to be documented before that feature launches.</p></section>
      <section><h2 className="text-lg font-semibold">Your choices</h2><p className="mt-3 text-muted-foreground">You can choose whether to save a Finder Card, edit it, or delete your saved profile. Deleting a saved card does not remove snapshots already included in requests. Account deletion, data export and retention procedures need to be finalized before launch.</p><p className="mt-4"><Link to="/finder-card" className="font-medium text-primary hover:underline">Manage your Finder Card →</Link></p></section>
      <section className="border-t pt-7"><h2 className="text-lg font-semibold">Privacy contact</h2><p className="mt-3 text-muted-foreground">A verified privacy contact will be added before TeamFit launches. This draft is not a finalized legal policy.</p></section>
    </div>
  </main>;
}