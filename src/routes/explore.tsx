import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/page-head";
import { PlaceholderPage } from "@/components/teamfit/PlaceholderPage";

export const Route = createFileRoute("/explore")({
  head: () => pageHead("Explore teams", "Discover teams and students with complementary skills. Team discovery arrives in a later phase."),
  component: () => <PlaceholderPage title="Explore teams" description="Discover teams and students with complementary skills. Team discovery arrives in a later phase." />,
});
