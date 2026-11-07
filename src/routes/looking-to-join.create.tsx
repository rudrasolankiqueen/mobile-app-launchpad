import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/page-head";
import { PlaceholderPage } from "@/components/teamfit/PlaceholderPage";

export const Route = createFileRoute("/looking-to-join/create")({
  head: () => pageHead("Looking to Join", "Share what you bring and the team you are looking for. Publishing arrives in a later phase."),
  component: () => <PlaceholderPage title="Looking to Join" description="Share what you bring and the team you are looking for. Publishing arrives in a later phase." />,
});
