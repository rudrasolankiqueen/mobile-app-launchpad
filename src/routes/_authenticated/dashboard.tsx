import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/teamfit/EmptyState";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — TeamFit" },
      { name: "description", content: "Your listings, requests and Finder Card." },
      { property: "og:title", content: "Dashboard — TeamFit" },
      { property: "og:description", content: "Your listings, requests and Finder Card." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { user, signOut } = useAuth();
  return (
    <main className="mx-auto max-w-4xl space-y-6 px-4 py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Welcome back 👋</h1>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
        <Button variant="outline" onClick={signOut}>Log out</Button>
      </div>
      <EmptyState title="Your dashboard is coming soon" description="Listings, requests and your saved Finder Card will show up here." />
    </main>
  );
}
