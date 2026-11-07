import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/page-head";
import { PlaceholderPage } from "@/components/teamfit/PlaceholderPage";

export const Route = createFileRoute("/looking-to-join/$id_/edit")({
  head: () => pageHead("Edit Looking to Join Card", "Update what you are looking for and your availability. Card editing arrives in a later phase."),
  component: () => <PlaceholderPage title="Edit Looking to Join Card" description="Update what you are looking for and your availability. Card editing arrives in a later phase." />,
});
