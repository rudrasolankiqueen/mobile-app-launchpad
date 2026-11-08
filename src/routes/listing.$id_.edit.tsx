import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/page-head";
import { ListingEditor } from "@/components/teamfit/ListingEditor";

export const Route = createFileRoute("/listing/$id_/edit")({
  head: () => pageHead("Edit Listing", "Update your TeamFit event and team requirements."),
  component: EditListing,
});
function EditListing() { const { id } = Route.useParams(); return <ListingEditor id={id} />; }
