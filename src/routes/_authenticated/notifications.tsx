import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/page-head";
import { PlaceholderPage } from "@/components/teamfit/PlaceholderPage";

export const Route = createFileRoute("/_authenticated/notifications")({
  head: () => pageHead("Notifications", "Your request updates and event reminders will appear here in a later phase."),
  component: () => <PlaceholderPage title="Notifications" description="Your request updates and event reminders will appear here in a later phase." />,
});
