import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/page-head";
import { ListingEditor } from "@/components/teamfit/ListingEditor";

export const Route = createFileRoute("/create-listing")({
  head: () => pageHead("Post a Listing", "Find teammates for your next event with a skill-based TeamFit listing."),
  component: () => <ListingEditor />,
});
