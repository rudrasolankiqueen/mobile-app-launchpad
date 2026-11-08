import { queryOptions } from "@tanstack/react-query";
import { exploreListings, getPublicListing } from "./listings.functions";
import type { ExploreFilters } from "./listings";
export const exploreOptions = (filters: ExploreFilters) => queryOptions({ queryKey: ["listings", "explore", filters], queryFn: () => exploreListings({ data: filters }) });
export const listingOptions = (id: string) => queryOptions({ queryKey: ["listings", id], queryFn: () => getPublicListing({ data: id }) });