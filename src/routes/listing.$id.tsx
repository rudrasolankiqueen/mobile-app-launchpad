import { createFileRoute, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { z } from "zod";
import { pageHead } from "@/lib/page-head";
import { ListingDetail } from "@/components/teamfit/ListingDetail";
import { ListingError, ListingMissing } from "@/components/teamfit/ListingBoundary";
import { listingOptions } from "@/lib/listings.queries";

export const Route = createFileRoute("/listing/$id")({
  loader: async ({ context, params }) => { if (!z.string().uuid().safeParse(params.id).success) throw notFound(); const listing = await context.queryClient.ensureQueryData(listingOptions(params.id)); if (!listing) throw notFound(); return listing; },
  head: ({ loaderData }) => pageHead(loaderData?.event_name ?? "Listing unavailable", loaderData?.description?.slice(0, 160) || "Discover this TeamFit event, its organizer and the skills the team needs."),
  errorComponent: ListingError,
  notFoundComponent: ListingMissing,
  component: ListingPage,
});
function ListingPage() { const { id } = Route.useParams(); const { data } = useSuspenseQuery(listingOptions(id)); if (!data) return <ListingMissing />; return <ListingDetail listing={data} />; }
