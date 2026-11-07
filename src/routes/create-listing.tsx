import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/page-head";
import { PlaceholderPage } from "@/components/teamfit/PlaceholderPage";

export const Route = createFileRoute("/create-listing")({
  head: () => pageHead("Post a Listing", "Create a team for your next event. Listing creation arrives in a later phase."),
  component: () => <PlaceholderPage title="Post a Listing" description="Create a team for your next event. Listing creation arrives in a later phase." />,
});
