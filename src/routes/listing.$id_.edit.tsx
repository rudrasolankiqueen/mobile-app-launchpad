import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/page-head";
import { PlaceholderPage } from "@/components/teamfit/PlaceholderPage";

export const Route = createFileRoute("/listing/$id_/edit")({
  head: () => pageHead("Edit Listing", "Update your event and team requirements. Listing editing arrives in a later phase."),
  component: () => <PlaceholderPage title="Edit Listing" description="Update your event and team requirements. Listing editing arrives in a later phase." />,
});
