import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/page-head";
import { PlaceholderPage } from "@/components/teamfit/PlaceholderPage";

export const Route = createFileRoute("/listing/$id")({
  head: () => pageHead("Team Listing", "Event details, skills needed and interest requests will appear here in a later phase."),
  component: () => <PlaceholderPage title="Team Listing" description="Event details, skills needed and interest requests will appear here in a later phase." />,
});
