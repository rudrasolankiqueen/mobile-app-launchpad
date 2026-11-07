import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  it("matches a page for / instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });
  it.each([
    ["/about", "/about"], ["/privacy", "/privacy"], ["/explore", "/explore"],
    ["/create-listing", "/create-listing"], ["/listing/example", "/listing/$id"],
    ["/listing/example/edit", "/listing/$id_/edit"],
    ["/looking-to-join/create", "/looking-to-join/create"],
    ["/looking-to-join/example/edit", "/looking-to-join/$id_/edit"],
    ["/notifications", "/_authenticated/notifications"],
  ])("matches %s to its own screen", (path, routeId) => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    expect(router.matchRoutes(path).at(-1)?.routeId).toBe(routeId);
  });
});
